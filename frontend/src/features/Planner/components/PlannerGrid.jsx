import React from "react";
import { QuarterBox } from "./QuarterBox";

const yearNames = ['Freshman', 'Sophomore', 'Junior', 'Senior']
const quarterKeys = ['fall', 'winter', 'spring', 'summer']

export function PlannerGrid({ plan, setPlan, courseMap}) {
    // Object.keys(plan) will give us the year: ['year1', 'year2',...]

    return (
        <div className="space-y-8 p-1">

            {/* 1. Column Header Row (Fall, Winter, Spring Summer) */}
            <div className="grid grid-cols-[200px_repeat(3,_2fr)] gap-4 font-bold text-sm text-gray-600 border-b pb-2">
                {/* Placeholder to align with Year Label Column */}
                <div className="text-center">Fall</div>
                <div className="text-center">Winter</div>
                <div className="text-center">Spring</div>
                <div className="text-center">Summer</div>
            </div>

            {/* 2. Map over years to create schedule rows */}
            {Object.keys(plan).map((yearKey, index) => (
                <div
                    key={yearKey}
                    className="grid grid-cols-[repeat(4,_1fr)] gap-4 items-stretch"
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
    )
}