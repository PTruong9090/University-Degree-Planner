import React, { useRef } from "react";
import { Sidebar } from "../../features/Planner/components/Sidebar";
import { PlannerGrid } from "../../features/Planner/components/PlannerGrid";
import { Footer } from "../../features/Planner/components/Footer";

export function AppShell({ plan, setPlan, availableCourses, courseMap}) {
    const plannerRef = useRef(null)

    const getUnitValue = (units) => {
        const match = String(Array.isArray(units) ? units.join(' ') : units ?? '').match(/\d+/)
        return match ? Number(match[0]) : 0
    }

    const scheduledCourses = Object.values(plan).reduce((sum, year) => {
        return sum + Object.values(year).reduce((yearSum, quarter) => yearSum + quarter.length, 0)
    }, 0)

    const scheduledUnits = Object.values(plan).reduce((sum, year) => {
        return sum + Object.values(year).reduce((yearSum, quarter) => {
            return yearSum + quarter.reduce((quarterSum, courseID) => {
                return quarterSum + getUnitValue(courseMap[courseID]?.units)
            }, 0)
        }, 0)
    }, 0)

    return (
        <div className="flex w-full max-w-7xl h-[90vh] print:h-auto print:max-w-none overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            {/* Sidebar Column */}
            <Sidebar
                availableCourses = {availableCourses}
                courseMap = {courseMap}
            />

            {/* Main Planner Area */}
            <section className="flex-1 flex flex-col">
                {/* Planner Head: Title and Buttons */}
                <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 backdrop-blur md:px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">PlanBear Planner</p>
                            <h2 className="mt-1 text-xl font-black text-slate-900 md:text-3xl">4-Year Plan</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Courses</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">{scheduledCourses}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Units</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">{scheduledUnits}</p>
                            </div>
                            <button onClick={() => plannerRef.current?.exportPDF()} className="col-span-2 hidden md:inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 print:hidden md:col-span-1">
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Planner Grid */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 print:h-auto print:overflow-visible md:p-6">
                    <PlannerGrid 
                        ref={plannerRef}
                        plan={plan}
                        courseMap={courseMap}
                        setPlan={setPlan}
                    />
                </div>

                {/* Footer/Warnings */}
                <div className="print:hidden flex justify-center border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 md:justify-between">
                    <span className="hidden md:block">Drag courses into each quarter to build your roadmap. Export a PDF when you are ready to share it.</span>
                    <span className="md:hidden">Tap the year tabs to switch views.</span>
                    {/* TODO: Custom Course Component goes here */}
                </div>
            </section>
        </div>
    )
}
