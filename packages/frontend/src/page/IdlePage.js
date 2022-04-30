import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";
import { MainButton } from "../component/Component";
import {
  ColorInput,
  Modal,
  NumberInput,
  Space,
  ThemeIcon,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

export function IdlePage() {
  const navigate = useNavigate();
  const toHome = () => {
    socket.disconnect();
    navigate("/home");
  };
  const { isHost, setIsHost, roomId, config, setConfig } =
    useContext(AppContext);

  const [opened, setOpened] = useState(false);
  const [isUpdateResponse, setUpdateResponse] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const refRoomSize = useRef(null);
  const refBoardSize = useRef(null);
  const refRoundTime = useRef(null);
  const refBreakTime = useRef(null);

  const updateConfig = () => {
    const newConfig = {
      roomSize: refRoomSize.current.value,
      boardSize: refBoardSize.current.value,
      roundTime: refRoundTime.current.value,
      breakTime: refBreakTime.current.value,
    };
    socket.emit("update-config", { roomId, config: newConfig }, (isSuccess) => {
      setUpdateResponse(true);
      setSuccess(isSuccess);
    });
  };

  const startGame = () => {
    socket.emit("start-game", { roomId });
  };

  useEffect(() => {
    const startGame = (game) => {
      if (game.hostId == socket.id) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
      if (game?.config) setConfig(game.config);
      if (game.board) navigate(`/${roomId}/game`, { state: { game: game } });
    };
    socket.on("game-update", startGame);
    return () => {
      socket.off("game-update", startGame);
    };
  }, [navigate, roomId]);

  return (
    <div className="flex items-center h-screen bg-ice-8 opacity-90">
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Game Config"
      >
        <NumberInput
          label="Room Size"
          description="Must be greater than current player count"
          placeholder="Number of players"
          defaultValue={config.roomSize}
          min={0}
          ref={refRoomSize}
          disabled={!isHost}
          styles={{
            input: {
              "&:disabled": {
                backgroundColor: "white",
                color: "black",
              },
            },
          }}
        />
        <NumberInput
          label="Board Size"
          description="Must be from 5 to 20"
          placeholder="Size of game board"
          defaultValue={config.boardSize}
          min={0}
          ref={refBoardSize}
          disabled={!isHost}
          styles={{
            input: {
              "&:disabled": {
                backgroundColor: "white",
                color: "black",
              },
            },
          }}
        />
        <NumberInput
          label="Round Time"
          description="Unit is in seconds"
          placeholder="Round time limit"
          defaultValue={config.roundTime}
          min={0}
          ref={refRoundTime}
          disabled={!isHost}
          styles={{
            input: {
              "&:disabled": {
                backgroundColor: "white",
                color: "black",
              },
            },
          }}
        />
        <NumberInput
          label="Break Delay"
          description="Unit is in seconds"
          placeholder="Tile break delay"
          defaultValue={config.breakTime}
          min={0}
          precision={1}
          ref={refBreakTime}
          disabled={!isHost}
          styles={{
            input: {
              "&:disabled": {
                backgroundColor: "white",
                color: "black",
              },
            },
          }}
        />
        {isHost && (
          <>
            <div className="flex justify-center">
              <button
                onClick={updateConfig}
                className="px-5 py-3 mt-5 font-semibold text-white rounded-lg text-l bg-ice-6 hover:bg-ice-5"
              >
                Update Config
              </button>
            </div>
            <Space h="xs" />
          </>
        )}
        {isUpdateResponse ? (
          isSuccess ? (
            <p className="text-center text-green-500">
              Successfully updated game config
            </p>
          ) : (
            <p className="text-center text-red-500">
              Failed to update game config
            </p>
          )
        ) : (
          <p className="invisible text-center">Invisible text</p>
        )}
      </Modal>
      {/* Room Info */}
      <div className="flex flex-col items-center justify-center w-full gap-20 pt-5 ">
        <div className="text-6xl font-bold text-white">
          {isHost ? "Invite your friends!" : "Wait for host to Start!"}
        </div>
        {/* Room Code  */}
        <div className="w-2/5 py-16 rounded-lg shadow-lg px-28 bg-ice-2 ">
          <div className="flex flex-row justify-center gap-2 text-2xl font-bold text-black">
            Room Code: {roomId}
            <button onClick={() => navigator.clipboard.writeText(roomId)}>
              <FontAwesomeIcon icon={faClipboard} />
            </button>
          </div>
        </div>
        {isHost ? (
          <div className="flex justify-around w-3/5 ">
            {/* Two Buttons */}
            <MainButton handleClick={toHome} text="Leave Room" />
            <MainButton handleClick={startGame} text="Start Game" />
            <MainButton
              handleClick={() => {
                setUpdateResponse(false);
                setOpened(true);
              }}
              text="Game Config"
            />
          </div>
        ) : (
          <div className="flex justify-around w-3/5 ">
            <MainButton handleClick={toHome} text="Leave Room" />
            <MainButton
              handleClick={() => {
                setUpdateResponse(false);
                setOpened(true);
              }}
              text="Game Config"
            />
          </div>
        )}
      </div>
    </div>
  );
}
