import { useState } from "react";

export default function ExampleCreateJoinAndStart({
  socket,
  setRoomIdCallBack,
}) {
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    socket.emit("create-room", { name: "Cool name" }, (id) => {
      alert("Room " + id);
      setRoomId(id);
      setRoomIdCallBack(id);
    });
  };

  const joinRoom = () => {
    socket.emit("join-room", { roomId, name: "Cool name" });
  };

  const startGame = () => {
    socket.emit("start-game", { roomId });
  };

  return (
    <>
      <button
        className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
        onClick={createRoom}
      >
        CreatRoom
      </button>
      <hr />

      <div>
        <span>JoinRoom id: </span>
        <input
          type="text"
          value={roomId}
          onChange={(event) => {
            setRoomId(event.target.value);
            setRoomIdCallBack(event.target.value);
          }}
        />
        <button
          className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
          onClick={joinRoom}
        >
          JoinRoom
        </button>
      </div>
      <hr />

      <button
        className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
        onClick={startGame}
      >
        Start Game
      </button>
      <hr />
    </>
  );
}
