// game.tsx
import React, { useEffect, useState } from "react";
import { ChessBoard } from "../components/chessBoard";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import {
  Game_Over,
  MOVE,
  INIT_GAME,
  NEW_GAME,
  NEW_GAMEACC,
  NEW_GAMEDENI,
  DISCONNECTED,
} from "../components/gameMessages";
import { DisplayMoves } from "../components/Display_Moves";
import { UserProfileAndChessBoard } from "../components/userProfileAndChessTimer";
import { DragDropProvider } from "../components/DragDropContext";
import { ServerNotExist } from "../components/serverNotExist";
import Cookie from 'js-cookie';

export const Game = () => {
  const initialMinutes:number = 10;
  const initialSeconds:number = 0;
  const socket = useSocket();
  const [NewGame, setNewGame] = useState<false | Boolean>(false);
  const [playerLeavesTheGame,setPlayerLeavesTheGame] = useState<"NoOne" | String>("NoOne")
  const [fetchingGame,setFetchingGame] = useState<'Failed' | String>('Failed');
  const [NewGameDecline,setNewGameDecline] = useState<false | Boolean>(false);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStarted] = useState(false);
  const [storedMoves, setStoredMoves] = useState<[] | unknown[][]>([]);
  const [yourPieceColor, setyourPieceColor] = useState<"" | String>("");
  const [isWhiteTurn, setIsWhiteTurn] = useState<true | Boolean>(true);
  const [PlayButtonclicked, setPlayButtonClicked] = useState<false | Boolean>(
    false
  );
  const [whiteTime, setWhiteTime] = useState({
    minutes: initialMinutes,
    seconds: initialSeconds,
  });
  const [blackTime, setBlackTime] = useState({
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  const handleTimeUpdate = (player: string, time:any) => {
    if (time.minutes === 0 && time.seconds === 0) {
      console.log("inside the 00");

      socket?.send(
        JSON.stringify({
          type: Game_Over,
          payload: {
            message:
              player === "white" ? "Black Won The Game" : "White Won The Game",
          },
        })
      );
    } else if (player === "white") {
      setWhiteTime(time);
    } else {
      setBlackTime(time);
    }
  };
  function NewGameDenied(){
    setNewGame(false);
    socket?.send(JSON.stringify({ type: NEW_GAMEDENI }));
  }
  function handleGameInitiate() {
    setPlayButtonClicked(true);
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  }
  const handleNewGameAccepted = ()=>{
    setNewGame(false);
    chess.reset();
    setBoard(chess.board());
    setBlackTime({
      minutes: initialMinutes,
      seconds: initialSeconds,
    })
   setWhiteTime({
    minutes: initialMinutes,
    seconds: initialSeconds,
  });
  }

  useEffect(() => {
    if (!socket) return;
    const handleInit = (message: any) => {
      setBoard(chess.board());
      setStarted(true);
      setyourPieceColor(message.payload.color);
      Cookie.set("GameId", message.payload.Chess_id);
    };

    const handleMove = (message: any) => {
      setIsWhiteTurn(!isWhiteTurn);
      const move = message.payload;

      if (yourPieceColor === "white") {
        const lastMove = storedMoves[storedMoves.length - 1] || [];
        setStoredMoves([...storedMoves.slice(0, -1), [...lastMove, move.to]]);
      } else {
        setStoredMoves([...storedMoves, [move.to]]);
      }

      chess.move(move);
      setBoard(chess.board());
    };

    const handleGameOver = (message:any) => {
      alert(message.payload.message);
    };
    const handleNewGame = () => {
      setNewGame(true);
    };
    const handleNewGameDecline = ()=>{
      setNewGameDecline(true)
    }
    const handleDisconnected = (message:any)=>{

      console.log('inside the handleDisconnect');
      
      if(message.payload.type === 'Black'){
       setPlayerLeavesTheGame('Black')
      }
      else{
        setPlayerLeavesTheGame('White');
      }
    }
    socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          handleInit(message);
          break;
        case MOVE:
          handleMove(message);
          break;
        case Game_Over:
          handleGameOver(message);
          break;
        case NEW_GAME:
          handleNewGame();
          break;
        case NEW_GAMEACC:
          handleNewGameAccepted();
          break;
        case NEW_GAMEDENI:
          handleNewGameDecline();
          break;
        case DISCONNECTED:
          handleDisconnected(message);
          break;
      }
    };
  }, [socket, yourPieceColor, storedMoves,fetchingGame,playerLeavesTheGame]);
  if (!socket) return <ServerNotExist fetchingGame={fetchingGame} setFetchingGame={setFetchingGame}/>;

  return (
    <DragDropProvider>
      <div className="flex flex-wrap justify-center h-screen overflow-y-auto items-center p-10 md:p-4">
      
            <div className=" flex justify-between gap-20 flex-wrap items-center">
              <div className="flex flex-col items-center relative mx-auto p-2">
                {start && (
                  <UserProfileAndChessBoard
                    isWhiteTurn={isWhiteTurn}
                    blackTime={blackTime}
                    handleTimeUpdate={handleTimeUpdate}
                    playerInfo="black"
                    socket={socket}
                    playerLeavesTheGame={playerLeavesTheGame}
                    setPlayerLeavesTheGame={setPlayerLeavesTheGame}
                  />
                )}
                <ChessBoard
                  board={board}
                  socket={socket}
                  setBoard={setBoard}
                  chess={chess}
                  setStoredMoves={setStoredMoves}
                  storedMoves={storedMoves}
                  yourPieceColor={yourPieceColor}
                  isWhiteTurn={isWhiteTurn}
                  setIsWhiteTurn={setIsWhiteTurn}
                />
                {start && (
                  <UserProfileAndChessBoard
                    isWhiteTurn={isWhiteTurn}
                    blackTime={whiteTime}
                    handleTimeUpdate={handleTimeUpdate}
                    playerInfo="white"
                    socket={socket}
                    playerLeavesTheGame={playerLeavesTheGame}
                    setPlayerLeavesTheGame={setPlayerLeavesTheGame}
                  />
                )}
              </div>
            <div className= "w-[80%] sm:w-[70%] md:w-80 flex flex-col items-center border border-gray-500 relative container mx-auto h-full" style={{height:'525px'}}>
              <div className="w-full h-full">
                {start && (
                  <DisplayMoves StoredMoves={storedMoves} Socket={socket} NewGameDecline={NewGameDecline} setNewGameDecline={setNewGameDecline}/>
                )}
                {!start ? (
                  PlayButtonclicked ? (
                    <p className="text-2xl text-center">Connecting....</p>
                  ) : (
                    <Button onClick={handleGameInitiate} color="bg-green-400">
                      play
                    </Button>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {NewGame && (
          <div className="flex flex-col right-0 top-10 ButtonsBack">
            <span>Do you want to reset the game?</span>
            <span>with Player</span>
            <div className="flex justify-between w-full px-2 mt-2">
              <button
                className="normal-button"
                onClick={NewGameDenied}
              >
                Denied
              </button>
              <button
                className="normal-button"
                onClick={() =>{
                  handleNewGameAccepted();
                  socket?.send(
                    JSON.stringify({
                      type: NEW_GAMEACC,
                    })
                  )
                  
                }
                }
              >
                Accept
              </button>
            </div>
          </div>
        )}
    </DragDropProvider>
  );
};
