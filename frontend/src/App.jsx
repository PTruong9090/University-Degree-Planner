import { useState, useEffect } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

import './App.css'

function App() {
  const [activeItem, setActiveItem] = useState(null)
  const [courseList, setCourseList] = useState([])
  const [courses, setCourses] = useState([])
  const [plan, setPlan] = useState({
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
      'summer': []
    }
  })

  // Get course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/get-courses');
        const data = await response.json();
        
        setCourses(data.courses)
        setCourseList(data.courses)

      } catch (error) {
        console.error("Error fetching course data:", error)
      }
    };
    fetchData();
  }, [])

  const handleDragStart = ({active}) => {
    setActiveItem(active.data.current)
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const from = active.data.current
    const to = over.data.current

    // Sidebar -> Plan
    if (from.type === 'sidebar' && to.type === 'plan') {
      // Update plan
      setPlan(p => ({
        ...p,
        [to.year]: {
          ...p[to.year],
          [to.quarter]: [...p[to.year][to.quarter], from.course]
        }
      }))

      // Update course list
      setCourses(courses.filter(course => course !== from.course))
    }

    // Plan -> Sidebar
    if (from.type === 'plan' && to.type === 'sidebar') {
      // Add to sidebar
      setCourses(prev => {
        // find original index in the master list
        const originalIdx = courseList.findIndex(c => c.UUID === from.course.UUID);
        // make a shallow copy of the current sidebar list
        const updated = [...prev];
        // insert at that index
        updated.splice(originalIdx, 0, from.course);
        return updated;
      });
    

      // Remove from plan
      setPlan(p => ({
        ...p,
        [from.year]: {
          ...p[from.year],
          [from.quarter]: p[from.year][from.quarter].filter(
            course => course.UUID !== from.course.UUID
          )
        }
      }))
    }

    // Plan -> Plan
    if (from.type==='plan' && to.type==='plan') {
      // Do nothing if same cell
      if (from.year === to.year && from.quarter === to.quarter) {
        return;
      }

      setPlan(p => {
        const updated = { ...p };

        // update source year
        updated[from.year] = {
          ...p[from.year],
          [from.quarter]: p[from.year][from.quarter]
                            .filter(c => c.UUID !== from.course.UUID)
        };

        // update dest year
        // if same year, this will just merge extra quarter
        updated[to.year] = {
          ...updated[to.year],
          [to.quarter]: [...p[to.year][to.quarter], from.course]
        };

        return updated;
      });
    }

    setActiveItem(null)
  } 
  
  return (
    <main>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className='main-container'>
          {/* Sidebar */}
          <div className='course-main-container'>
            <div className='course-title'>
              <h2>Courses</h2>
            </div>
            <input type='text' className='search-bar-container' placeholder='Subject...'>
            </input>
            <input type='text' className='search-bar-container' placeholder='Course...'>
            </input>
            
            <Droppable 
              className='courses-container' 
              id='courses-container'
              data={{ type: 'sidebar' }}
            >
            {courses.map((course) => (
                <Draggable 
                  className='test' 
                  key={course.UUID} 
                  id={course.UUID}
                  data={{ type: 'sidebar', course }}
                >
                <div className='individual_course-container' key={course.UUID} >
                  {course.course_name}
                </div>
                </Draggable>               
              ))}
            </Droppable>
          </div>

          {/* Plan Table */}
          <div className='plan-title-container'>
            {/* Container for 4-year-plan */}
            <div className='title-container'>
              {/* Top bar for title and necessary stuff */}
              <h2>4 Year Plan</h2>
            </div>

            <div className='plan-container'>
            {Object.keys(plan).map((year) => {
              // yearKey === "year1", "year2", …
              const yearNum = year.replace('year', '');      // "1", "2", …
              return (
                <div key={year} className={`${year}-container`}>
                  {Object.keys(plan[year]).map((quarter) => {
                    // quarter === "fall", "winter", …
                    const displayQuarter =
                      quarter.charAt(0).toUpperCase() + quarter.slice(1);  // "Fall", "Winter", …
                    return (
                      <div key={quarter} className={`${quarter}-container`}>
                        <h3>
                          Year {yearNum} – {displayQuarter}
                        </h3>
                        <div className='course-unit-container'>
                          <Droppable 
                            className='course-list-container' 
                            id={`${year}-${quarter.toLowerCase()}-courses`} 
                            data={{ type: 'plan', year, quarter}}
                          >
                              {/* loop through array and add course */}
                              {plan[year][quarter].map((course) => (
                                  <Draggable 
                                    key={course.UUID} 
                                    id={`${year}-${quarter}-${course.UUID}`}
                                    data={{ type: 'plan', course, year, quarter}}
                                  >
                                  <div className="course-item">
                                    {course.course_name}
                                  </div>
                                </Draggable>
                                ))}
                            
                          </Droppable>
                          <div 
                            className='units-container'
                            id={`${year}-${quarter.toLowerCase()}-units`}                     
                          >
                            {plan[year][quarter].map((course) => (
                                  <div key={course.UUID} className="course-item">
                                    {course.units}
                                  </div>
                                ))}
                          </div>
                      </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeItem ? (
            <div className="individual_course-container overlay">
              {activeItem.course.course_name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  )
}

export default App
