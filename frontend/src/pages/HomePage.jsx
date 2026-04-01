import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../api/authApi';
import { fetchCourses } from '../api/courseApi';
import { fetchPlanners } from '../api/plannerApi';
import { Button } from '../components/ui/Button';
import { NavBar } from '../features/Planner/components/NavBar';
import { Footer } from '../features/Planner/components/Footer';

const YEAR_KEYS = ['year1', 'year2', 'year3', 'year4'];   // Planner year keys
const LOCAL_STORAGE_KEY = 'ucla-planner-guest-v1';        // Guest planner storage key
const STUDENT_YEAR_TO_PLAN_YEAR = {                       // User year -> planner year
  freshman: 'year1',
  sophomore: 'year2',
  junior: 'year3',
  senior: 'year4',
};

const getCurrentQuarterKey = (date = new Date()) => {
  const month = date.getMonth();

  if (month <= 2) return 'winter';
  if (month <= 5) return 'spring';
  if (month <= 8) return 'summer';
  return 'fall';
};

// Normalize quarter label for display
const formatQuarterLabel = (quarterKey) =>
  quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1);

// Normalize year label for display
const formatYearLabel = (yearKey) => yearKey.replace('year', 'Year ');

// Parse for unit value
const getUnitValue = (units) => {
  const match = String(Array.isArray(units) ? units.join(' ') : units ?? '').match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const createEmptyPlan = () => ({
  year1: { fall: [], winter: [], spring: [], summer: [] },
  year2: { fall: [], winter: [], spring: [], summer: [] },
  year3: { fall: [], winter: [], spring: [], summer: [] },
  year4: { fall: [], winter: [], spring: [], summer: [] },
});


const parseLocalPlannerStore = () => {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return {
        activePlanId: null,
        planners: [],
      };
    }

    const parsed = JSON.parse(raw);
    const planners = Array.isArray(parsed?.planners) ? parsed.planners : [];

    return {
      activePlanId: parsed?.activePlanId ?? planners[0]?.id ?? null,
      planners,
    };
  } catch (error) {
    console.error(error);
    return {
      activePlanId: null,
      planners: [],
    };
  }
};

