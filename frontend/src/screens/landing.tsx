

// chessBoard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth0 } from "@auth0/auth0-react";

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth0();
  console.log(isAuthenticated);

  return (
    <div className="h-screen relative p-4 overflow-y-auto">
      {isAuthenticated && (
        <button
          className="absolute top-4 right-4 bg-blue-600 p-2 rounded-lg text-sm md:text-xl text-gray-200"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Log Out
        </button>
      )}
      <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-10">
        <div className=" w-full sm:w-[70%] md:w-[40%] md1:w-[30%] mx-auto md1:mx-0">
          <img
            src={"/chessBoard.jpeg"}
            className="h-full w-full object-cover rounded-lg shadow-black"
          />
        </div>
        <div className="text-center ">
          <h1 className="text-4xl md:text-5xl">Play Chess</h1>
          <p className="text-4xl md:text-5xl">Online</p>
          <p className="text-4xl md:text-5xl">On the #2 site</p>
          <div className="mt-4 space-y-4">
            <Button onClick={() => navigate("/game")} color="bg-green-700">
              Play Online
              <p className="text-base">Play somebody at your level</p>
            </Button>
            <Button onClick={() => navigate("/game")} color="bg-gray-600">
              Play Computer
              <p className="text-base">Play vs customize Training bot</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};



