import { useState, useEffect, useMemo } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SubjectSelect } from './select';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

import './App.css'


function App() {
  const [activeItem, setActiveItem] = useState(null)
  const [courseList, setCourseList] = useState([])
  const [courses, setCourses] = useState([])
  const [subjectFilter, setSubjectFilter] = useState('')
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
  
  const subjects = useMemo(() =>
    Array.from(new Set(courseList.map(c=>c.department)))
        .sort()
        .map(d => ({ label: d, value: d })),
    [courseList]
  )

  const filteredCourses = useMemo(() => {
    if (!subjectFilter) return courseList;
    return courseList.filter(c => c.department === subjectFilter);
  }, [courseList, subjectFilter])
  
  return (
    <main className = "flex justify-center items-start h-screen w-full bg-gray-100 p-6">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className='flex w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden h-full'>
          
          {/* Sidebar */}
          <aside className='w-72 flex-shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 p-4'>
            <h2 className='text-xl font-semibold mb-4'>Courses</h2>
            <SubjectSelect
              options={subjects}
              value={subjectFilter}
              onChange={setSubjectFilter}
            />
            <input type='text' className='mb-4 h-10 px-3 w-full border border-gray-300 rounded-lg focus:outline-none' placeholder='Course...'>
            </input>
            
            <Droppable 
              className='flex flex-col gap-2 overflow-y-scroll flex-1' 
              id='courses-container'
              data={{ type: 'sidebar' }}
            >
            {filteredCourses.map((course) => (
                <Draggable 
                  key={course.UUID} 
                  id={course.UUID}
                  data={{ type: 'sidebar', course }}
                >
                <div className='bg-white border border-gray-200 rounded-md shadow-sm p-1' key={course.UUID} >
                  {course.course_name}
                </div>
                </Draggable>               
              ))}
            </Droppable>
          </aside>

          {/* Plan Table */}
          <section className='flex-1 flex flex-col'>
            {/* Container for 4-year-plan */}
            <div className='bg-gray-100 border-t border-gray-200 p-4 border-b'>
              {/* Top bar for title and necessary stuff */}
              <h2 className='text-xl font-semibold text-center'>4 Year Plan</h2>
            </div>

            <div className='flex-1 p-4'>
              <div className='grid grid-rows-4 gap-4 h-full'>
              {Object.keys(plan).map((year) => {
                // yearKey === "year1", "year2", …
                const yearNum = year.replace('year', '');      // "1", "2", …
                return (
                  <div key={year} className="flex h-full flex-1 flex-row w-full">
                    {Object.keys(plan[year]).map((quarter) => {
                      // quarter === "fall", "winter", …
                      const displayQuarter =
                        quarter.charAt(0).toUpperCase() + quarter.slice(1);  // "Fall", "Winter", …
                      return (
                        <div key={quarter} className='bg-gray-50 border border-gray-200 rounded-lg flex flex-col p-3 h-full w-full'>
                          <h3 className='text-sm font-medium mb-s'>
                            Year {yearNum} – {displayQuarter}
                          </h3>
                          <div className='flex-gap-2 flex-1'>
                            <Droppable 
                              className='h-full flex-1 bg-white border-2 border-dashed border-gray-300 rounded p-2 flex flex-col gap-2 overflow-y-auto min-h-[4rem]' 
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
                                    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-2 cursor-move select-none">
                                      {course.course_name}
                                    </div>
                                  </Draggable>
                                  ))}
                              
                            </Droppable>
                            <div 
                              className='w-16 flex-shrink-0 text-right text-sm text-gray-500'
                              id={`${year}-${quarter.toLowerCase()}-units`}                     
                            >
                              {plan[year][quarter].map((course) => (
                                    <div key={course.UUID} >
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
          </section>
        </div>
        <DragOverlay>
          {activeItem ? (
            <div className="bg-white border border-gray-200 rounded-md shadow-lg p-2 inline-flex pointer-events-none select-none w-full justify-center h-full items-center">
              {activeItem.course.course_name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  )
}

export default App
