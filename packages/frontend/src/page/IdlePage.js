import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";
import { MainButton } from "../component/Component";

export function IdlePage() {
  const navigate = useNavigate();
  const toHome = () => {
    socket.disconnect();
    navigate("/home");
  };
  const { isHost, roomId } = useContext(AppContext);

  const startGame = () => {
    socket.emit("start-game", { roomId });
  };

  useEffect(() => {
    const startGame = (game) => {
      if (game.board) navigate(`/${roomId}/game`, { state: { game: game } });
    };
    socket.on("game-update", startGame);
    return () => {
      socket.off("game-update", startGame);
    };
  }, [navigate, roomId]);

  return (
    <div className="flex items-center h-screen bg-ice-8 opacity-90">
      {/* Room Info */}
      <div className="flex flex-col items-center justify-center w-full gap-20 pt-5 ">
        <div className="text-6xl font-bold text-white">
          {isHost ? "Invite your friends!" : "Wait for host to Start!"}
        </div>
        {/* Room Code  */}
        <div className="w-2/5 py-16 rounded-lg shadow-lg px-28 bg-ice-2 ">
          <div className="flex flex-row justify-center gap-10 text-2xl font-bold text-black">
            Room Code: {roomId}
          </div>
        </div>
        {isHost ? (
          <div className="flex justify-around w-3/5 ">
            {/* Two Buttons */}
            <MainButton handleClick={toHome} text="Leave Room" />
            <MainButton handleClick={startGame} text="Start Game" />
          </div>
        ) : (
          <MainButton handleClick={toHome} text="Leave Room" />
        )}
      </div>
    </div>
  );
}
