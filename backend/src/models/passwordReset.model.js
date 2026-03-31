import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PasswordResetToken = sequelize.define (
    "PasswordResetToken",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        tokenHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,   
        },

        usedAt: {
            type: DataTypes.DATE,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        
        },

        requestIp: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        userAgent: {
            type: DataTypes.STRING,
        },

        revokedAt: {
            type: DataTypes.DATE,
        }
    },
    {
        tableName: "password_reset_tokens",
        timestamps: false,
        indexes: [
            { fields: ["userid"] },
            { fields: ["tokenHash"] },
            { fields: ["expiresAt"] },
            { fields: ["usedAt"] },
            { fields: ["requestIp"] },
            { unique: true, fields: ["tokenHash"] },
        ]

    }
)

export default PasswordResetToken;