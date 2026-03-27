import dotenv from "dotenv";
import { sequelize } from "../models/index.js";
import { scrapeUclaOfferingSnapshot } from "../providers/uclaOffering.provider.js";
import {
  listDueOfferings,
  persistOfferingSnapshot,
} from "../services/offeringTracking.service.js";

dotenv.config();

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = Number.parseInt(process.env.OFFERING_POLL_LIMIT ?? "25", 10);

function placeholderParser() {
  throw new Error(
    "UCLA HTML parsing is not wired up yet. Replace placeholderParser with a real parser before enabling polling."
  );
}

async function main() {
  await sequelize.authenticate();

  const dueOfferings = await listDueOfferings({ limit: LIMIT });

  if (dueOfferings.length === 0) {
    console.log("No offerings are due for scraping.");
    return;
  }

  console.log(`Found ${dueOfferings.length} offering(s) due for scraping.`);

  for (const offering of dueOfferings) {
    const label = `${offering.term} :: ${offering.externalOfferingId}`;

    if (DRY_RUN) {
      console.log(`[dry-run] ${label} -> ${offering.sourceUrl ?? "missing sourceUrl"}`);
      continue;
    }

    const snapshot = await scrapeUclaOfferingSnapshot({
      offering,
      parseHtml: placeholderParser,
    });

    const result = await persistOfferingSnapshot({
      offeringId: offering.id,
      snapshot,
    });

    console.log(
      `${label} scraped. changed=${result.hadChange} stored=${result.snapshotStored}`
    );
  }
}

main()
  .then(async () => {
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await sequelize.close();
    process.exit(1);
  });
