import { DndContext, DragOverlay } from '@dnd-kit/core';
import { AppShell } from '../components/layout/AppShell';
import { CourseCard } from '../features/Planner/components/CourseCard';
import { NavBar } from '../features/Planner/components/NavBar';
import { Footer } from '../features/Planner/components/Footer.jsx';
import { usePlannerState } from '../features/Planner/hooks/usePlannerState';


function PlannerPage() {
  const plannerState = usePlannerState()

  if (plannerState.isLoading) {
    return (
      <>
        <NavBar />
        <div className="flex min-h-[70vh] items-center justify-center bg-gray-100 px-4 text-slate-600">
          Loading planners...
        </div>
        <Footer />
      </>
    )
  }
  
  return (
    <DndContext 
      onDragStart={plannerState.handleDragStart}
      onDragEnd={plannerState.handleDragEnd}
    >
      <NavBar/>
      <div className="flex flex-col h-full w-full bg-gray-100">
        
        <div className="flex-1 flex justify-center p-4">
          <AppShell
            plannerState={plannerState}
          />
        </div>
        <Footer/>
      </div>

      <DragOverlay>
        {plannerState.activeItem ? (
          <CourseCard
            course={plannerState.activeItem}
            variant="plan"
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default PlannerPage
