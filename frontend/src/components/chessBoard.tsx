import { Color, PieceSymbol, Square } from "chess.js";
import { MOVE } from "../components/gameMessages";

// chessBoard.tsx
import React, { useState } from "react";
import ChessSquare from "./chessSquare";
import { useDragDrop } from "./DragDropContext";
import "../components/Toggle.css";

export const ChessBoard = ({
  board,
  socket,
  setBoard,
  chess,
  setStoredMoves,
  storedMoves,
  yourPieceColor,
  isWhiteTurn,
  setIsWhiteTurn,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
  setStoredMoves: any;
  storedMoves: any;
  yourPieceColor: String;
  isWhiteTurn: Boolean;
  setIsWhiteTurn: any;
}) => {
  const [from, setFrom] = useState<null | any>(null);
  const { dragEnabled, toggleDrag } = useDragDrop();
  const handleMove = (from: Square, to: Square) => {
    console.log('checking value', from,to);
    
    
    let chessGame_Id = localStorage.getItem("chessGame_Id");
    socket.send(
      JSON.stringify({
        type: MOVE,
        payload: {
          move: { from, to },
          id: chessGame_Id,
        },
      })
    );
    chess.move({ from, to });
    const updatedMoves =
      yourPieceColor === "black"
        ? [
            ...storedMoves.slice(0, -1),
            [...storedMoves[storedMoves.length - 1], to],
          ]
        : [...storedMoves, [to]];

    setStoredMoves(updatedMoves);
    console.log("before move check");
    setBoard(chess.board());
    console.log("after move check");
    setFrom(null);
    setIsWhiteTurn(!isWhiteTurn);
  };

  return (
    <>
      <div className="text-black w-full relative">
        <div className=" h-8 w-8 md:h-10 md:w-10 absolute  bottom-1  -right-11 hover-container">
          <img
            src="toggle.png"
            onClick={toggleDrag}
            className={`w-full h-full ${
              dragEnabled ? "bg-gray-500" : "bg-white"
            } rounded-lg cursor-pointer`}
          />
          <p className="hover-text ButtonsBack z-10">Make piece clickable</p>
        </div>
        {board.map((row: any, i: number) => (
          <div key={i} className="flex">
            {row.map((square: any, j: number) => {
              const squareRepresentation = (String.fromCharCode(97 + j) +
                (8 - i)) as Square;
              const isDarkSquare = (i + j) % 2 === 0;

              return (
                <ChessSquare
                  key={j}
                  square={square}
                  squareRepresentation={squareRepresentation}
                  handleMove={handleMove}
                  isDarkSquare={isDarkSquare}
                  from={from}
                  setFrom={setFrom}
                  chess={chess}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};
