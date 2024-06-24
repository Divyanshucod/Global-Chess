// DragDropContext.tsx
import React from 'react';
import { createContext, useContext, useState} from 'react';
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend'

const DragDropContext = createContext({
  dragEnabled: true,
  toggleDrag: () => {},
});

export const DragDropProvider = ({ children }:{children:any}) => {
  const [dragEnabled, setDragEnabled] = useState(true);

  const toggleDrag = () => setDragEnabled(!dragEnabled);

  return (
    <DragDropContext.Provider value={{ dragEnabled, toggleDrag }}>
      <DndProvider backend={HTML5Backend}>
        {children}
        </DndProvider>
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => useContext(DragDropContext);
