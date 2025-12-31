

export default function HomePage() {
    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-r from-white to-blue-200 flex flex-col justify-center">
                {/* Introduction */}
                <section className="container mx-auto px-4 py-12 md:py-24 flex flex-row md:flex-col items-center gap-12">

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <header className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">Your UCLA Journey, <br/>
                            <span className="text-blue-600">Simplified</span>
                            </header>
                        <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
                            Plan your entire 4 year schedule effortlessly, for free. <br/>
                            Build by students, for students. <br/>
                        </p>
                        <a href="/planner">
                            <button className="bg-blue-600 text-white border border-slate-200 rounded-xl font-bold px-8 py-3 hover:bg-blue-700 shadow-lg transition hover:shadow-blue-600/25">
                                Starting Planning!
                            </button>
                        </a>
                    </div>
                </section>

                {/* Information */}
                <section className="flex-1 flex-col p-4">
                    <div>
                        <a>

                        </a>
                        <header> Free & Accessible </header>
                        <p>Free & accessible tool designed to help students plan their journey</p>
                    </div>

                    <div>
                        <a>

                        </a>
                        <header> Simplified Planning </header>
                        <p>Plan your entire 4-year schedule effortlessly, for free. Build by students, for students.</p>
                    </div>

                    <div>
                        <a>

                        </a>
                        <header> Student-Focused </header>
                        <p>Student-focused to help you prioritize your academic goals.</p>
                    </div>

                </section>

                {/* Footer */}
                <div className="flex-1 flex-col border p-4">

                </div>


        </div>
    )
}