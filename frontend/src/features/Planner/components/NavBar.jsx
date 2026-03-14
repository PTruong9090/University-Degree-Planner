import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContactUs } from "./Popups";


export function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { pathname } = useLocation()

    const navItems = useMemo(() => ([
        { label: "Home", href: "/" },
        { label: "Planner", href: "/planner" },
        { label: "About", href: "/about" },
    ]), [])

    const getNavLinkClassName = (href) => {
        const isActive = pathname === href

        return `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
    }

    const handleContactClick = () => {
        setIsMobileMenuOpen(false)
        setIsOpen(true)
    }

    return (
        <>
            <header className="sticky top-0 z-50 print:hidden border-b border-slate-200 bg-white/90 backdrop-blur">
                <nav
                    className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6"
                    aria-label="Primary"
                >
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-2xl pr-4 transition-opacity hover:opacity-90"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                            <img src="/logo.svg" alt="PlanBear logo" className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-[18px] font-bold tracking-[0.20em] text-blue-700">
                                PlanBear.io
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <Link key={item.href} to={item.href} className={getNavLinkClassName(item.href)}>
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={handleContactClick}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            Contact
                        </button>

                        <Link
                            to="/login"
                            className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            Login / Signup
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        <span className="flex flex-col gap-1">
                            <span className="block h-0.5 w-5 rounded-full bg-current" />
                            <span className="block h-0.5 w-5 rounded-full bg-current" />
                            <span className="block h-0.5 w-5 rounded-full bg-current" />
                        </span>
                    </button>
                </nav>

                {isMobileMenuOpen ? (
                    <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
                        <div className="mx-auto flex max-w-7xl flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={getNavLinkClassName(item.href)}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <button
                                onClick={handleContactClick}
                                className="rounded-full px-4 py-2 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                                Contact
                            </button>

                            <Link
                                to="/login"
                                className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login / Signup
                            </Link>
                        </div>
                    </div>
                ) : null}
            </header>
            <ContactUs isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
