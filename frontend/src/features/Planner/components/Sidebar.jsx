import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Draggable } from '../../../dnd/Draggable';
import { Droppable } from '../../../dnd/Droppable';
import { CourseCard } from './CourseCard';

export function Sidebar({ courseMap, filteredCourses, searchTerm, setSearchTerm, setSubjectFilter, subjectFilter, subjects }) {
    return (
        <aside className="hidden w-80 flex-shrink-0 flex-col border-r border-[var(--border)] bg-[rgba(244,236,227,0.72)] p-4 md:flex">
            <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">Catalog</p>
                        <h2 className="text-2xl font-bold text-[var(--text)]">Course catalog</h2>
                    </div>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)] shadow-sm">
                        {filteredCourses.length} results
                    </span>
                </div>

                <select
                    className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus:border-[var(--accent-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
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
                    className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus:border-[var(--accent-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                    placeholder="Search by course name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Droppable
                className={({ isOver }) => `flex flex-1 flex-col gap-2 overflow-y-auto rounded-[28px] pt-4 transition-colors ${isOver ? 'bg-[var(--accent-soft)]' : ''}`}
                id="courses-container"
                data={{ type: 'sidebar' }}
            >
                {({ isOver }) => (
                    <>
                        {isOver ? (
                            <div className="mb-3 rounded-2xl border border-dashed border-[var(--accent-strong)] bg-[var(--surface)] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                                Drop here to return a course
                            </div>
                        ) : null}
                        {!subjectFilter && !searchTerm ? (
                            <p className="pt-2 text-center text-sm text-[var(--muted)]">
                                Select a subject or search to start browsing courses.
                            </p>
                        ) : filteredCourses.length === 0 ? (
                            <p className="pt-4 text-center text-sm text-[var(--muted)]">
                                No courses match your current filters.
                            </p>
                        ) : (
                            <Virtuoso
                                style={{ height: '100%', width: '100%' }}
                                totalCount={filteredCourses.length}
                                itemContent={(index => {
                                    const courseID = filteredCourses[index];
                                    const course = courseMap[courseID];
                                    if (!course) return null;
                                    
                                    return (
                                        <Draggable
                                            key={courseID}
                                            id={courseID}
                                            data={{ type: 'sidebar', courseID }}
                                        >
                                            <CourseCard
                                                course={course}
                                                variant='sidebar'
                                            />
                                        </Draggable>
                                    );
                                })}
                            />
                        )}
                    </>
                )}
            </Droppable>
        </aside>
    );
}
