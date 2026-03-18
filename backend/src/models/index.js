import sequelize from '../config/database.js';
import Course from './course.model.js';
import Planner from './planner.model.js';
import User from './user.model.js';

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

export {
  sequelize,
  Course,
  Planner,
  User
};
