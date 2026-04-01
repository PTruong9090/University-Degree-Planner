import React, { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export function CourseCard({ course, variant = 'sidebar', isDragging = false }) {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [rect, setRect] = useState(null);

    let classes = 'select-none border bg-[var(--surface)] shadow-sm transition-all duration-100 ease-in-out';

    if (variant === 'sidebar') {
        classes += " rounded-2xl border-[var(--border)] p-3 hover:border-[var(--accent-strong)] hover:shadow-md cursor-grab";
    } else if (variant === 'plan') {
        classes += ' rounded-xl border-[var(--border)] border-l-4 border-l-[var(--accent-strong)] bg-[var(--accent-soft)] px-2.5 py-2 cursor-move';
    }

    if (isDragging) {
        classes += ' scale-[1.02] border-dashed opacity-80 shadow-xl';
    }

    if (!course) {
        return <div className="rounded border border-[var(--rose-strong)] bg-[var(--rose)] p-2 text-sm text-[var(--rose-strong)]">Error: Course Not Found</div>;
    }

    return (
        <>
            <div
                ref={ref}
                className={classes}
                onMouseEnter={() => {
                    if (ref.current) {
                        setRect(ref.current.getBoundingClientRect());
                        setHovered(true);
                    }
                }}
                onMouseLeave={() => setHovered(false)}
            >
                {variant === 'plan' ? (
                    <div className="flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text)]">
                            {course.courseID}
                        </p>

                        <span className="shrink-0 rounded-full bg-[rgba(255,250,245,0.85)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                            {course.units}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text)]">
                                {course.courseID}
                            </p>
                            <p className="mt-1 truncate text-xs text-[var(--muted)]">
                                {course.course_name}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-[var(--surface-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--muted)]">
                            {course.units}
                        </span>
                    </div>
                )}
            </div>
            <Tooltip visible={hovered} rect={rect}>
                {course.course_name}
            </Tooltip>
        </>
    );
}
