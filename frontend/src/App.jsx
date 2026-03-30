import React from "react";
import PlannerPage from "./pages/PlannerPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import { Route, Routes } from "react-router-dom";


export function App() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Page Content */}
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage initialMode="login" />} />
                    <Route path="/signup" element={<LoginPage initialMode="signup" />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/planner" element={<PlannerPage />}/>
                </Routes>
            </div>
        </div>
    )
}
