import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { QuarterBox } from "./QuarterBox";
import { exportElementToPDF } from "../../../utils/pdfGenerator";

const yearNames = ['Freshman', 'Sophomore', 'Junior', 'Senior']
const quarterKeys = ['fall', 'winter', 'spring', 'summer']

export const PlannerGrid = forwardRef(({ plan, setPlan, courseMap}, ref) => {
    const plannerRef = useRef(null)
    const [activeYearIndex, setActiveYearIndex] = useState(0)

    const exportPDF = async () => {
        window.print()
    }

    useImperativeHandle(ref, () => ({
        exportPDF
    }))

    return (
        <div ref = {plannerRef} className="space-y-8">

            {/* Mobile year cycler */}
            <div className="md:hidden print:hidden flex justify-center">
                <button 
                    onClick={() => 
                        setActiveYearIndex((i) => (i + 1) % yearNames.length)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                    {yearNames[activeYearIndex]}

                </button>
            </div>

            {/* 1. Column Header Row (Fall, Winter, Spring Summer) */}
            <div className="hidden md:grid print:grid grid-cols-4 gap-4 font-bold text-sm text-gray-600 border-b pb-2">
                {/* Placeholder to align with Year Label Column */}
                <div className="text-center">Fall</div>
                <div className="text-center">Winter</div>
                <div className="text-center">Spring</div>
                <div className="text-center">Summer</div>
            </div>

            {/* Mobile: single year */}
            <div className="md:hidden print:hidden">
                <div className="grid grid-cols-1 gap-4">
                    {/* Display quarter box for that year*/}
                    {quarterKeys.map((quarterKey) => (
                        <QuarterBox
                            key={quarterKey}
                            yearKey={`year${activeYearIndex + 1}`}
                            quarterKey={quarterKey}
                            plan={plan}
                            setPlan={setPlan}
                            courseMap={courseMap}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Map over years to create schedule rows */}
            <div className="hidden md:block print:block space-y-6">
                {Object.keys(plan).map((yearKey, index) => (
                    <div
                        key={yearKey}
                        className="grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 gap-4"
                    >
                        {/* Map over the quarters within the year */}
                        {quarterKeys.map((quarterKey) => (
                            <QuarterBox
                                key={quarterKey}
                                yearKey={yearKey}
                                quarterKey={quarterKey}
                                plan={plan}
                                setPlan={setPlan}
                                courseMap={courseMap}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
})