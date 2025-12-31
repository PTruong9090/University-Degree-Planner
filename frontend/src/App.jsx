import React from "react";
import PlannerPage from "./pages/PlannerPage";
import HomePage from "./pages/HomePage";
import { NavBar } from "./features/Planner/components/NavBar";
import { Route, Routes } from "react-router-dom";
import { Footer } from "./features/Planner/components/Footer";

export function App() {
    return (
        <div className="h-full flex flex-col">
            <NavBar />

            {/* Page Content */}
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/planner" element={<PlannerPage />}/>
                </Routes>
            </div>
            <Footer />
        </div>
    )
}