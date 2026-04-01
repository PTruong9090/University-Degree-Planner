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
                ? "bg-[var(--accent-soft)] text-[var(--text)] shadow-sm"
                : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
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
            <header className="sticky top-0 z-50 print:hidden border-b border-[var(--border)] bg-[rgba(255,250,245,0.88)] backdrop-blur">
                <nav
                    className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6"
                    aria-label="Primary"
                >
                    <Link
                        to="/"
                        className="group flex items-center gap-3 rounded-2xl pr-4 transition-transform duration-200 hover:-translate-y-0.5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <img
                            src="/logo.svg"
                            alt="PlanBear logo"
                            className="h-11 w-11 object-contain drop-shadow-[0_12px_20px_rgba(136,111,84,0.18)]"
                        />
                        <div className="flex flex-col">
                            <p className="font-display text-2xl font-semibold text-[var(--text)]">PlanBear</p>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)]">
                                Academic roadmap
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
                            className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                        >
                            Contact
                        </button>

                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className="ml-2 inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--surface)] shadow-sm transition-colors hover:bg-[#4b5161]"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-2 inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--surface)] shadow-sm transition-colors hover:bg-[#4b5161]"
                            >
                                Login / Signup
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text)] shadow-sm transition-colors hover:bg-[var(--surface-soft)] md:hidden"
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
                    <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:hidden">
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
                                className="rounded-full px-4 py-2 text-left text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                            >
                                Contact
                            </button>

                            {currentUser ? (
                                <button
                                    onClick={handleLogout}
                                    className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--surface)] shadow-sm transition-colors hover:bg-[#4b5161]"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--surface)] shadow-sm transition-colors hover:bg-[#4b5161]"
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
