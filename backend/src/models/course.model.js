import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    subject: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    subject_code: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    course_number: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    course_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    units: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    link: { 
      type: DataTypes.STRING 
    },
    
  },
  {
    tableName: "courses",
    timestamps: false,
    indexes: [
      { fields: ["subject_code"] },
      { fields: ["course_number"] },
      { unique: true, fields: ["subject_code", "course_number"] },
    ],
  }
);

export default Course;
