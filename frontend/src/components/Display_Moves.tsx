import React, { useEffect, useState } from "react";
import "./MoveBox.css";
import { NEW_GAME } from "./gameMessages";
export const DisplayMoves = ({ StoredMoves, Socket, NewGameDecline,setNewGameDecline }:{StoredMoves:any,Socket:WebSocket,NewGameDecline:Boolean,setNewGameDecline:any}) => {
  const [clickHappen, setClickHappen] = useState(false);
  const [NewGameInit, setNewGameInit] = useState(false);
  function HandleClick() {
    if (NewGameDecline) {
      setClickHappen(false);
      setNewGameInit(false);
      setNewGameDecline(false);
    } else {
      setNewGameInit(true)
      Socket?.send(
        JSON.stringify({
          type: NEW_GAME,
        })
      );
    }
  }
  return (
    <div className="container">
      <div className="buttons relative">
        <button className="button">Play</button>
        <button className="button" onClick={() => setClickHappen(true)}>
          New Game
        </button>
        {clickHappen && (
          <div className="flex flex-col right-0 top-10 ButtonsBack">
            {!NewGameDecline && !NewGameInit && (
              <>
                <span>You Want New Game?</span>
                <span>With Same Person</span>
              </>
            )}
            {(!NewGameDecline && NewGameInit) && (
              <>
                <span className="text-xl">Waiting For Player Response</span>
              </>
            )}
            {NewGameDecline && <div className="flex">
              <span>Player Decline For New Game</span>
              <button
                  className="normal-button"
                  onClick={ HandleClick}
                >
                  Cancle
                </button>
              </div>}
            <div className="flex justify-between w-full px-2 mt-2">
              {(!NewGameInit)
               && (
                <button
                  className="normal-button"
                  onClick={HandleClick}
                >
                  Cancle
                </button>
              )}
             {!NewGameInit && <button className="normal-button" onClick={HandleClick}>
                Ok
              </button>} 
            </div>
          </div>
        )}
      </div>
      <div className=" moves-box">
        <div className="moves-header">Moves</div>
        <div className="moves-list">
          {StoredMoves.map((move:any, index:any) => (
            <div className="move" key={index}>
              <span>{index + 1}.</span>
              <span>{move[0] ? move[0] : ""}</span>
              <span>{move[1] ? move[1] : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
