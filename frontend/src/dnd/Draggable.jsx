import React from 'react';
import { useDraggable } from '@dnd-kit/core';


export function Draggable({id, data, children, className}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id,
    data,
  });
  
  const style = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
      zIndex: isDragging ? 50 : 'unset',
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={className}
      {...listeners} 
      {...attributes}
    >
      {children}
    </div>
  );
}



  