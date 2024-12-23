'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};