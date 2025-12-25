
export function getCoursesInPlan(plan) {
    const used = new Set()

    Object.values(plan).forEach(year => {
        Object.values(year).forEach(quarter => {
            quarter.forEach(courseID => used.add(courseID))
        })
    })

    return used
}