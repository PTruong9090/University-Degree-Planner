import React, { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export function CourseCard({ course, variant = 'sidebar', isDragging = false}) {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [rect, setRect] = useState(null);

    // Base styling for all cards
    let classes = 'select-none rounded-xl border bg-white p-3 shadow-sm transition-all duration-100 ease-in-out'

    // Specific styling base on where card is
    if (variant === 'sidebar') {
        classes += " border-slate-200 hover:border-blue-400 hover:shadow-md cursor-grab"

    } else if (variant === 'plan') {
        classes += ' border-l-4 border-l-blue-500 bg-blue-50/80 cursor-move'
    }

    // Styling for item being dragged
    if (isDragging) {
        classes += ' scale-[1.02] border-dashed opacity-70 shadow-xl'
    }

    // Fallback for missing course
    if (!course) {
        return <div className="p-2 text-sm text-red-500 border border-red-300 rounded">Error: Course Not Found</div>
    }

    return (
        <>
            <div ref={ref} className={classes} onMouseEnter={() => {
                if (ref.current) {
                    setRect(ref.current.getBoundingClientRect())
                    setHovered(true)
                }
            }}
                onMouseLeave={() => setHovered(false)}
            >
                { variant === 'plan' ? (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-900">
                                {course.courseID}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-600">
                                {course.course_name}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                            {course.units}
                        </span>
                    </div>
                 ) : (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-900">
                                {course.courseID}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-600">
                                {course.course_name}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            {course.units}
                        </span>
                    </div>
                )}
                
            </div>
            <Tooltip visible={hovered} rect={rect}>
                {course.course_name}
            </Tooltip>
        </> 
    )
}
