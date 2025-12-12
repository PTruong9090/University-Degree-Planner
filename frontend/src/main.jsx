import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/*
TODO List:
  - Whenever courses dragged into winter it appears in the wrong quarter
  - Adding courses passes the size of the box expands the box
  - After dragging from planner to sidebar, its not sorted to the top again
  - Dragging into summer adds to winter
  - Dragging into winter doesn't work
  - Subjects doesn't work
*/