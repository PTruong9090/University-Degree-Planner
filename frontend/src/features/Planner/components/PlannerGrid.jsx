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
        const margin = 7;
        const topAreaHeight = 12;
        const columns = 4;
        const rows = 4;
        const gutterX = 3;
        const gutterY = 3;
        const gridTop = margin + topAreaHeight;
        const cardWidth = (pageWidth - (margin * 2) - (gutterX * (columns - 1))) / columns;
        const cardHeight = (pageHeight - gridTop - margin - (gutterY * (rows - 1))) / rows;
        const maxCoursesInQuarter = Math.max(
            0,
            ...Object.values(plan).flatMap((year) => quarterKeys.map((quarterKey) => year[quarterKey].length))
        );
        const headerBandHeight = 6;
        const headerContentHeight = 7;
        const contentTopOffset = headerBandHeight + headerContentHeight + 2.5;
        const contentBottomPadding = 2.5;
        const availableCourseHeight = cardHeight - contentTopOffset - contentBottomPadding;
        const courseColumns = maxCoursesInQuarter > 12 ? 2 : 1;
        const rowsPerColumn = Math.max(1, Math.ceil(maxCoursesInQuarter / courseColumns));
        const lineHeight = Math.max(1.8, Math.min(3, availableCourseHeight / rowsPerColumn));
        const courseFontSize = Math.max(3.9, Math.min(6.1, lineHeight * 1.9));

        const getUnitValue = (units) => {
            const match = String(Array.isArray(units) ? units.join(' ') : units ?? '').match(/\d+/);
            return match ? Number(match[0]) : 0;
        };

        pdf.setFillColor(249, 244, 237);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(47, 52, 65);
        pdf.text(planName || "4-Year Plan", margin, 9);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(103, 112, 125);
        pdf.text("Academic roadmap", margin, 13);

        Object.keys(plan).forEach((yearKey, yearIndex) => {
            quarterKeys.forEach((quarterKey, quarterIndex) => {
                const x = margin + (quarterIndex * (cardWidth + gutterX));
                const y = gridTop + (yearIndex * (cardHeight + gutterY));
                const courseIDs = plan[yearKey][quarterKey]
                    .filter((courseID) => Boolean(courseMap[courseID]));
                const totalUnits = courseIDs.reduce((sum, courseID) => {
                    return sum + getUnitValue(courseMap[courseID]?.units);
                }, 0);
                const columnWidth = (cardWidth - 6 - ((courseColumns - 1) * 2)) / courseColumns;

                pdf.setDrawColor(217, 206, 195);
                pdf.setFillColor(255, 250, 245);
                pdf.roundedRect(x, y, cardWidth, cardHeight, 1.8, 1.8, "FD");

                pdf.setFillColor(219, 229, 234);
                pdf.roundedRect(x + 2, y + 2, cardWidth - 4, headerBandHeight, 1.2, 1.2, "F");

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(5.8);
                pdf.setTextColor(111, 133, 147);
                pdf.text(yearNames[yearIndex], x + 3.2, y + 5.7);

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(7.1);
                pdf.setTextColor(47, 52, 65);
                pdf.text(quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1), x + 3.2, y + 10.8);

                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(5.4);
                pdf.setTextColor(103, 112, 125);
                pdf.text(`${totalUnits} units`, x + cardWidth - 3.2, y + 10.8, { align: "right" });

                if (courseIDs.length === 0) {
                    pdf.setFont("helvetica", "italic");
                    pdf.setFontSize(5.3);
                    pdf.setTextColor(139, 144, 160);
                    pdf.text("No courses", x + 3.2, y + 15.5);
                    return;
                }

                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(courseFontSize);
                pdf.setTextColor(47, 52, 65);

                courseIDs.forEach((courseID, index) => {
                    const columnIndex = Math.floor(index / rowsPerColumn);
                    const rowIndex = index % rowsPerColumn;
                    const textX = x + 3.2 + (columnIndex * (columnWidth + 2));
                    const lineY = y + contentTopOffset + (rowIndex * lineHeight);

                    pdf.text(courseID, textX, lineY);
                });
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
                            className={`flex items-center justify-center rounded-2xl px-3 py-2 text-center text-sm font-semibold transition-colors ${
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
