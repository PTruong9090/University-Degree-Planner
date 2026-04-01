import React, { forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";
import { QuarterBox } from "./QuarterBox";

const yearNames = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const quarterKeys = ['fall', 'winter', 'spring', 'summer'];

function getPlanFileName(planName) {
    return `${planName || '4-year-plan'}`
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || '4-year-plan';
}

export const PlannerGrid = forwardRef(({ activeYearIndex, plan, planName, setActiveYearIndex, courseMap }, ref) => {
    const exportPDF = async () => {
        const pdf = new jsPDF("l", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const topAreaHeight = 20;
        const columns = 4;
        const rows = 4;
        const gutterX = 5;
        const gutterY = 5;
        const gridTop = margin + topAreaHeight;
        const cardWidth = (pageWidth - (margin * 2) - (gutterX * (columns - 1))) / columns;
        const cardHeight = (pageHeight - gridTop - margin - (gutterY * (rows - 1))) / rows;
        const maxCoursesInQuarter = Math.max(
            0,
            ...Object.values(plan).flatMap((year) => quarterKeys.map((quarterKey) => year[quarterKey].length))
        );
        const contentStartOffset = 11;
        const availableCourseHeight = cardHeight - contentStartOffset - 4;
        const lineHeight = Math.max(2.3, Math.min(4, availableCourseHeight / Math.max(1, maxCoursesInQuarter || 1)));
        const courseFontSize = Math.max(4.5, Math.min(7.5, lineHeight * 1.75));

        pdf.setFillColor(249, 244, 237);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(47, 52, 65);
        pdf.text(planName || "4-Year Plan", margin, 14);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(103, 112, 125);

        Object.keys(plan).forEach((yearKey, yearIndex) => {
            quarterKeys.forEach((quarterKey, quarterIndex) => {
                const x = margin + (quarterIndex * (cardWidth + gutterX));
                const y = gridTop + (yearIndex * (cardHeight + gutterY));
                const courseIDs = plan[yearKey][quarterKey]
                    .filter((courseID) => Boolean(courseMap[courseID]));

                pdf.setDrawColor(217, 206, 195);
                pdf.setFillColor(255, 250, 245);
                pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "FD");

                pdf.setFillColor(219, 229, 234);
                pdf.roundedRect(x + 2, y + 2, cardWidth - 4, 7, 1.5, 1.5, "F");

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(6.5);
                pdf.setTextColor(111, 133, 147);
                pdf.text(yearNames[yearIndex], x + 4, y + 6.5);

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(8);
                pdf.setTextColor(47, 52, 65);
                pdf.text(quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1), x + 4, y + 13);

                if (courseIDs.length === 0) {
                    pdf.setFont("helvetica", "italic");
                    pdf.setFontSize(6);
                    pdf.setTextColor(139, 144, 160);
                    pdf.text("No courses", x + 4, y + 17);
                    return;
                }

                const maxVisibleCourses = Math.max(1, Math.floor(availableCourseHeight / lineHeight));
                const visibleCourseIDs = courseIDs.slice(0, maxVisibleCourses);

                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(courseFontSize);
                pdf.setTextColor(47, 52, 65);

                visibleCourseIDs.forEach((courseID, index) => {
                    const lineY = y + contentStartOffset + (index * lineHeight);
                    pdf.text(`- ${courseID}`, x + 4, lineY + 4);
                });

                if (courseIDs.length > maxVisibleCourses) {
                    pdf.setFont("helvetica", "italic");
                    pdf.setFontSize(5);
                    pdf.setTextColor(103, 112, 125);
                    pdf.text(`+${courseIDs.length - maxVisibleCourses} more`, x + 4, y + cardHeight - 2.5);
                }
            });
        });

        pdf.save(`${getPlanFileName(planName)}.pdf`);
    };

    useImperativeHandle(ref, () => ({
        exportPDF
    }));

    return (
        <div className="space-y-8">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm md:hidden print:hidden">
                <div className="grid grid-cols-2 gap-2">
                    {yearNames.map((label, index) => (
                        <button
                            key={label}
                            onClick={() => setActiveYearIndex(index)}
                            className={`rounded-2xl px-3 py-2 text-sm font-semibold transition-colors ${
                                activeYearIndex === index
                                    ? 'bg-[var(--accent-soft)] text-[var(--text)]'
                                    : 'bg-[var(--surface-soft)] text-[var(--muted)] hover:bg-[var(--surface-muted)]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden grid-cols-4 gap-4 border-b border-[var(--border)] pb-3 text-sm font-bold text-[var(--muted)] md:grid print:grid">
                <div className="text-center">Fall</div>
                <div className="text-center">Winter</div>
                <div className="text-center">Spring</div>
                <div className="text-center">Summer</div>
            </div>

            <div className="md:hidden print:hidden">
                <div className="grid grid-cols-1 gap-4">
                    {quarterKeys.map((quarterKey) => (
                        <QuarterBox
                            key={quarterKey}
                            yearKey={`year${activeYearIndex + 1}`}
                            quarterKey={quarterKey}
                            plan={plan}
                            courseMap={courseMap}
                        />
                    ))}
                </div>
            </div>

            <div className="hidden space-y-6 md:block print:block">
                {Object.keys(plan).map((yearKey) => (
                    <div
                        key={yearKey}
                        className="grid grid-cols-4 gap-4 print:grid-cols-4"
                    >
                        {quarterKeys.map((quarterKey) => (
                            <QuarterBox
                                key={quarterKey}
                                yearKey={yearKey}
                                quarterKey={quarterKey}
                                plan={plan}
                                courseMap={courseMap}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});
