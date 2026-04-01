import { Footer } from '../features/Planner/components/Footer';
import { NavBar } from '../features/Planner/components/NavBar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <section className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,245,0.92)] p-8 shadow-[0_24px_80px_rgba(100,88,74,0.12)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">About PlanBear</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold text-[var(--text)] md:text-5xl">
            A calmer way to map your degree plan.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted)] md:text-lg">
            PlanBear is a student-focused roadmap tool for laying out courses, comparing quarter plans, and keeping your academic path easy to read.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
            <h2 className="text-xl font-bold text-[var(--text)]">Roadmap first</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              The homepage stays centered on the academic roadmap so students can understand the tool quickly.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
            <h2 className="text-xl font-bold text-[var(--text)]">Made for students</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              The goal is to keep planning simple, welcoming, and practical without burying the app in extra fluff.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
            <h2 className="text-xl font-bold text-[var(--text)]">Flexible access</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Use it casually in guest mode or sign in when you want your plans saved across devices.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
