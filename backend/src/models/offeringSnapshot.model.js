import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OfferingSnapshot = sequelize.define(
  "OfferingSnapshot",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    offeringId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "course_offerings",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    scrapedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unknown",
    },
    capacity: {
      type: DataTypes.INTEGER,
    },
    enrolled: {
      type: DataTypes.INTEGER,
    },
    spotsOpen: {
      type: DataTypes.INTEGER,
    },
    waitlistCapacity: {
      type: DataTypes.INTEGER,
    },
    waitlistTaken: {
      type: DataTypes.INTEGER,
    },
    rawPayload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    tableName: "offering_snapshots",
    timestamps: false,
    indexes: [
      { fields: ["offeringId"] },
      { fields: ["scrapedAt"] },
      { fields: ["offeringId", "scrapedAt"] },
    ],
  }
);

export default OfferingSnapshot;
