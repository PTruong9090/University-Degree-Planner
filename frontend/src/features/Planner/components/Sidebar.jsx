import React, { useState, useMemo } from 'react';
import { Draggable } from '../../../dnd/Draggable';
import { Droppable } from '../../../dnd/Droppable';
import { CourseCard } from './CourseCard';

export function Sidebar({ availableCourses, courseMap}) {
    const [subjectFilter, setSubjectFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // 1. Get list of all departments for filter dropdown
    const subjects = useMemo(() => 
        Array.from(new Set(Object.values(courseMap).map(c => c.department)))
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
                courseMap[courseID]?.department === subjectFilter     
            )
        }

        // Filter by search term (name or ID)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase()
            list = list.filter(courseID => {
                const course = courseMap[courseID]
                if (!course) return false

                return (
                    course.course_name.toLowerCase().includes(lowerSearch) || 
                    courseID.toLowerCase().includes(lowerSearch)
                )
            })
        }
        return list
    }, [availableCourses, subjectFilter, searchTerm, courseMap])

    return (
        <aside className="w-80 flex-shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 p-4">
            {/* Sidebar Header: Filters */}
            <div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Course Catalog</h2>

                {/* TODO: SubjectSelect component goes here */}
                <select
                    className="h-10 px-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    className="h-10 px-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by course name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Course List: Droppable Area */}
            <Droppable
                // Make entire sidebar a drop zone for returning courses
                className="flex flex-col gap-2 overflow-y-auto flex-1 pt-4"
                id="courses-container"
                data={{ type: 'sidebar' }}
            >
                {filteredCourses.length === 0 ? (
                    <p className="text-sm text-gray-500 pt-4 text-center">
                        No courses available or match your filters.
                    </p>
                ) : (
                    filteredCourses.map((courseID) => {
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
                    })
                )}
            </Droppable>
        </aside>
    )
}