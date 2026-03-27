import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

function createEmptyPlan() {
    return {
        year1: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
        year2: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
        year3: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
        year4: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
    };
}

const Planner = sequelize.define(
    "Planner",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        planData: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: createEmptyPlan(),
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        tableName: "planners",
        timestamps: true,
        indexes: [
            { fields: ["userId"] },
            { fields: ["userId", "position"] },
            { unique: true, fields: ["userId", "name"] },
        ],
    }
);

export default Planner;
