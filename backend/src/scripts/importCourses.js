import sequelize from "../config/database.js";
import Course from "../models/course.model.js";
import courses from "../data/course_data.js";

await sequelize.authenticate();

await Course.bulkCreate(
  courses.map((c) => {

    const idx = c.courseID.lastIndexOf(" ");

    const subject_code = c.courseID.slice(0, idx);
    const course_number = c.courseID.slice(idx + 1);
    
    return {
      subject: c.subject,
      subject_code,
      course_number,
      course_name: c.course_name,
      units: c.units,
      link: c.link,
    };
  }),
  { ignoreDuplicates: true }
);

console.log("Courses imported successfully");
process.exit(0);
