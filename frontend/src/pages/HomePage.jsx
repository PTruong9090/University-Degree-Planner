

export default function HomePage() {
    return (
        <div className="h-full w-full bg-gradient-to-r from-white to-blue-200 flex flex-col justify-center">
                {/* Introduction */}
                <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <header className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">Your UCLA Journey, <br/>
                            <span className="text-blue-600">Simplified</span>
                            </header>
                        <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
                            Plan your entire 4 year schedule effortlessly, for free. <br/>
                            Built by students, for students. <br/>
                        </p>
                        <a href="/planner">
                            <button className="bg-blue-600 text-white border border-slate-200 rounded-xl font-bold px-8 py-3 hover:bg-blue-700 shadow-lg transition hover:shadow-blue-600/25">
                                Start Planning!
                            </button>
                        </a>
                    </div>
                </section>

                {/* Information */}
                <section className="mx-15 px-4 mb-10 py-1 md:py-15 flex-1 flex-col p-4 bg-white py-20 px-4 rounded-xl shadow-md">
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition bg-slate-50">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Free & Accessible</h3>
                            <p className="text-slate-600 leading-relaxed">
                                A completely free tool designed to help students plan their journey without paywalls.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition bg-slate-50">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Simplified Planning</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Plan your entire 4-year schedule effortlessly. We handle the prerequisites for you.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition bg-slate-50">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Student-Focused</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Prioritize your academic goals with a tool built specifically for the UCLA experience.
                            </p>
                        </div>
                        
                    </div>

                </section>


        </div>
    )
}