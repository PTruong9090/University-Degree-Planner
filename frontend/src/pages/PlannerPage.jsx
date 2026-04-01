import { DndContext, DragOverlay } from '@dnd-kit/core';
import { AppShell } from '../components/layout/AppShell';
import { CourseCard } from '../features/Planner/components/CourseCard';
import { Footer } from '../features/Planner/components/Footer.jsx';
import { NavBar } from '../features/Planner/components/NavBar';
import { usePlannerState } from '../features/Planner/hooks/usePlannerState';

function PlannerPage() {
  const plannerState = usePlannerState();

  if (plannerState.isLoading) {
    return (
      <>
        <NavBar />
        <div className="flex min-h-[70vh] items-center justify-center bg-[var(--bg)] px-4 text-[var(--muted)]">
          Loading planners...
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <DndContext 
      onDragStart={plannerState.handleDragStart}
      onDragEnd={plannerState.handleDragEnd}
    >
      <NavBar />
      <div className="flex h-full w-full flex-col bg-[var(--bg)]">
        <div className="flex flex-1 justify-center px-4 py-6 md:px-6">
          <AppShell plannerState={plannerState} />
        </div>
        <Footer />
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
  );
}

export default PlannerPage;
