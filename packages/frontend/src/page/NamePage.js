import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";
import { MainButton } from "../component/MainButton";
import { Modal } from "../component/Modal";
import { BsFillXCircleFill, BsCheckCircleFill } from "react-icons/bs";

function NamePage() {
  document.body.style.overflow = "hidden";
  const navigate = useNavigate();
  const {
    isHost,
    setRoomId,
    roomId,
    handlers,
    name,
    setName,
    setConfig,
    setColors,
    setColorStatus,
  } = useContext(AppContext);

  const toHome = () => {
    navigate("/home");
  };

  const [roomPrmpt, setmessgae] = useState("");
  const [roomNotFound, setNotFound] = useState(false);
  const [show, setShow] = useState(false);
  const createRoom = () => {
    socket.connect();
    socket.emit("create-room", { name: name }, (room) => {
      const string = "Room " + room.roomId + " Created!";
      setmessgae(string);
      setShow(true);
      // alert("Room " + room.roomId + " Created by " + name);
      setRoomId(room.roomId);
      handlers.setState(room.players);
      setName(name);
      setConfig(room.config);
      setColors(room.colors);
      setColorStatus(room.colorStatus);
      navigate("/" + room.roomId.toString() + "/idle");
    });
  };

  const joinRoom = () => {
    socket.connect();
    socket.emit("join-room", { roomId, name }, (room) => {
      if (room) {
        setRoomId(room.roomId);
        handlers.setState(room.players);
        setName(name);
        setConfig(room.config);
        setColors(room.colors);
        setColorStatus(room.colorStatus);
        navigate("/" + roomId.toString() + "/idle");
      } else {
        setmessgae("Room Not Found!");
        setNotFound(true);
        setShow(true);
      }
    });
  };

  return (
    <div className="overflow-hidden">
      <Modal
        show={show}
        pageJump={() => {
          if (!roomNotFound) {
            navigate("/" + roomId + "/idle");
          } else {
            navigate("/home");
          }
        }}
        mainPrompt={roomPrmpt}
        buttonPrompt={!roomNotFound ? "Join" : "OK"}
        title={
          <div className="pb-3 flex flex-row justify-center text-4xl text-ice-7">
            {!roomNotFound ? <BsCheckCircleFill /> : <BsFillXCircleFill />}
          </div>
        }
      />
      <div className="flex items-center justify-center h-screen overflow-y-auto bg-ice-8 opacity-90">
        {/* left square */}
        <div className="absolute top-0 rotate-45 -left-96 h-2/3 aspect-square bg-ice-3" />
        <div className="z-40 flex flex-col items-center justify-center gap-20 ">
          <div className="text-6xl font-bold text-white">Ice Breakers!</div>
          {/* center modal */}
          <div className="py-16 rounded-lg shadow-lg px-28 bg-ice-2">
            <div className="flex flex-row justify-start gap-10">
              <input
                className="justify-center text-xl font-bold text-center border rounded-md text-ice-7 px-14 bg-ice-0 border-ice-6"
                placeholder="Enter your name"
                aria-label="dwe"
                maxLength={12}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              {isHost ? (
                <MainButton handleClick={createRoom} text="Confirm" />
              ) : (
                <MainButton handleClick={joinRoom} text="Confirm" />
              )}
            </div>
          </div>
          <MainButton handleClick={toHome} text="Back" />
        </div>
        {/* right square */}
        <div className="absolute bottom-0 rotate-45 -right-96 h-2/3 aspect-square bg-ice-3" />
      </div>
    </div>
  );
}

export default NamePage;
