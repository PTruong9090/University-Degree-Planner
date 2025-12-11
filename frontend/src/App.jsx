import { useState, useEffect, useMemo } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import useLocalStorage from './hooks/useLocalStorage'
import mockCourses from './data/mergedCourses';

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


function App() {
  const courseMap = useMemo(() => {
    return mockCourses.reduce((map, course) => {
      map[course.course_name] = course;
      return map;
    }, {})
  }, [])

  // Make plan persistent
  const [plan, setPlan] = useLocalStorage('ucla-planner-v1', initialPlan)

  // Set the available course list
  const [availableCourses, setAvailableCourses] = useState(() => {
    mockCourses.map(c => c.course_name)
  })

  const handleDragEnd = (event) => {
    const {active, over} = event

    // Do nothing if dropped nowhere useful
    if (!over) return

    // Get data from source and destination (e.g. type: 'sidebar', type: 'plan')
    const from = active.data.current
    const to = over.data.current

    // Unique course ID
    const courseID = from.id

    // 1. Sidebar -> Planer (Placing a course)
    if (from.type === 'sidebar' && to.type === 'plan') {
      setAvailableCourses(prev => prev.filter(id => id !== courseID))

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
      // Add back to available list
      setAvailableCourses(prev => [...prev, courseID])

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
        
      })

    }


  }
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* {AppShell will go here} */}
      <h1>UCLA Planner!</h1>
      <pre>{JSON.stringify(plan, null, 2)}</pre>
    </DndContext>
  )
}

export default App
