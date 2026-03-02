import React, { useState, useMemo } from 'react';
import { Draggable } from '../../../dnd/Draggable';
import { Droppable } from '../../../dnd/Droppable';
import { Virtuoso } from 'react-virtuoso'
import { CourseCard } from './CourseCard';

export function Sidebar({ availableCourses, courseMap}) {
    const [subjectFilter, setSubjectFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const collator = useMemo(
        () => new Intl.Collator('en', { numeric: true, sensitivity: 'base' }),
        []
    )

    // 1. Get list of all subject for filter dropdown
    const subjects = useMemo(() => 
        Array.from(new Set(Object.values(courseMap).map(c => c.subject)))
            .sort()
            .map(d => ({ label: d, value: d})),
        [courseMap]
    )

    // 2. Apply filtering 
    const filteredCourses = useMemo(() => {
        let list = availableCourses
        

        // Filter by subject
        if (subjectFilter) {
            list = list.filter(courseID => 
                courseMap[courseID]?.subject === subjectFilter     
            )
        }

        // Filter by search term (name or ID)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase()
            list = list.filter(courseID => {
                const course = courseMap[courseID]
                if (!course) return false
                
                return (
                    course.course_name?.toLowerCase().includes(lowerSearch) || 
                    courseID.toLowerCase().includes(lowerSearch)
                )
            })
        }
        return [...list].sort((a, b) => collator.compare(a, b))
    }, [availableCourses, subjectFilter, searchTerm, courseMap])

    return (
        <aside className="hidden md:flex w-80 flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50 p-4">
            {/* Sidebar Header: Filters */}
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Catalog</p>
                        <h2 className="text-2xl font-bold text-slate-900">Course Catalog</h2>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                        {filteredCourses.length} results
                    </span>
                </div>

                {/* TODO: SubjectSelect component goes here */}
                <select
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                >
                    <option value="">All Subjects</option>
                    {subjects.map(sub => (
                        <option key={sub.value} value={sub.value}>{sub.label}</option>
                    ))}
                </select>

                <input
                    type='text'
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Search by course name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Course List: Droppable Area */}
            <Droppable
                // Make entire sidebar a drop zone for returning courses
                className={({ isOver }) => `flex flex-1 flex-col gap-2 overflow-y-auto rounded-2xl pt-4 transition-colors ${isOver ? 'bg-blue-50/80' : ''}`}
                id="courses-container"
                data={{ type: 'sidebar' }}
            >
                {({ isOver }) => (
                    <>
                        {isOver ? (
                            <div className="mb-3 rounded-xl border border-dashed border-blue-300 bg-white px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                                Drop here to return a course
                            </div>
                        ) : null}
                        {!subjectFilter && !searchTerm? (
                            <p className="pt-2 text-center text-sm text-slate-500">
                                Select a subject or search to start browsing courses.
                            </p>

                            ) : filteredCourses.length === 0 ? (
                                <p className="pt-4 text-center text-sm text-slate-500">
                                    No courses match your current filters.
                                </p>
                            ) : (
                                <Virtuoso
                                    style={{ height: '100%', width: '100%' }}
                                    totalCount={filteredCourses.length}
                                    itemContent={(index => {
                                        const courseID = filteredCourses[index]
                                        const course = courseMap[courseID]
                                        if (!course) return null
                                        
                                        return (
                                            <Draggable
                                                key={courseID}
                                                id={courseID}
                                                // Data passed to handleDragEnd when dropped
                                                data={{ type: 'sidebar', courseID }}
                                            >
                                                <CourseCard
                                                    course={course}
                                                    variant='sidebar'
                                                />
                                            </Draggable>
                                        )
                                    })}
                                />
                            )
                        }
                    </>
                )}
            </Droppable>
        </aside>
    )
}
