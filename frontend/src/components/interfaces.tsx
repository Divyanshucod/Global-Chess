import { Square } from "chess.js";
export  interface ChessSquareProps {
    square: any;
    squareRepresentation: Square;
    handleMove: (from: Square, to: Square) => void;
    isDarkSquare: boolean;
    from: Square;
    setFrom:any;
    chess:any;
  }
