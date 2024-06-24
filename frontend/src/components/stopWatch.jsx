import { useEffect, useState } from "react";
import React from "react";

export const StopWatch = ({ isWhiteTurn, start, yourPieceColor}) => {
  const [minutesForBlack, setMinutesForBlack] = useState(9);
  const [secondsForBlack, setSecondsForBlack] = useState(59);
  const [minutesForWhite, setMinutesForWhite] = useState(9);
  const [secondsForWhite, setSecondsForWhite] = useState(59);

  useEffect(() => {
    let intervalId;
    if (start) {
      intervalId = setInterval(() => {
        if (isWhiteTurn) {
          setSecondsForWhite((prev) => {
            if (prev === 0) {
              if (minutesForWhite === 0) {
                clearInterval(intervalId);
                console.log("black wins");
                return 0;
              } else {
                setMinutesForWhite((prev) => prev - 1);
                return 59;
              }
            } else {
              return prev - 1;
            }
          });
        } else {
          setSecondsForBlack((prev) => {
            if (prev === 0) {
              if (minutesForBlack === 0) {
                clearInterval(intervalId);
                console.log("white wins");
                return 0;
              } else {
                setMinutesForBlack((prev) => prev - 1);
                return 59;
              }
            } else {
              return prev - 1;
            }
          });
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [start, isWhiteTurn, minutesForBlack, minutesForWhite]);

  return (
    <div className="timer bg-gray-500 text-white">
       {isWhiteTurn ? <p style={{ backgroundColor: isWhiteTurn?'gray':'black'}}>{`${minutesForWhite}:${secondsForWhite}`}</p> : <p style={{ backgroundColor: isWhiteTurn?'gray':'black'}}>{`${minutesForWhite}:${secondsForWhite}`}</p>} 
     
       {isWhiteTurn ? <p style={{  backgroundColor: isWhiteTurn?'black':'gray'}}>{`${minutesForBlack}:${secondsForBlack}`}</p>: <p style={{  backgroundColor: isWhiteTurn?'black':'gray'}}>{`${minutesForBlack}:${secondsForBlack}`}</p>} 
    </div>
  );
};
