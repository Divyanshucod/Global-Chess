
import React from "react";
import ChessTimer from "./chessTimer";
import { UserProfile } from "./userProfile";

export const UserProfileAndChessBoard = ({
  isWhiteTurn,
  blackTime,
  handleTimeUpdate,
  playerInfo,
  socket,
  playerLeavesTheGame,
  setPlayerLeavesTheGame
}:{ isWhiteTurn:Boolean
  blackTime:any,
  handleTimeUpdate:any,
  playerInfo:any,
  socket:WebSocket,
  playerLeavesTheGame:String,
  setPlayerLeavesTheGame:any}) => {

  return (
    <div className="flex w-full items-center gap-0 rounded-lg shadow-lg">
      <UserProfile playerLeavesTheGame={playerLeavesTheGame} player={playerInfo} setPlayerLeavesTheGame={setPlayerLeavesTheGame}/>
      <ChessTimer
        player={playerInfo}
        isActive={playerInfo === "black" ? !isWhiteTurn : isWhiteTurn}
        initialMinutes={blackTime.minutes}
        initialSeconds={blackTime.seconds}
        onTimeUpdate={handleTimeUpdate}
        socket={socket}
      />
    </div>
  );
};

