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
            const match = String(Array.isArray(course?.units) ? course.units.join(' ') : course?.units ?? '').match(/\d+/)
            return sum + (match ? Number(match[0]) : 0);
        }, 0)
    }, [courseIDsInQuarter, courseMap])

    // Display name as uppercase
    const displayQuarter = quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1)

    return (
        // Quarter Box Container
        <div className="flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-1 pb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{yearKey.replace('year', 'Year ')}</p>
                    <h3 className="text-base font-bold text-slate-900">{displayQuarter}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {totalUnits} units
                </span>
            </div>

            {/* Droppable Area */}
            <Droppable
                className={({ isOver }) => `flex flex-1 flex-col gap-2 overflow-y-auto rounded-2xl border p-2 transition-colors ${isOver ? 'border-blue-300 bg-blue-50/80' : 'border-slate-200 bg-slate-50/60'}`}
                id={`${yearKey}-${quarterKey}`}
                data={{
                    type: 'plan',
                    year: yearKey,
                    quarter: quarterKey
                }}
            >
                {({ isOver }) => (
                    <>
                        {courseIDsInQuarter.length === 0 ? (
                            <div className={`flex h-full min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed p-4 text-center text-sm ${isOver ? 'border-blue-300 text-blue-700' : 'border-slate-200 text-slate-400'}`}>
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
                    </>
                )}
            </Droppable>
        </div>
    )

}
