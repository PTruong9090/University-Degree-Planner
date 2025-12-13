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
  - Adding courses passes the size of the box expands the box
  - After dragging from planner to sidebar, its not sorted to the top again
  - Dropping into separate box in the same year results in duplicates
*/