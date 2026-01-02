import React, { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export function CourseCard({ course, variant = 'sidebar', isDragging = false}) {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [rect, setRect] = useState(null);

    // Base styling for all cards
    let classes = 'bg-white flex items-center justify-between rounded-md shadow-sm p-2 select-none transition-all duration-100 ease-in-out'

    // Specific styling base on where card is
    if (variant === 'sidebar') {
        classes += " border border-gray-300 h-15 hover:border-blue-500 cursor-grab"

    } else if (variant === 'plan') {
        classes += 'border-l-4 border-ucla-blue h-10 bg-blue-50 cursor-move'
    }

    // Styling for item being dragged
    if (isDragging) {
        classes += ' opacity-70 scale-[1.02] h-15 shadow-xl border-dashed'
    }

    // Fallback for missing course
    if (!course) {
        return <div className="p-2 text-sm text-red-500 border border-red-300 rounded">Error: Course Not Found</div>
    }

    return (
        <>
            <div ref={ref}className={classes} onMouseEnter={() => {
                if (ref.current) {
                    setRect(ref.current.getBoundingClientRect())
                    setHovered(true)
                }
            }}
                onMouseLeave={() => setHovered(false)}
            >
                { variant === 'plan' ? (
                    <p className={`font-semibold text-xs text-gray-800`}>
                        {course.courseID}
                    </p>
                 ) : (
                    <p className={`font-semibold text-xs text-gray-800`}>
                        {`${course.courseID}: ${course.course_name}`}
                    </p>
                )}

                <p className={'text-xs text-gray-600 text-center'}>
                    {course.units}
                </p>
                
            </div>
            <Tooltip visible={hovered} rect={rect}>
                {course.course_name}
            </Tooltip>
        </> 
    )
}