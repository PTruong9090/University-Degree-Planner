import sequelize from '../config/database.js';
import Course from './course.model.js';
import CourseOffering from "./courseOffering.model.js";
import OfferingSnapshot from "./offeringSnapshot.model.js";
import Planner from './planner.model.js';
import UserTrackedOffering from "./userTrackedOffering.model.js";
import User from './user.model.js';

Course.hasMany(CourseOffering, {
  foreignKey: "courseId",
  as: "offerings",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CourseOffering.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});

CourseOffering.hasMany(OfferingSnapshot, {
  foreignKey: "offeringId",
  as: "snapshots",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OfferingSnapshot.belongsTo(CourseOffering, {
  foreignKey: "offeringId",
  as: "offering",
});

User.hasMany(Planner, {
  foreignKey: 'userId',
  as: 'planners',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Planner.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.belongsToMany(CourseOffering, {
  through: UserTrackedOffering,
  foreignKey: "userId",
  otherKey: "offeringId",
  as: "trackedOfferings",
});

CourseOffering.belongsToMany(User, {
  through: UserTrackedOffering,
  foreignKey: "offeringId",
  otherKey: "userId",
  as: "watchers",
});

UserTrackedOffering.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

UserTrackedOffering.belongsTo(CourseOffering, {
  foreignKey: "offeringId",
  as: "offering",
});

User.hasMany(UserTrackedOffering, {
  foreignKey: "userId",
  as: "offeringWatches",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CourseOffering.hasMany(UserTrackedOffering, {
  foreignKey: "offeringId",
  as: "trackingSubscriptions",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export {
  sequelize,
  Course,
  CourseOffering,
  OfferingSnapshot,
  Planner,
  UserTrackedOffering,
  User
};
