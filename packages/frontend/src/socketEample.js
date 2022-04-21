import { useState } from "react";
import socketClient from "socket.io-client";

import { useEffect } from "react";
import TestChatSample from "./testChatSample";
import ExampleCreateJoinAndStart from "./testCreateAndJoinRoomAndStartGameExample";

const SERVER = "http://localhost:8080/";
// the socketClient object must be unique globally, and only instantiated once
let socket = socketClient(SERVER);

export default function SocketExample() {
  //TODO: example usage of socket connection, to be removed
  const [board, setBoard] = useState([[]]);
  const [players, setPlayers] = useState(null);
  const [x, setX] = useState("0");
  const [roomId, setRoomId] = useState("");
  const [y, setY] = useState("0");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("member-join", ({ socketID }) => {
      alert(socketID + "hasJoined");
    });

    socket.on("room-closed", () => {
      alert("Room closed");
    });
    socket.on("game-update", (gameState) => {
      setBoard(gameState.board);
      setPlayers(gameState.players);
      console.log(gameState);
    });
  }, []);

  const moveOnBoard = () => {
    socket.emit("movement", { roomId, x, y, direction: "UP" });
  };

  const breakOnBoard = () => {
    socket.emit("break", { roomId, x, y });
  };

  return (
    <>
      <ExampleCreateJoinAndStart
        socket={socket}
        setRoomIdCallBack={setRoomId}
      ></ExampleCreateJoinAndStart>
      <div>
        <span>X: </span>
        <input
          type="number"
          value={x}
          onChange={(event) => setX(event.target.value)}
        />
        <span>Y: </span>
        <input
          type="number"
          value={y}
          onChange={(event) => setY(event.target.value)}
        />

        <button
          className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
          onClick={moveOnBoard}
        >
          moveOnBoard
        </button>

        <button
          className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
          onClick={breakOnBoard}
        >
          breakOnBoard
        </button>
      </div>
      <hr />

      <TestChatSample roomID={roomId} socket={socket}></TestChatSample>

      <p>{JSON.stringify(board)}</p>
      <p>{JSON.stringify(players)}</p>
    </>
  );
}
