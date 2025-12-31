import React from "react";
import PlannerPage from "./pages/PlannerPage";
import HomePage from "./pages/HomePage";
<<<<<<< HEAD
import LoginPage from "./pages/LoginPage"; 
import { NavBar } from "./features/Planner/components/NavBar";
import { Route, Routes } from "react-router-dom";

export function App() {
    return (
        <div className="min-h-screen flex flex-col">
=======
import { NavBar } from "./features/Planner/components/NavBar";
import { Route, Routes } from "react-router-dom";
import { Footer } from "./features/Planner/components/Footer";

export function App() {
    return (
        <div className="h-full flex flex-col">
>>>>>>> origin/main
            <NavBar />

            {/* Page Content */}
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/planner" element={<PlannerPage />}/>
                </Routes>
            </div>
=======
                    <Route path="/planner" element={<PlannerPage />}/>
                </Routes>
            </div>
            <Footer />
>>>>>>> origin/main
        </div>
    )
}
