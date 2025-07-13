import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core';

import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [plan, setPlan] = useState({
    'year-1': {
      'Fall': [],
      'Winter': [],
      'Spring': [],
      'Summer': [],
    },
    'year-2': {
      'Fall': [],
      'Winter': [],
      'Spring': [],
      'Summer': [],
    },
    'year-3': {
      'Fall': [],
      'Winter': [],
      'Spring': [],
      'Summer': [],
    },
    'year-4': {
      'Fall': [],
      'Winter': [],
      'Spring': [],
      'Summer': []
    }
  })

  // Get course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/get-courses');
        const data = await response.json();
        console.log(data.courses)
        setCourses(data.courses)

      } catch (error) {
        console.error("Error fetching course data:", error)
      }
    };
    fetchData();
  }, [])

  const handleDragEnd = (event) => {
    const { active, over } = event;

    const targetId = over.id
      
    // Get year and quarter from id of over
    const overTemp = targetId.split('-')
    const overYear = overTemp[0] + '-' + overTemp[1]
    const overQuarter = overTemp[2]

    // Get data from actively dragging item
    const activeTemp = active.id.split('-')
    const activeYear = activeTemp[0] + '-' + activeTemp[1]
    const activeQuarter = activeTemp[2]
    const activeUUID = activeTemp.slice(3, activeTemp.length).join(" ").replace(/\s/g, '-')
    
    
    if (over) {
      // Dragging from course list to planner
      const draggedCourse = courses.find(course => course.UUID == active.id);

      if (draggedCourse) {
        // Check if course is already in plan
        const isCourseinPlan = plan[overYear][overQuarter].some(course => course.UUID === draggedCourse.UUID)
        // Add to plan if not already existing
        if (!isCourseinPlan) {
          setPlan((prevPlan) => ({
            ...prevPlan,
            [overYear]: {
              ...prevPlan[overYear],
              [overQuarter]: [...prevPlan[overYear][overQuarter], draggedCourse]
            }
          }))
        }

        // Remove from courses list
        setCourses(courses.filter(course => course !== draggedCourse))

      } else {
        // Dragging within the plan
        const draggedCourseFromPlan = plan[activeYear][activeQuarter].find(
        (course) => course.UUID === activeUUID
        );

        if (draggedCourseFromPlan) {
          // Dragging within the plan
        const draggedCourseFromPlan = plan[activeYear][activeQuarter].find(
          (course) => course.UUID === activeUUID
          );
  
          if (draggedCourseFromPlan) {
            // Remove from old year and quarter
            const updatedPlan = { ...plan };
            updatedPlan[activeYear][activeQuarter] = updatedPlan[activeYear][activeQuarter].filter(
              (course) => course.UUID !== activeUUID
            );
  
            // Add to new year and quarter
            updatedPlan[overYear][overQuarter] = [
              ...updatedPlan[overYear][overQuarter],
              draggedCourseFromPlan
            ];
  
            setPlan(updatedPlan);
          }
        
        }
      }
      
    }
  }
  
  return (
    <main>
      <DndContext onDragEnd={handleDragEnd}>
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
            
            <div className='courses-container'>
            {courses.map((course) => (
                <div className='test'>
                  <Draggable className='test' key={course.UUID} id={course.UUID}>
                  <div className='individual_course-container' key={course.UUID}>
                    {course.course_name}
                  </div>
                  </Draggable>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Table */}
          <div className='plan-title-container'>
            {/* Container for 4-year-plan */}
            <div className='title-container'>
              {/* Top bar for title and necessary stuff */}
              <h2>4 Year Plan</h2>
            </div>

            <div className='plan-container'>
            {Object.keys(plan).map((year) => (
              <div key={year.split('-')[1]} className={`year${year.split('-')[1]}-container`}>
                {Object.keys(plan[year]).map((quarter) => (
                  <div key={quarter} className={`${quarter.toLowerCase()}-container`}>
                    <h3>Year {year.split('-')[1]} - {quarter}</h3>
                    <div className='course-unit-container'>
                      <Droppable id={`${year}-${quarter}-courses`} key={`${year}-${quarter.toLowerCase()}-courses`}>
                        <div 
                          className='course-list-container'
                          id={`${year}-${quarter.toLowerCase()}-courses`}
                        >
                          {/* loop through array and add course */}
                          {plan[year][quarter].map((course) => (
                              <Draggable key={course.UUID} id={`${year}-${quarter}-${course.UUID}`}>
                              <div className="course-item">
                                {course.course_name}
                              </div>
                            </Draggable>
                            ))}
                        </div>
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
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      </DndContext>
    </main>
  )
}

export default App
