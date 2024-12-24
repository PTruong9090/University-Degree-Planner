import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd' 

import './App.css'

function App() {
  
  return (
    <main>
      <div className='main-container'>
        {/* Sidebar */}
        <div className='course-main-container'>
          <div className='course-title'>
            <h2>Courses</h2>
          </div>
          <div className='search-bar-container'>

          </div>
          <div className='course-container'>

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
