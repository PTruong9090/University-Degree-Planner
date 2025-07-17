import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core';

import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

import './App.css'

function App() {

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log(active)
    console.log(over)

    const draggedintoCourse = over.id == 'courses-container'

    // Dragged 
    if (draggedintoCourse) {
      
    }

    const targetId = over.id
  
    // Get year and quarter from id of over
    const overTemp = targetId.split('-')
    const overYear = overTemp[0]
    const overQuarter = overTemp[1]

    // Get data from actively dragging item
    const activeTemp = active.id.split('-')
    const activeYear = activeTemp[0]
    const activeQuarter = activeTemp[1]
    const activeUUID = activeTemp.slice(2, activeTemp.length).join(" ").replace(/\s/g, '-')
    
    if (over && !draggedintoCourse) {
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
    } else {
          // implement dragged from planner to sidebar
          console.log('test')
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
            
            <Droppable className='courses-container' id='courses-container'>
            {courses.map((course) => (
                <Draggable className='test' key={course.UUID} id={course.UUID}>
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
                          <Droppable className='course-list-container' id={`${year}-${quarter.toLowerCase()}-courses`} key={`${year}-${quarter.toLowerCase()}-courses`}>
                            
                              {/* loop through array and add course */}
                              {plan[year][quarter].map((course) => (
                                  <Draggable key={course.UUID} id={`${year}-${quarter}-${course.UUID}`}>
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
      </DndContext>
    </main>
  )
}

export default App
