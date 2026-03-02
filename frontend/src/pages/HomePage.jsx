import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { NavBar } from '../features/Planner/components/NavBar';
import { Footer } from '../features/Planner/components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.25),_transparent_36%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
                Built for PlanBear.io
              </span>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                Build a cleaner UCLA degree plan without the spreadsheet mess.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
                PlanBear keeps your courses, semesters, and graduation path in one place so you can focus on making good decisions instead of formatting tabs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/planner">
                  <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto">
                    Open Planner
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 sm:w-auto"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">4 years</p>
                  <p className="mt-1">Mapped semester by semester.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">1 view</p>
                  <p className="mt-1">Your plan, progress, and gaps in one place.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">0 clutter</p>
                  <p className="mt-1">A focused layout built for fast updates.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <img src="/logo.svg" alt="PlanBear logo" className="h-9 w-9" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">PlanBear.io</p>
                      <p className="text-lg font-bold text-slate-900">Academic roadmap</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Organized
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold text-slate-800">Fall Quarter</p>
                      <span className="text-xs font-semibold text-blue-600">15 units</span>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">CS 31 - Intro to Computer Science</div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">MATH 31A - Differential Calculus</div>
                      <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50 px-3 py-3 text-sm font-medium text-blue-700">GE Slot ready for planning</div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Progress</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">42%</p>
                      <p className="mt-1 text-sm text-slate-500">Degree path already scheduled.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Next move</p>
                      <p className="mt-2 text-base font-bold text-slate-900">Lock winter courses</p>
                      <p className="mt-1 text-sm text-slate-500">Keep prerequisites aligned before enrollment opens.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Why it feels like PlanBear</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Clean structure, obvious actions, and zero generic landing-page filler.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">01</p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Course-first planning</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Build each term around real classes and see the shape of your degree instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">02</p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Fast visual scanning</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                White cards, soft borders, and clear blue accents make priorities obvious without visual noise.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">03</p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Built for decisions</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The homepage now points straight into planning instead of feeling like a stock template.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <div className="rounded-3xl bg-blue-600 px-6 py-10 text-white shadow-xl shadow-blue-200 md:px-10 md:py-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Start planning</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                  Open your roadmap and make the next quarter obvious.
                </h2>
                <p className="mt-4 text-sm leading-7 text-blue-100 md:text-base">
                  Same visual system, same brand, and a homepage that now feels connected to the planner itself.
                </p>
              </div>
              <Link to="/planner">
                <Button
                  size="lg"
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 md:w-auto"
                >
                  Launch PlanBear
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;