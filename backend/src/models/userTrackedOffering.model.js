import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserTrackedOffering = sequelize.define(
  "UserTrackedOffering",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notifyOnOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notifyOnWaitlistOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastNotifiedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "user_tracked_offerings",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["offeringId"] },
      { unique: true, fields: ["userId", "offeringId"] },
    ],
  }
);

export default UserTrackedOffering;
