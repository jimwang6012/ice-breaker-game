import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";

function NamePage() {
  const navigate = useNavigate();
  const { isHost, setRoomId, roomId, handlers, name, setName } =
    useContext(AppContext);

  const toHome = () => {
    navigate("/home");
  };

  const createRoom = () => {
    socket.connect();
    socket.emit("create-room", { name: name }, (room) => {
      alert("Room " + room.roomId + " Created by " + name);
      setRoomId(room.roomId);
      handlers.setState(room.players);
      setName(name);
      navigate("/" + room.roomId.toString() + "/idle");
    });
  };

  const joinRoom = () => {
    socket.connect();
    socket.emit("join-room", { roomId, name });
    navigate("/" + roomId.toString() + "/idle");
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-y-auto bg-ice-8 opacity-90">
      {/* left square */}
      <div className="absolute top-0 rotate-45 -left-96 h-2/3 aspect-square bg-ice-3" />
      <div className="z-40 flex flex-col items-center justify-center gap-20 ">
        <div className="text-6xl font-bold text-white">Ice Breaker!</div>
        {/* center modal */}
        <div className="py-16 rounded-lg shadow-lg px-28 bg-ice-2">
          <div className="flex flex-row justify-start gap-10">
            <input
              className="justify-center text-xl font-bold text-center border rounded-md text-ice-7 px-14 bg-ice-0 border-ice-6"
              placeholder="Enter your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {isHost ? (
              <button
                onClick={createRoom}
                className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
              >
                {" "}
                Confirm
              </button>
            ) : (
              <button
                onClick={joinRoom}
                className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
              >
                {" "}
                Confirm
              </button>
            )}
          </div>
        </div>
        <button
          onClick={toHome}
          className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
        >
          Back
        </button>
      </div>
      {/* right square */}
      <div className="absolute bottom-0 rotate-45 -right-96 h-2/3 aspect-square bg-ice-3" />
    </div>
  );
}

export default NamePage;
