import React from "react";

export function CourseCard({ course, variant = 'sidebar', isDragging = false}) {

    // Base styling for all cards
    let classes = 'bg-white rounded-md shadow-sm p-2 select-none transition-all duration-100 ease-in-out'

    // Specific styling base on where card is
    if (variant === 'sidebar') {
        classes += " border border-gray-300 hover:border-blue-500 cursor-grab"

    } else if (variant === 'plan') {
        classes += ' border-l-4 border-ucla-blue bg-blue-50 cursor-move'
    }

    // Styling for item being dragged
    if (isDragging) {
        classes += ' opacity-70 scale-[1.02] shadow-xl border-dashed'
    }

    // Fallback for missing course
    if (!course) {
        return <div className="p-2 text-sm text-red-500 border border-red-300 rounded">Error: Course Not Found</div>
    }

    return (
        <div className={classes}>
            <p className="font-semibold text-sm text-gray-800">
                {/* POSSIBLE ERROR: Might be courseID */}
                {course.course_name}
            </p>
            <p className="text-xs text-gray-600">
                {course.units} Units
            </p>
        </div>
    )
}