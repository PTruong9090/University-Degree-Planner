import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable( { id, className, children, data } ) {
    const { setNodeRef, isOver } = useDroppable({ 
      id,
      data,
    });

    const resolvedClassName =
      typeof className === 'function' ? className({ isOver }) : className;

    const resolvedChildren =
      typeof children === 'function' ? children({ isOver }) : children;

    return (
      <div 
      ref={setNodeRef} 
      className={resolvedClassName}
      id={id}
      data-over={isOver ? 'true' : 'false'}
      >
        {resolvedChildren}
      </div>
    );
  }