const HomePage = () => {
  const [roadmapPreview, setRoadmapPreview] = useState({    // Homepage planner preview
    isLoading: true,
    yearKey: 'year1',
    quarterKey: getCurrentQuarterKey(),
    courses: [],
    totalCourses: 0,
    totalUnits: 0,
  });

  useEffect(() => {
    let isMounted = true;

    // Load preview planner from backend
    const loadRoadmapPreview = async () => {
      const quarterKey = getCurrentQuarterKey();

      try {
        const [courses, currentUserData] = await Promise.all([
          fetchCourses(),
          getCurrentUser().catch((error) => {
            if (error?.status === 401) {
              return null;
            }

            throw error;
          }),
        ]);
        if (!isMounted) return;

        let planData = createEmptyPlan();

        try {
          // Grab planner from backend
          const plannerData = await fetchPlanners();
          if (!isMounted) return;

          // Sort by position
          const planners = Array.isArray(plannerData?.planners) ? plannerData.planners : [];
          const primaryPlanner = planners
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
          
          // Use empty plan if primary planner exists
          planData = primaryPlanner?.planData ?? createEmptyPlan();

          // Not logged in
        } catch (plannerError) {
          // Grab planner from local storage
          const localStore = parseLocalPlannerStore();

          // Use active local planner || first local planner || empty plan
          const activePlanner =
            localStore.planners.find((planner) => planner.id === localStore.activePlanId) ??
            localStore.planners[0];

          planData = activePlanner?.plan ?? createEmptyPlan();
        }

        // Decide preview year
        const signedInYearKey =
          STUDENT_YEAR_TO_PLAN_YEAR[currentUserData?.user?.studentYear] ?? null;
        const yearKey =
          signedInYearKey && YEAR_KEYS.includes(signedInYearKey) ? signedInYearKey : 'year1';
        
        // Create course lookup table
        const courseMap = courses.reduce((map, course) => {
          map[course.courseID] = course;
          return map;
        }, {});
        const quarterCourseIds = planData[yearKey]?.[quarterKey] ?? [];


        setRoadmapPreview({
          isLoading: false,
          yearKey,
          quarterKey,
          courses: quarterCourseIds.slice(0, 3).map((courseID) => courseMap[courseID] ?? { courseID }),
          totalCourses: quarterCourseIds.length,
          totalUnits: quarterCourseIds.reduce(
            (sum, courseID) => sum + getUnitValue(courseMap[courseID]?.units),
            0
          ),
        });
      } catch (error) {
        if (!isMounted) return;

        setRoadmapPreview({
          isLoading: false,
          yearKey: 'year1',
          quarterKey,
          courses: [],
          totalCourses: 0,
          totalUnits: 0,
        });
      }
    };

    loadRoadmapPreview();

    const handleFocus = () => {
      void loadRoadmapPreview();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadRoadmapPreview();
      }
    };

    // Attach event listeners to update roadmap
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Remove listeners when unmounted
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update when roadmap quarterkey changes
  const roadmapHeading = useMemo(() => {
    return `${formatQuarterLabel(roadmapPreview.quarterKey)} ${new Date().getFullYear()}`;
  }, [roadmapPreview.quarterKey]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <NavBar />

      <main>
        <section className="relative overflow-hidden border-b border-[var(--border)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(216,226,210,0.8),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(219,229,234,0.85),_transparent_38%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[rgba(255,250,245,0.82)] px-4 py-1 text-sm font-semibold text-[var(--muted)]">
                Academic roadmap
              </span>
              <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold text-[var(--text)] md:text-6xl">
                Plan your UCLA path one quarter at a time.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                Build a clean roadmap, keep each quarter visible, and come back whenever you need to adjust your plan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/planner">
                  <Button size="lg" className="w-full bg-[var(--text)] text-[var(--surface)] hover:bg-[#4b5161] sm:w-auto">
                    Open Planner
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)] sm:w-auto"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
                  Quarter-by-quarter planning
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
                  Guest mode or account
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
                  PDF export when you need it
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,245,0.92)] p-6 shadow-[0_28px_80px_rgba(100,88,74,0.12)]">
                <div className="flex items-center justify-between border-b border-[rgba(217,206,195,0.7)] pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.svg"
                      alt="PlanBear logo"
                      className="h-12 w-12 object-contain drop-shadow-[0_10px_16px_rgba(136,111,84,0.18)]"
                    />
                    <div>
                      <p className="font-display text-2xl font-semibold text-[var(--text)]">PlanBear</p>
                      <p className="text-sm font-medium text-[var(--muted)]">Academic roadmap</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--sage)] px-3 py-1 text-xs font-semibold text-[var(--sage-strong)]">
                    This quarter
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-[28px] bg-[var(--surface-soft)] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--text)]">{roadmapHeading}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                          {formatYearLabel(roadmapPreview.yearKey)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[var(--accent-strong)]">
                        {roadmapPreview.isLoading
                          ? 'Loading...'
                          : roadmapPreview.totalCourses > 0
                            ? `${roadmapPreview.totalUnits} units`
                            : 'No courses'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {roadmapPreview.isLoading ? (
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--muted)]">
                          Loading your planned courses...
                        </div>
                      ) : roadmapPreview.courses.length > 0 ? (
                        roadmapPreview.courses.map((course) => (
                          <div
                            key={course.courseID}
                            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--text)]"
                          >
                            {course.courseID}
                            {course.course_name ? ` - ${course.course_name}` : ''}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-sm font-medium text-[var(--muted)]">
                          No courses placed for this section yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm font-semibold text-[var(--muted)]">Courses placed</p>
                      <p className="mt-2 text-3xl font-extrabold text-[var(--text)]">{roadmapPreview.totalCourses}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">A quick snapshot of this section.</p>
                    </div>
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm font-semibold text-[var(--muted)]">Next step</p>
                      <p className="mt-2 text-base font-bold text-[var(--text)]">
                        {roadmapPreview.totalCourses > 0 ? 'Review this quarter' : 'Start planning this quarter'}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {roadmapPreview.totalCourses > 0
                          ? 'Open the planner to make the rest of this year feel clear.'
                          : 'Drop courses into this section when you are ready to start.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">What you can do</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--text)] md:text-4xl">
              Simple tools for staying organized
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">01</p>
              <h3 className="mt-4 text-xl font-bold text-[var(--text)]">Quarter-by-quarter planning</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Lay out each term in one place and see how the full roadmap fits together.
              </p>
            </div>
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">02</p>
              <h3 className="mt-4 text-xl font-bold text-[var(--text)]">Guest mode or account</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Start right away, then save your roadmap to an account whenever you want sync across devices.
              </p>
            </div>
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">03</p>
              <h3 className="mt-4 text-xl font-bold text-[var(--text)]">Export when ready</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Keep a PDF copy of your plan for advising, review, or your own records.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
