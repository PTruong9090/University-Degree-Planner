import { useState, useEffect } from 'react'
import {DndContext} from '@dnd-kit/core';



import './App.css'

function App() {
  const [courses, setCourses] = useState([])

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
  
  return (
    <main>
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
            {/* Use for 4x4 box for plan */}
            {[1, 2, 3, 4].map((year) => (
              <div key={year} className={`year${year}-container`}>
                
                <div className='fall-container'>
                  <h3>Year {year} - Fall</h3>
                  <div className='course-unit-container'>
                    <div className='course-list-container'>
                    </div>
                    <div className='units-container'>
                    </div>
                  </div>
                </div>

                <div className='winter-container'>
                  <h3>Winter</h3>
                  <div className='course-unit-container'>
                    <div className='course-list-container'>
                    </div>
                    <div className='units-container'>
                    </div>
                  </div>
                </div>

                <div className='spring-container'>
                  <h3>Spring</h3>
                  <div className='course-unit-container'>
                    <div className='course-list-container'>
                    </div>
                    <div className='units-container'>
                    </div>
                  </div>
                </div>

                <div className='summer-container'>
                  <h3>Summer</h3>
                  <div className='course-unit-container'>
                    <div className='course-list-container'>
                    </div>
                    <div className='units-container'>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

export default App
