import React from "react";
import PlannerPage from "./pages/PlannerPage";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<PlannerPage />} />
        </Routes>
    )
}