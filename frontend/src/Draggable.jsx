import React from 'react';
import { useDraggable } from '@dnd-kit/core';


export function Draggable({id, data, children, className}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id,
    data,
  });
  
  const style = {
  position: 'relative',
  transform: transform 
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined,
    zIndex: 1000,
  };
  
  return (
    <button 
      ref={setNodeRef} 
      style={style} 
      className={className}
      {...listeners} 
      {...attributes}
    >
      {children}
    </button>
  );
}



  