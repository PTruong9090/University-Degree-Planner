import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core';


import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [plan, setPlan] = useState({
    'year1-fall': [],
    'year1-winter': [],
  })

  const quarters = ['Fall', 'Winter', 'Spring', 'Summer']

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
                  <div id={`year${year}-${quarter}-container`} className={`${quarter.toLowerCase()}-container`}>
                    <h2>{quarter}</h2>
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
