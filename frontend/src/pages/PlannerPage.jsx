import { useState, useEffect, useMemo } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core';
import useLocalStorage from '../hooks/useLocalStorage'
import { AppShell } from '../components/layout/AppShell';
import { CourseCard } from '../features/Planner/components/CourseCard';
import { getCoursesInPlan } from '../utils/courseInPlan';
import { NavBar } from '../features/Planner/components/NavBar';
import { fetchCourses } from '../api/courseApi.js'


const initialPlan = {
  'year1': {
    'fall': [],
    'winter': [],
    'spring': [],
    'summer': [],
  },

  'year2': {
    'fall': [],
    'winter': [],
    'spring': [],
    'summer': [],
  },

  'year3': {
    'fall': [],
    'winter': [],
    'spring': [],
    'summer': [],
  },

  'year4': {
    'fall': [],
    'winter': [],
    'spring': [],
    'summer': [],
  }
}


function PlannerPage() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetchCourses()
      .then(data => setCourses(data))
      .catch(err => console.log(err))
  }, [])

  const courseMap = useMemo(() => {
    return courses.reduce((map, course) => {
      map[course.courseID] = course;
      return map;
    }, {})
  }, [courses])

  // Make plan persistent
  const [plan, setPlan] = useLocalStorage('ucla-planner-v1', initialPlan)

  // Hold course object for item being dragged
  const [activeItem, setActiveItem] = useState(null)

  // Set the available course list
  const availableCourses = useMemo(() => {
    const used = getCoursesInPlan(plan)

    return courses
      .map(c => c.courseID)
      .filter(id => !used.has(id))
  }, [courses, plan])


/* ------------------------------------------------------------------------------------------------------------------------- */

  const handleDragEnd = (event) => {
    const {active, over} = event

    // Do nothing if dropped nowhere useful
    if (!over) return

    // Get data from source and destination (e.g. type: 'sidebar', type: 'plan')
    const from = active.data.current
    const to = over.data.current

    // Unique course ID
    const courseID = from.courseID

    setActiveItem(null)

    // CHeck if dropping into same plan quarter (prevents duplicates)
    if (to.type === 'plan') {
      const destinationList = plan[to.year][to.quarter]

      if (destinationList.includes(courseID)) {
        return
      }
    }

    // 1. Sidebar -> Planner (Placing a course)
    if (from.type === 'sidebar' && to.type === 'plan') {
      setPlan(p => ({
        ...p,
        [to.year]: {
          ...p[to.year],
          [to.quarter]: [...p[to.year][to.quarter], courseID]
        }
      }))
    }

    // 2. Plan -> Sidebar (Remove a course)
    else if (from.type === 'plan' && to.type === 'sidebar') {
      // Update plan with course removed
      setPlan(p => ({
        ...p,
        [from.year]: {
          ...p[from.year],
          [from.quarter]: p[from.year][from.quarter].filter(id => id !== courseID)
        }
      }))
    }

    // 3. Plan -> Plan (Moving between quarters)
    else if (from.type == 'plan' && to.type === 'plan') {
      setPlan(p => {
        // If dropping into same quarter, do nothing
        if (
          from.year === to.year &&
          from.quarter === to.quarter
        ) {
          return p
        }


        const sourceList = p[from.year][from.quarter].filter(id => id !== courseID)
        const destList = [...p[to.year][to.quarter], courseID]


        if (from.year === to.year) {
          return {
            ...p,
            [from.year]: {
              ...p[from.year],
              [from.quarter]: sourceList,
              [to.quarter]: destList
            }
          }
        }

        return {
          ...p,
          [from.year]: {
            ...p[from.year],
            [from.quarter]: sourceList
          },
          [to.year]: {
            ...p[to.year],
            [to.quarter]: destList
          }
        }
        
      })
      
    }
  }

/* ------------------------------------------------------------------------------------------------------------------------- */

  const handleDragStart = ({active}) => {
      const courseID = active.data.current.courseID;
      setActiveItem(courseMap[courseID]);
    }

/* ------------------------------------------------------------------------------------------------------------------------- */
  
  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col min-h-screen min-w-screen bg-gray-100">

        <NavBar />
        
        <div className="flex-1 flex justify-center p-4">
          <AppShell
            plan={plan}
            setPlan={setPlan}
            availableCourses={availableCourses.sort()}
            courseMap={courseMap}
          />
        </div>

      </div>

      <DragOverlay>
        {activeItem ? (
          <CourseCard
            course={activeItem}
            variant="plan"
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )

}

export default PlannerPage
