'use strict';
const { Model, Sequelize} = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Course', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseName: {
        type: Sequelize.STRING
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
        paranoid: true,
        freezeTableName: true,
        modelName: 'course'
    });