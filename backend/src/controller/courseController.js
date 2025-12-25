import Course from '../models/course.model.js';

export const getCourse = async (req, res) => {
    try {
        
        const {
            subject_code,
            limit  = 100,
            offset = 0
        } = req.query

        const where = {}
        if (subject_code) {
            where.subject_code = subject_code
        }

        const courses = await Course.findAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [['course_number', 'ASC'], ['subject_code', 'ASC']]
        })

        const response = courses.map(c => ({
            subject: c.subject,
            course_name: c.course_name,
            courseID: `${c.subject_code} ${c.course_number}`,
            units: c.units,
            link: c.link
        }))
        
        res.json(response)
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}