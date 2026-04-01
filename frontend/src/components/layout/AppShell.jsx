import React, { useRef } from "react";
import { PlannerGrid } from "../../features/Planner/components/PlannerGrid";
import { Sidebar } from "../../features/Planner/components/Sidebar";

export function AppShell({ plannerState }) {
    const plannerRef = useRef(null);
    const {
        activePlanId,
        activePlanName,
        activeYearIndex,
        courseMap,
        createPlan,
        deletePlan,
        filteredCourses,
        isGuestMode,
        plan,
        planSummaries,
        renamePlan,
        searchTerm,
        selectPlan,
        setActiveYearIndex,
        setSearchTerm,
        setSubjectFilter,
        subjectFilter,
        subjects,
    } = plannerState;

    const getUnitValue = (units) => {
        const match = String(Array.isArray(units) ? units.join(' ') : units ?? '').match(/\d+/);
        return match ? Number(match[0]) : 0;
    };

    const handleRenamePlan = () => {
        const nextName = window.prompt('Rename plan', activePlanName);
        if (nextName === null) return;
        renamePlan(activePlanId, nextName);
    };

    const handleDeletePlan = () => {
        const confirmed = window.confirm(`Delete "${activePlanName}"?`);
        if (!confirmed) return;
        deletePlan(activePlanId);
    };

    const scheduledCourses = Object.values(plan).reduce((sum, year) => {
        return sum + Object.values(year).reduce((yearSum, quarter) => yearSum + quarter.length, 0);
    }, 0);

    const scheduledUnits = Object.values(plan).reduce((sum, year) => {
        return sum + Object.values(year).reduce((yearSum, quarter) => {
            return yearSum + quarter.reduce((quarterSum, courseID) => {
                return quarterSum + getUnitValue(courseMap[courseID]?.units);
            }, 0);
        }, 0);
    }, 0);

    return (
        <div className="flex h-[90vh] w-full max-w-7xl overflow-hidden rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,245,0.95)] shadow-[0_28px_80px_rgba(100,88,74,0.12)] print:h-auto print:max-w-none">
            <Sidebar
                courseMap={courseMap}
                filteredCourses={filteredCourses}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setSubjectFilter={setSubjectFilter}
                subjectFilter={subjectFilter}
                subjects={subjects}
            />

            <section className="flex flex-1 flex-col">
                <div className="border-b border-[var(--border)] bg-[rgba(244,236,227,0.86)] px-4 py-4 backdrop-blur md:px-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="max-w-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)]">PlanBear planner</p>
                            <h2 className="font-display mt-1 text-2xl font-semibold text-[var(--text)] md:text-4xl">{activePlanName}</h2>
                            {isGuestMode ? (
                                <p className="mt-2 text-sm font-medium text-[var(--warning-strong)]">
                                    Guest mode keeps this plan on this device only.
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-[var(--muted)]">
                                    A clean view of your roadmap, ready to adjust.
                                </p>
                            )}
                        </div>

                        <div className="grid gap-3 xl:min-w-[360px] xl:max-w-[460px] xl:flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <select
                                    className="h-11 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--text)] focus:border-[var(--accent-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                                    value={activePlanId}
                                    onChange={(event) => selectPlan(event.target.value)}
                                >
                                    {planSummaries.map((planSummary) => (
                                        <option key={planSummary.id} value={planSummary.id}>
                                            {planSummary.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={createPlan}
                                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)]"
                                >
                                    New Plan
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleRenamePlan}
                                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)]"
                                >
                                    Rename
                                </button>
                                <button
                                    onClick={handleDeletePlan}
                                    disabled={planSummaries.length <= 1}
                                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Courses</p>
                                <p className="mt-1 text-lg font-bold text-[var(--text)]">{scheduledCourses}</p>
                            </div>
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Units</p>
                                <p className="mt-1 text-lg font-bold text-[var(--text)]">{scheduledUnits}</p>
                            </div>
                            <button
                                onClick={() => plannerRef.current?.exportPDF()}
                                className="col-span-2 inline-flex items-center justify-center rounded-2xl bg-[var(--text)] px-5 py-3 font-semibold text-[var(--surface)] transition-colors hover:bg-[#4b5161] print:hidden md:col-span-1"
                            >
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-[rgba(247,241,234,0.55)] p-4 print:h-auto print:overflow-visible md:p-6">
                    <PlannerGrid 
                        ref={plannerRef}
                        activeYearIndex={activeYearIndex}
                        plan={plan}
                        planName={activePlanName}
                        courseMap={courseMap}
                        setActiveYearIndex={setActiveYearIndex}
                    />
                </div>

                <div className="print:hidden flex justify-center border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)] md:justify-between">
                    <span className="hidden md:block">Drag courses into each quarter, then export a PDF when you want a shareable copy.</span>
                    <span className="md:hidden">Tap the year tabs to switch views.</span>
                </div>
            </section>
        </div>
    );
}
