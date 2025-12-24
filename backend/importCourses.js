import courses from './data/course_data.js'
import Course from './models/course.js'

await Course.bulkCreate(
  courses.map(c => {
    const [subject_code, course_number] = c.courseID.split(/ (?=\d)/)
    return {
      subject: c.subject,
      subject_code,
      course_number,
      course_name: c.course_name,
      units: c.units,
      link: c.link
    }
  }),
  { ignoreDuplicates: true }
)