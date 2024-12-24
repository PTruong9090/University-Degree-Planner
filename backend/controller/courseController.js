const fs = require('fs')
const path = require('path')
const Course = require('../models/course.js')

const insertCourses = async (req, res) => {
    try {
        // Read JSON file
        const dataPath = path.join(__dirname, '../data/mergedCourses.json')
        const courses = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

        // Insert data into database
        await Course.bulkCreate(courses, {
            ignoreDuplicates: true
        })

        res.status(200).json({ success: true, message: 'Courses added successfully!'})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

const addCourse = async (req, res) => {
    try {
        const body = req.body;

        const newCourse = await Course.create({
            course_name: body.course_name,
            department: body.department,
            units: body.units,
            link: body.link
        })

        return res.status(201).json({
            status: 'success',
            data: newCourse
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

const getCourse = async (req, res) => {
    try {
        
    } catch (error) {

    }
}

module.exports = { insertCourses, addCourse }