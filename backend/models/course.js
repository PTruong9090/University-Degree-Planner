'use strict';
const { Model, Sequelize, UUID} = require('sequelize');
const sequelize = require('../config/database');

export default Course = (sequelize, DataTypes) => {
  return sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    units: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
    }
  }, {
    indexes: [
      { fields: ['subject_code'] },
      { fields: ['course_number'] },
      { unique: true, fields: ['subject_code', 'course_number'] }
    ]
  });
};
