const express = require('express')
const router = express.Router()
const { insertCourses, addCourse } = require('../controller/courseController')

router.post('/load-courses', insertCourses)
router.post('/add-course', addCourse)

module.exports = router