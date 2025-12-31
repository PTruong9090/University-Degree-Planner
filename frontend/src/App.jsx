import React from "react";
import PlannerPage from "./pages/PlannerPage";
import HomePage from "./pages/HomePage";
import { NavBar } from "./features/Planner/components/NavBar";
import { Route, Routes } from "react-router-dom";

export function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            {/* Page Content */}
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/planner" element={<PlannerPage />}/>
                </Routes>
            </div>
        </div>
    )
}