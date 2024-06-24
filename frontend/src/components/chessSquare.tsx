

// ChessSquare.tsx
import React from "react";
import { useDrop } from "react-dnd";
import { Square } from "chess.js";
import { useDragDrop } from "./DragDropContext";
import DraggablePiece from "./DragAblePiece";
import {ChessSquareProps} from './interfaces.jsx'

const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  squareRepresentation,
  handleMove,
  isDarkSquare,
  from,
  setFrom,
  chess,
}:{square:Square
  squareRepresentation:Square
  handleMove:any
  isDarkSquare:Boolean
  from:any
  setFrom:any
  chess:any,}) => {                                                                                                                                                                                                                                                                                                                                                           function isMoveValid(from:Square, to:Square) {
  const legalMoves = chess.moves({ square: from, verbose: true });
  return legalMoves.some((move:any) => move.to === to);
}                                                            
  const { dragEnabled } = useDragDrop();
  const handleSquareClick = (square:any) => {
    if (!from) {
      console.log(from);

      setFrom(square);
    } else {
      if (isMoveValid(from, square)) {
        handleMove(from, square);
      }
      setFrom(null);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: "piece",
    drop: (item: { piece: any; square: Square }) => {
      if (isMoveValid(item.piece.square, squareRepresentation)) {
        handleMove(item.piece.square, squareRepresentation);
      }
      
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`h-9 w-9 ssm:w-12 ssm:h-12 md:w-16 md:h-16 ${
        isOver ? "bg-yellow-500" : isDarkSquare ? "bg-green-500" : "bg-white"
      }`}
      onClick={() => !dragEnabled && handleSquareClick(squareRepresentation)}
    >
      <div className="flex justify-center items-center">
        {square && (
          <DraggablePiece
            piece={square}
            position={squareRepresentation}
            onClickMove={handleSquareClick}
          />
        )}
      </div>
    </div>
  );
};

export default ChessSquare;
