import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable( { id, className, children, data } ) {
    const { setNodeRef } = useDroppable({ 
      id,
      data,
    });

    return (
      <div 
      ref={setNodeRef} 
      className={className}
      id={id}
      >
        {children}
      </div>
    );
  }