import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  
  const style = {
  position: 'relative',
  transform: transform 
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined,
    zIndex: 1000,
  };
  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}



  