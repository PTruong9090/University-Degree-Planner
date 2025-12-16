import React from 'react';
import { useDraggable } from '@dnd-kit/core';


export function Draggable({id, data, children, className}) {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
    id,
    data,
  });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`mb-2 ${isDragging? "opacity-20" : "opacity0199"}`}
      {...listeners} 
      {...attributes}
    >
      {children}
    </div>
  );
}



  