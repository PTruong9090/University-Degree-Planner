import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core';


import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [plan, setPlan] = useState({
    'year1-fall': [],
    'year1-winter': [],
    'year1-spring': [],
    'year1-summer': [],
    'year2-fall': [],
    'year2-winter': [],
    'year2-spring': [],
    'year2-summer': [],
    'year3-fall': [],
    'year3-winter': [],
    'year3-spring': [],
    'year3-summer': [],
    'year4-fall': [],
    'year4-winter': [],
    'year4-spring': [],
    'year4-summer': [],
  })

  const quarters = ['Fall', 'Winter', 'Spring', 'Summer']

  // Get course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/get-courses');
        const data = await response.json();

        setCourses(data.courses)

      } catch (error) {
        console.error("Error fetching course data:", error)
      }
    };
    fetchData();
  }, [])

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
  }
  
  return (
    <main>
      <DndContext>
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
                <div className='individual_course-container' key={course.UUID}>
                  {course.course_name}
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
            {[1, 2, 3, 4].map((year) => (
              <div key={year} className={`year${year}-container`}>
                {quarters.map((quarter) => (
                  <div key={quarter} className={`${quarter.toLowerCase()}-container`}>
                    <h3>Year {year} - {quarter}</h3>
                    <div className='course-unit-container'>
                      <div 
                        className='course-list-container'
                        id={`year${year}-${quarter.toLowerCase()}-courses`}
                      >
                      </div>
                      <div 
                        className='units-container'
                        id={`year${year}-${quarter.toLowerCase()}-units`}                     
                      >
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
