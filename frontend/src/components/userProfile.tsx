import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const UserProfile = ({ playerLeavesTheGame, player,setPlayerLeavesTheGame }:{playerLeavesTheGame:String,player:string,setPlayerLeavesTheGame:any}) => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div className="w-full h-14 flex justify-between items-center px-4 py-1 bg-gray-800 text-white rounded-lg shadow-md">
      <div className="profile flex items-center">
        <img
          src={isAuthenticated ? user?.picture : "black_pawn.png"}
          alt={`${isAuthenticated ? user?.name : "Profile"}`}
          className="w-10 h-10 border p-1 rounded-full"
        />
        <div className="ml-3">
          <h2 className="text-lg font-semibold">
            {isAuthenticated ? user?.name : "GuestUser1234"}
          </h2>
          {player === "black" ? (
            playerLeavesTheGame === "Black" ? (
              <h3 className="text-red-500">Disconnected</h3>
            ) : (
              <h3 className="text-green-500">Online</h3>
            )
          ) : (
            ""
          )}
          {player === "white" ? (
            playerLeavesTheGame === "White" ? (
              <h3 className="text-red-500">Disconnected</h3>
            ) : (
              <h3 className="text-green-500">Online</h3>
            )
          ) : (
            ""
          )}
          {player === "black" ? (
            playerLeavesTheGame === "Black" ? (
              <div className="ButtonsBack flex flex-col items-center gap-2 mt-4 z-10">
                <span>
                  Black Leaves the Game. Do you want to play a new game?
                </span>
                <div className="buttons flex gap-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                  >
                    Ok
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={()=> setPlayerLeavesTheGame(' NoOne')}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {player === "white" ? (
            playerLeavesTheGame === "White" ? (
              <div className="ButtonsBack flex flex-col items-center gap-2 mt-4 z-10">
                <span>
                  White Leaves the Game. Do you want to play a new game?
                </span>
                <div className="buttons flex gap-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                  >
                    Ok
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={()=> setPlayerLeavesTheGame('NoOne')}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
