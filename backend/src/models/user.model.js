import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [3, 50],
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        studentYear: {
            type: DataTypes.ENUM('freshman', 'sophomore', 'junior', 'senior'),
            allowNull: false,
            defaultValue: 'freshman',
        },
    },
    {
        tableName: "users",
        timestamps: true,
        indexes: [
            { unique: true, fields: ["email"] },
            { unique: true, fields: ["username"] },
        ],
    }
)

export default User;
