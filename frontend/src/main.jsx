import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { App } from './App.jsx'
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