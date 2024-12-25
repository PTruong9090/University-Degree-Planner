const express = require('express')
const router = express.Router()
const { insertCourses, addCourse, getCourse } = require('../controller/courseController')

router.post('/load-courses', insertCourses)
router.post('/add-course', addCourse)
router.get('/get-courses', getCourse)

module.exports = router