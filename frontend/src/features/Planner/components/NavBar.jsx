import React, { useState } from "react";
import { ContactUs } from "./Popups";


export function NavBar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <header className="sticky top-0 z-50 print:hidden h-14 border-b shadow-sm border-gray-200 bg-white">
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

                    {/* Buttons */}
                    <div className="hidden md:block flex items-center gap-4">
                        <a href='/'>
                            <button className="px-3 py-1.5 text-sm text-gray-800 rounded-md font-semibold hover:bg-gray-100">
                                HOME
                            </button>
                        </a>

                        <a href='/planner'>
                            <button className="px-3 py-1.5 text-sm text-gray-800 rounded-md font-semibold hover:bg-gray-100">
                                PLANNER
                            </button>
                        </a>

                        {/*<a href='/login'>
                            <button className="px-3 py-1.5 text-sm text-gray-800 rounded-md font-semibold hover:bg-gray-100">
                                LOGIN/SIGNUP
                            </button>
                        </a>*/}

                        <button onClick={() => setIsOpen(true)} className="px-3 py-1.5 text-sm text-gray-800 rounded-md font-semibold hover:bg-gray-100">
                            CONTACT
                        </button>
                    </div> 
                </nav>
            </header>
            {/* Contact us popup */}
            <ContactUs isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
