"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("course_offerings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      term: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      externalOfferingId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sectionCode: {
        type: Sequelize.STRING,
      },
      sectionType: {
        type: Sequelize.STRING,
      },
      instructorName: {
        type: Sequelize.STRING,
      },
      days: {
        type: Sequelize.STRING,
      },
      startTime: {
        type: Sequelize.TIME,
      },
      endTime: {
        type: Sequelize.TIME,
      },
      location: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "unknown",
      },
      capacity: {
        type: Sequelize.INTEGER,
      },
      enrolled: {
        type: Sequelize.INTEGER,
      },
      spotsOpen: {
        type: Sequelize.INTEGER,
      },
      waitlistCapacity: {
        type: Sequelize.INTEGER,
      },
      waitlistTaken: {
        type: Sequelize.INTEGER,
      },
      sourceUrl: {
        type: Sequelize.STRING,
      },
      sourceMetadata: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      scrapePriority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      nextScrapeAt: {
        type: Sequelize.DATE,
      },
      lastScrapedAt: {
        type: Sequelize.DATE,
      },
      lastChangedAt: {
        type: Sequelize.DATE,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex("course_offerings", ["courseId"], {
      name: "course_offerings_course_id_index",
    });

    await queryInterface.addIndex("course_offerings", ["term"], {
      name: "course_offerings_term_index",
    });

    await queryInterface.addIndex("course_offerings", ["instructorName"], {
      name: "course_offerings_instructor_name_index",
    });

    await queryInterface.addIndex("course_offerings", ["nextScrapeAt"], {
      name: "course_offerings_next_scrape_at_index",
    });

    await queryInterface.addIndex("course_offerings", ["term", "externalOfferingId"], {
      unique: true,
      name: "course_offerings_term_external_id_unique",
    });

    await queryInterface.createTable("offering_snapshots", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      offeringId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "course_offerings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      scrapedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "unknown",
      },
      capacity: {
        type: Sequelize.INTEGER,
      },
      enrolled: {
        type: Sequelize.INTEGER,
      },
      spotsOpen: {
        type: Sequelize.INTEGER,
      },
      waitlistCapacity: {
        type: Sequelize.INTEGER,
      },
      waitlistTaken: {
        type: Sequelize.INTEGER,
      },
      rawPayload: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    });

    await queryInterface.addIndex("offering_snapshots", ["offeringId"], {
      name: "offering_snapshots_offering_id_index",
    });

    await queryInterface.addIndex("offering_snapshots", ["scrapedAt"], {
      name: "offering_snapshots_scraped_at_index",
    });

    await queryInterface.addIndex("offering_snapshots", ["offeringId", "scrapedAt"], {
      name: "offering_snapshots_offering_id_scraped_at_index",
    });

    await queryInterface.createTable("user_tracked_offerings", {
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
      offeringId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "course_offerings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notificationsEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notifyOnOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      notifyOnWaitlistOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastNotifiedAt: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex("user_tracked_offerings", ["userId"], {
      name: "user_tracked_offerings_user_id_index",
    });

    await queryInterface.addIndex("user_tracked_offerings", ["offeringId"], {
      name: "user_tracked_offerings_offering_id_index",
    });

    await queryInterface.addIndex("user_tracked_offerings", ["userId", "offeringId"], {
      unique: true,
      name: "user_tracked_offerings_user_id_offering_id_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("user_tracked_offerings", "user_tracked_offerings_user_id_offering_id_unique");
    await queryInterface.removeIndex("user_tracked_offerings", "user_tracked_offerings_offering_id_index");
    await queryInterface.removeIndex("user_tracked_offerings", "user_tracked_offerings_user_id_index");
    await queryInterface.dropTable("user_tracked_offerings");

    await queryInterface.removeIndex("offering_snapshots", "offering_snapshots_offering_id_scraped_at_index");
    await queryInterface.removeIndex("offering_snapshots", "offering_snapshots_scraped_at_index");
    await queryInterface.removeIndex("offering_snapshots", "offering_snapshots_offering_id_index");
    await queryInterface.dropTable("offering_snapshots");

    await queryInterface.removeIndex("course_offerings", "course_offerings_term_external_id_unique");
    await queryInterface.removeIndex("course_offerings", "course_offerings_next_scrape_at_index");
    await queryInterface.removeIndex("course_offerings", "course_offerings_instructor_name_index");
    await queryInterface.removeIndex("course_offerings", "course_offerings_term_index");
    await queryInterface.removeIndex("course_offerings", "course_offerings_course_id_index");
    await queryInterface.dropTable("course_offerings");
  },
};
