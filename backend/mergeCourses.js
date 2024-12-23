const fs = require('fs');
const path = require('path');

const mergeCourses = async (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data')
        const fileNames = fs.readdirSync(dataPath).filter(file => file.endsWith('.json'))

        let mergedCourses = []

        for (const fileName of fileNames) {
            const filePath = path.join(dataPath, fileName)
            const courses = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            mergedCourses = [...mergedCourses, ...courses]
        }

        // Save merged array to new JSON file
        const mergedPath = path.join(dataPath, 'mergedCourses.json')
        fs.writeFileSync(mergedPath, JSON.stringify(mergedCourses, null, 2))

        console.log("All courses merged successfully")
    } catch (error) {
        console.error('Error merging courses:', error.message)
    }
}

mergeCourses()