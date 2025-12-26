import React, { useRef } from "react";
import { Sidebar } from "../../features/Planner/components/Sidebar";
import { PlannerGrid } from "../../features/Planner/components/PlannerGrid";

export function AppShell({ plan, setPlan, availableCourses, courseMap}) {
    const plannerRef = useRef(null)

    return (
        <div className="flex w-full border border-gray-200 max-w-7xl h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
            
            {/* Sidebar Column */}
            <Sidebar
                availableCourses = {availableCourses}
                courseMap = {courseMap}
            />

            {/* Main Planner Area */}
            <section className="flex-1 flex flex-col">
                {/* Planner Head: Title and Buttons */}
                <div className="flex relative items-center bg-gray-50 p-4 border-b border-gray-200 shadow-xs">
                    <h2 className="text-2xl absolute left-1/2 -translate-x-1/2 font-bold text-gray-800 ml-auto">4-Year Plan</h2>
                    <div className="ml-auto">
                        <button onClick={() => plannerRef.current?.exportPDF()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export PDF</button>
                    </div>
                </div>

                {/* Scrollable Planner Grid */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <PlannerGrid 
                        ref={plannerRef}
                        plan={plan}
                        courseMap={courseMap}
                        setPlan={setPlan}
                    />
                </div>

                {/* Footer/Warnings */}
                <div className="bg-white p-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                    <span>Last Updated: Today. Please download your PDF before closing on public computers.</span>
                    {/* TODO: Custom Course Component goes here */}
                </div>
            </section>
        </div>
    )
}