'use strict';
const { Model, Sequelize, UUID} = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Courses', {
      UUID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      course_name: {
        type: Sequelize.STRING,
        unique: true
      },
      department: {
        type: Sequelize.STRING
      },
      units: {
        type: Sequelize.INTEGER
      },
      link: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }, 
    });