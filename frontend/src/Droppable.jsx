import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable( props ) {
    const { setNodeRef } = useDroppable({ 
      id: props.id
    });

    return (
      <div ref={setNodeRef} className='course-list-container'>
        {props.children}
      </div>
    );
  }