import { Op } from "sequelize";
import {
  Course,
  CourseOffering,
  OfferingSnapshot,
  UserTrackedOffering,
  sequelize,
} from "../models/index.js";

const SNAPSHOT_FIELDS = [
  "status",
  "capacity",
  "enrolled",
  "spotsOpen",
  "waitlistCapacity",
  "waitlistTaken",
];

function toIntegerOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeStatus(status) {
  if (!status) {
    return "unknown";
  }

  return String(status).trim().toLowerCase();
}

function normalizeSnapshot(snapshot = {}) {
  return {
    scrapedAt: snapshot.scrapedAt ? new Date(snapshot.scrapedAt) : new Date(),
    status: normalizeStatus(snapshot.status),
    capacity: toIntegerOrNull(snapshot.capacity),
    enrolled: toIntegerOrNull(snapshot.enrolled),
    spotsOpen: toIntegerOrNull(snapshot.spotsOpen),
    waitlistCapacity: toIntegerOrNull(snapshot.waitlistCapacity),
    waitlistTaken: toIntegerOrNull(snapshot.waitlistTaken),
    rawPayload: snapshot.rawPayload ?? {},
  };
}

function pickComparableSnapshot(snapshot) {
  return SNAPSHOT_FIELDS.reduce((accumulator, field) => {
    accumulator[field] = snapshot[field] ?? null;
    return accumulator;
  }, {});
}

function snapshotsMatch(currentSnapshot, nextSnapshot) {
  return SNAPSHOT_FIELDS.every((field) => (currentSnapshot[field] ?? null) === (nextSnapshot[field] ?? null));
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function computeNextScrapeAt({ offering, snapshot, watcherCount = 0, hadChange = false, now = new Date() }) {
  const priority = Math.max(0, offering.scrapePriority ?? 0);
  const hasWatchers = watcherCount > 0;
  const isFull = snapshot.spotsOpen !== null && snapshot.spotsOpen <= 0;
  const isWaitlistActive = snapshot.waitlistCapacity !== null && snapshot.waitlistCapacity > 0;

  let minutes = 240;

  if (hasWatchers) {
    minutes = isFull || isWaitlistActive ? 15 : 30;
  }

  if (hadChange) {
    minutes = Math.min(minutes, 15);
  }

  minutes = Math.max(10, minutes - priority * 5);
  return addMinutes(now, minutes);
}

export async function listDueOfferings({ limit = 50, now = new Date() } = {}) {
  return CourseOffering.findAll({
    where: {
      isActive: true,
      [Op.or]: [
        { nextScrapeAt: null },
        { nextScrapeAt: { [Op.lte]: now } },
      ],
    },
    include: [
      {
        model: Course,
        as: "course",
      },
    ],
    order: [
      ["scrapePriority", "DESC"],
      ["nextScrapeAt", "ASC"],
      ["updatedAt", "ASC"],
    ],
    limit,
  });
}

export async function persistOfferingSnapshot({
  offeringId,
  snapshot,
  shouldPersistUnchanged = false,
}) {
  const normalizedSnapshot = normalizeSnapshot(snapshot);
  const transaction = await sequelize.transaction();

  try {
    const offering = await CourseOffering.findByPk(offeringId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
      include: [
        {
          model: UserTrackedOffering,
          as: "trackingSubscriptions",
          attributes: ["id", "userId"],
          required: false,
        },
      ],
    });

    if (!offering) {
      throw new Error(`Course offering ${offeringId} not found`);
    }

    const latestSnapshot = await OfferingSnapshot.findOne({
      where: { offeringId },
      order: [["scrapedAt", "DESC"]],
      transaction,
    });

    const nextComparableSnapshot = pickComparableSnapshot(normalizedSnapshot);
    const previousComparableSnapshot = latestSnapshot
      ? pickComparableSnapshot(latestSnapshot)
      : null;
    const hadChange = !previousComparableSnapshot
      || !snapshotsMatch(previousComparableSnapshot, nextComparableSnapshot);
    const watcherCount = offering.trackingSubscriptions?.length ?? 0;
    const nextScrapeAt = computeNextScrapeAt({
      offering,
      snapshot: nextComparableSnapshot,
      watcherCount,
      hadChange,
      now: normalizedSnapshot.scrapedAt,
    });

    await offering.update(
      {
        ...nextComparableSnapshot,
        lastScrapedAt: normalizedSnapshot.scrapedAt,
        lastChangedAt: hadChange ? normalizedSnapshot.scrapedAt : offering.lastChangedAt,
        nextScrapeAt,
      },
      { transaction }
    );

    let storedSnapshot = null;

    if (hadChange || shouldPersistUnchanged) {
      storedSnapshot = await OfferingSnapshot.create(
        {
          offeringId,
          ...normalizedSnapshot,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      hadChange,
      nextScrapeAt,
      snapshotStored: Boolean(storedSnapshot),
      snapshot: storedSnapshot,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
