import React, { useRef } from "react";
import { Sidebar } from "../../features/Planner/components/Sidebar";
import { PlannerGrid } from "../../features/Planner/components/PlannerGrid";

export function AppShell({ plan, setPlan, availableCourses, courseMap}) {
    const plannerRef = useRef(null)

    return (
        <div className="flex w-full border border-gray-200 max-w-7xl h-[90vh] print:h-auto print:max-w-none bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Sidebar Column */}
            <Sidebar
                availableCourses = {availableCourses}
                courseMap = {courseMap}
            />

            {/* Main Planner Area */}
            <section className="flex-1 flex flex-col">
                {/* Planner Head: Title and Buttons */}
                <div className="flex flex-col md:flex-row relative items-center bg-gray-50 p-4 border-b border-gray-200 shadow-xs">
                    <h2 className="md:text-2xl text-xl md:absolute md:left-1/2 md:-translate-x-1/2 font-bold text-gray-800 md:ml-auto">4-Year Plan</h2>
                    <div className="md:ml-auto">
                        <button onClick={() => plannerRef.current?.exportPDF()} className="hidden md:inline-flex print:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export PDF</button>
                    </div>
                </div>

                {/* Scrollable Planner Grid */}
                <div className="flex-1 p-6 overflow-y-auto print:overflow-visible print:h-auto bg-gray-50">
                    <PlannerGrid 
                        ref={plannerRef}
                        plan={plan}
                        courseMap={courseMap}
                        setPlan={setPlan}
                    />
                </div>

                {/* Footer/Warnings */}
                <div className="print:hidden bg-white p-3 border-t border-gray-200 text-xs text-gray-500 flex justify-center md:justify-between">
                    <span className="hidden md:block">Last Updated: Today. Please download your PDF before closing on public computers.</span>
                    <span className="md:hidden">For best experience, use a computer.</span>
                    {/* TODO: Custom Course Component goes here */}
                </div>
            </section>
        </div>
    )
}