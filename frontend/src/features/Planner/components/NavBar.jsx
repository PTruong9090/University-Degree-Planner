import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../../api/authApi";
import { ContactUs } from "./Popups";


export function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const { pathname } = useLocation()
    const navigate = useNavigate()

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

    useEffect(() => {
        let isMounted = true

        const syncCurrentUser = async () => {
            const storedUser = window.localStorage.getItem('user')
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser)
                    if (isMounted) {
                        setCurrentUser(parsedUser)
                    }
                } catch (error) {
                    window.localStorage.removeItem('user')
                }
            } else if (isMounted) {
                setCurrentUser(null)
            }

            try {
                const data = await getCurrentUser()
                if (!isMounted) return

                if (data?.user) {
                    window.localStorage.setItem('user', JSON.stringify(data.user))
                    setCurrentUser(data.user)
                }
            } catch (error) {
                if (!isMounted) return

                if (error?.status === 401) {
                    window.localStorage.removeItem('user')
                    setCurrentUser(null)
                }
            }
        }

        const handleStorage = () => {
            const storedUser = window.localStorage.getItem('user')
            if (!storedUser) {
                setCurrentUser(null)
                return
            }

            try {
                setCurrentUser(JSON.parse(storedUser))
            } catch (error) {
                window.localStorage.removeItem('user')
                setCurrentUser(null)
            }
        }

        void syncCurrentUser()
        window.addEventListener('storage', handleStorage)

        return () => {
            isMounted = false
            window.removeEventListener('storage', handleStorage)
        }
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            // Clear local auth state even if the server session is already gone.
        } finally {
            window.localStorage.removeItem('user')
            setCurrentUser(null)
            setIsMobileMenuOpen(false)
            navigate('/login')
        }
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
                        className="group flex items-center gap-3 rounded-2xl pr-4 transition-transform duration-200 hover:-translate-y-0.5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(145deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)] transition-shadow duration-200 group-hover:shadow-[0_14px_30px_rgba(37,99,235,0.24)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),transparent_45%)]" />
                            <img src="/logo.svg" alt="PlanBear logo" className="relative h-8 w-8 drop-shadow-[0_4px_10px_rgba(30,64,175,0.18)]" />
                        </div>
                        <div className="flex flex-col">
                            <p className="flex items-baseline text-[20px] font-black tracking-[-0.03em] text-slate-900">
                                <span className="bg-[linear-gradient(200deg,#0f172a_0%,#1d4ed8_60%,#2563eb_100%)] bg-clip-text text-transparent">
                                    PlanBear.io
                                </span>
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

                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                Login / Signup
                            </Link>
                        )}
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

                            {currentUser ? (
                                <button
                                    onClick={handleLogout}
                                    className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login / Signup
                                </Link>
                            )}
                        </div>
                    </div>
                ) : null}
            </header>
            <ContactUs isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
