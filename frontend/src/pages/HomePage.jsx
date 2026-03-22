import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../api/authApi';
import { fetchCourses } from '../api/courseApi';
import { fetchPlanners } from '../api/plannerApi';
import { Button } from '../components/ui/Button';
import { NavBar } from '../features/Planner/components/NavBar';
import { Footer } from '../features/Planner/components/Footer';

const YEAR_KEYS = ['year1', 'year2', 'year3', 'year4'];
const LOCAL_STORAGE_KEY = 'ucla-planner-guest-v1';
const STUDENT_YEAR_TO_PLAN_YEAR = {
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

const formatQuarterLabel = (quarterKey) =>
  quarterKey.charAt(0).toUpperCase() + quarterKey.slice(1);

const formatYearLabel = (yearKey) => yearKey.replace('year', 'Year ');

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
  const [roadmapPreview, setRoadmapPreview] = useState({
    isLoading: true,
    yearKey: 'year1',
    quarterKey: getCurrentQuarterKey(),
    courses: [],
    totalCourses: 0,
    totalUnits: 0,
  });

  useEffect(() => {
    let isMounted = true;

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
          const plannerData = await fetchPlanners();
          if (!isMounted) return;

          const planners = Array.isArray(plannerData?.planners) ? plannerData.planners : [];
          const primaryPlanner = planners
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
          planData = primaryPlanner?.planData ?? createEmptyPlan();
        } catch (plannerError) {
          const localStore = parseLocalPlannerStore();
          const activePlanner =
            localStore.planners.find((planner) => planner.id === localStore.activePlanId) ??
            localStore.planners[0];

          planData = activePlanner?.plan ?? createEmptyPlan();
        }

        const signedInYearKey =
          STUDENT_YEAR_TO_PLAN_YEAR[currentUserData?.user?.studentYear] ?? null;
        const yearKey =
          signedInYearKey && YEAR_KEYS.includes(signedInYearKey) ? signedInYearKey : 'year1';
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

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const roadmapHeading = useMemo(() => {
    return `${formatQuarterLabel(roadmapPreview.quarterKey)} ${new Date().getFullYear()}`;
  }, [roadmapPreview.quarterKey]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.25),_transparent_36%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
            <div className="flex flex-col justify-center">
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
              {/* <div className="mt-10 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
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
              </div> */}
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
                      <div>
                        <p className="font-semibold text-slate-800">{roadmapHeading}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {formatYearLabel(roadmapPreview.yearKey)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">
                        {roadmapPreview.isLoading
                          ? 'Loading...'
                          : roadmapPreview.totalCourses > 0
                            ? `${roadmapPreview.totalUnits} units`
                            : 'No courses'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {roadmapPreview.isLoading ? (
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-500">
                          Loading your planned courses...
                        </div>
                      ) : roadmapPreview.courses.length > 0 ? (
                        roadmapPreview.courses.map((course) => (
                          <div
                            key={course.courseID}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
                          >
                            {course.courseID}
                            {course.course_name ? ` - ${course.course_name}` : ''}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-500">
                          No courses placed for this section yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Progress</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{roadmapPreview.totalCourses}</p>
                      <p className="mt-1 text-sm text-slate-500">Courses currently placed in this quarter.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Next move</p>
                      <p className="mt-2 text-base font-bold text-slate-900">
                        {roadmapPreview.totalCourses > 0 ? 'Review this quarter' : 'Start planning this quarter'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {roadmapPreview.totalCourses > 0
                          ? 'Open the planner to update the rest of this section.'
                          : 'Add courses to this quarter from the planner when you are ready.'}
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
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Clean structure and simple to use
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
              <h3 className="mt-4 text-xl font-bold text-slate-900">Track class enrollments</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Keep track of available seats and get alerted when a spot opens up.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">03</p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Save your plan</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Export and save your PDF without having to create an account.
              </p>
            </div>
          </div>
        </section>

        {/* <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <div className="rounded-3xl bg-blue-600 px-6 py-10 text-white shadow-xl shadow-blue-200 md:px-10 md:py-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Start planning</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                  Open your roadmap and make the next quarter obvious.
                </h2>
                <p className="mt-4 text-sm leading-7 text-blue-100 md:text-base">
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
        </section> */}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
