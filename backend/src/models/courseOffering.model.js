import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CourseOffering = sequelize.define(
  "CourseOffering",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    externalOfferingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectionCode: {
      type: DataTypes.STRING,
    },
    sectionType: {
      type: DataTypes.STRING,
    },
    instructorName: {
      type: DataTypes.STRING,
    },
    days: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    location: {
      type: DataTypes.STRING,
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
    sourceUrl: {
      type: DataTypes.STRING,
    },
    sourceMetadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    scrapePriority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    nextScrapeAt: {
      type: DataTypes.DATE,
    },
    lastScrapedAt: {
      type: DataTypes.DATE,
    },
    lastChangedAt: {
      type: DataTypes.DATE,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "course_offerings",
    timestamps: true,
    indexes: [
      { fields: ["courseId"] },
      { fields: ["term"] },
      { fields: ["instructorName"] },
      { fields: ["nextScrapeAt"] },
      { unique: true, fields: ["term", "externalOfferingId"] },
    ],
  }
);

export default CourseOffering;
