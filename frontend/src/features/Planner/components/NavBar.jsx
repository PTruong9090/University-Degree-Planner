import React from "react";


export function NavBar() {
    return (
        <header className="h-14 border-b shadow-sm border-gray-200 bg-white">
            <nav 
                className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between"
                aria-label="Primary"
            >
                {/* Logo */}
                <a href='/'>
                    <div className="flex items-center gap-1">
                        <div className="h-10 w-10 rounded-md flex items-center justify-center">
                            <img src="/logo.svg" alt="logo" className="h-full w-full"/>
                        </div>

                        {/* TODO: FIX SIZING */}
                        <span className="font-semibold text-gray-800">
                            PlanBear.io
                        </span>
                    </div>
                </a>
{/* 
                Buttons
                <div className="flex items-center gap-4">
                   <button className="px-3 py-1.5 text-sm text-gray-800 rounded-md font-semibold hover:bg-gray-100">
                        My Courses
                    </button>

                   TODO: Change based on authentication
                   <button className="px-3 py-1.5 text-sm text-gray-800 rounded-md font-semibold hover:bg-gray-100">
                        Login/Signup
                    </button>
                </div> */}

            </nav>
        </header>
    )
}