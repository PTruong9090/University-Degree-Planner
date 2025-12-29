import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './pages/PlannerPage.jsx'
import './index.css'
import './styles/print.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

/*
TODO List: 
  - create a landing page
  - create a coursepage for each course
    - displays course information
  - fix print not showing boxes correctly
  - add login authentication 
    - auth0
  - add reset planner button
*/