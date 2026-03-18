"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addIndex("users", ["username"], {
      unique: true,
      name: "users_username_unique",
    });

    await queryInterface.createTable("planners", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      planData: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("planners", ["userId"], {
      name: "planners_user_id_index",
    });

    await queryInterface.addIndex("planners", ["userId", "position"], {
      name: "planners_user_id_position_index",
    });

    await queryInterface.addIndex("planners", ["userId", "name"], {
      unique: true,
      name: "planners_user_id_name_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("planners", "planners_user_id_name_unique");
    await queryInterface.removeIndex("planners", "planners_user_id_position_index");
    await queryInterface.removeIndex("planners", "planners_user_id_index");
    await queryInterface.dropTable("planners");

    await queryInterface.removeIndex("users", "users_username_unique");
    await queryInterface.changeColumn("users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
