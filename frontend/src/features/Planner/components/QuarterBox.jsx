import React, { useMemo } from 'react';
import { Draggable } from '../../../dnd/Draggable';
import { Droppable } from '../../../dnd/Droppable';
import { CourseCard } from './CourseCard';

export function QuarterBox({ yearKey, quarterKey, plan, courseMap }) {
    const courseIDsInQuarter = plan[yearKey][quarterKey];

    const totalUnits = useMemo(() => {
        return courseIDsInQuarter.reduce((sum, courseID) => {
            const course = courseMap[courseID];
            const match = String(Array.isArray(course?.units) ? course.units.join(' ') : course?.units ?? '').match(/\d+/);
            return sum + (match ? Number(match[0]) : 0);
        }, 0);
    }, [courseIDsInQuarter, courseMap]);

    const displayQuarter = quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1);

    return (
        <div className="flex min-h-[220px] flex-col rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b border-[rgba(217,206,195,0.6)] px-1 pb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                        {yearKey.replace('year', 'Year ')}
                    </p>
                    <h3 className="text-base font-bold text-[var(--text)]">{displayQuarter}</h3>
                </div>
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    {totalUnits} units
                </span>
            </div>

            <Droppable
                className={({ isOver }) => `flex flex-1 flex-col overflow-y-auto rounded-[24px] border p-2 transition-colors ${
                    isOver ? 'border-[var(--accent-strong)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[rgba(244,236,227,0.52)]'
                }`}
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
                            <div className={`flex h-full min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center text-sm ${
                                isOver ? 'border-[var(--accent-strong)] text-[var(--accent-strong)]' : 'border-[var(--border)] text-[var(--muted)]'
                            }`}>
                                Drag courses into {displayQuarter}
                            </div>
                        ) : (
                            courseIDsInQuarter.map((courseID) => {
                                const course = courseMap[courseID];
                                if (!course) return null;

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
                                );
                            })
                        )}
                    </>
                )}
            </Droppable>
        </div>
    );

}
