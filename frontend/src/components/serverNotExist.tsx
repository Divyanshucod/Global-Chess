import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { Button } from "./Button";
export const ServerNotExist = ({ fetchingGame, setFetchingGame }:{fetchingGame:String,setFetchingGame:any}) => {
  const GameSession = Cookie.get("GameId");
  const [counter,setCounter] = useState(0);
  useEffect(()=>{
    let id:any = 0;
      if(fetchingGame === 'fetching' && counter != 10){
         id = setInterval(()=>{
            setCounter(prev => prev + 1)
        },1000)
      }
      else if(fetchingGame === 'fetching' && counter === 10){
        setFetchingGame('NewGame');
      }
      return ()=> clearInterval(id);
  },[fetchingGame,counter])
  return (
    <div className="h-screen">
      <div>Server Down</div>
      {!GameSession && (
        <div>
          {fetchingGame === 'Failed' && (
            <Button onClick={()=> setFetchingGame('fetching')} color="bg-green-600">Resume The Game</Button>
          )}
          {fetchingGame === 'fetching' && <><p>Fetching Game Data</p>
          <p>Wait.... <span className="text- 2xl text-white">{counter}</span></p></>}
          { fetchingGame === 'NewGame' &&  <><p>Sorry! We are not able to get your game data</p>
          <p>Kindly, Start New Game</p>
          <Button onClick={()=> window.location.reload()} color="bg-green-600">New Game</Button></>}
        </div>
      )}
    </div>
  );
};
