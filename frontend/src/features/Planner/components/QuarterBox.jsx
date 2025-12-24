import React, { useMemo } from 'react'
import { Draggable } from '../../../dnd/Draggable';
import { Droppable } from '../../../dnd/Droppable';
import { CourseCard } from './CourseCard';

export function QuarterBox({ yearKey, quarterKey, plan, courseMap }) {
    // 1. Look up array of course IDs for this quarter
    const courseIDsInQuarter = plan[yearKey][quarterKey]

    const totalUnits = useMemo(() => {
        return courseIDsInQuarter.reduce((sum, courseID) => {
            // Look up full course object by ID
            const course = courseMap[courseID]
            return sum + (parseInt(course?.units[0]) || 0);
        }, 0)
    }, [courseIDsInQuarter, courseMap])

    // Display name as uppercase
    const displayQuarter = quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1)

    return (
        // Quarter Box Container
        <div className="bg-white rounded-lg shadow-md p-2 flex flex-col relative min-h-[150px]">

            {/* Droppable Area */}
            <Droppable
                className='flex-1 flex flex-col gap-2 overflow-y-auto min-h-[120px] p-2'
                id={`${yearKey}-${quarterKey}`}
                data={{
                    type: 'plan',
                    year: yearKey,
                    quarter: quarterKey
                }}
            >
                {courseIDsInQuarter.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 p-4 border-2 border-dashed border-gray-200 rounded-md h-full flex items-center justify-center">
                        Drag courses into {displayQuarter}
                    </div>
                ) : (
                    // Map over course IDs and render the Draggable CourseCard
                    courseIDsInQuarter.map((courseID) => {
                        const course = courseMap[courseID]
                        if (!course) return null

                        return (
                            <Draggable
                                key={courseID}
                                id={`${yearKey}-${quarterKey}-${courseID}`}
                                data={{
                                    type: 'plan',
                                    courseID: courseID,
                                    year: yearKey,
                                    quarter: quarterKey
                                }}
                            >
                                <CourseCard
                                    course={course}
                                    variant='plan'
                                />
                            </Draggable>
                        )
                    })
                )}
            </Droppable>

            {/* 4. Units Summary */}
            <div className="text-right text-sm font-bold mt-2 text-gray-700">
                Total: {totalUnits} Units
            </div>
        </div>
    )

}