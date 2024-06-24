// DraggablePiece.tsx
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDragDrop } from './DragDropContext';

const DraggablePiece = ({ piece, position, onClickMove }:{piece:any,position:any,onClickMove:any}) => {
  const { dragEnabled } = useDragDrop();
  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: { piece, position },
    canDrag: dragEnabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}   onClick={() => !dragEnabled && onClickMove(position)}>
      <img src={`/${piece.color}_${piece.type}.png`} alt={`${piece.color} ${piece.type}`} />
    </div>
  );
};

export default DraggablePiece;
