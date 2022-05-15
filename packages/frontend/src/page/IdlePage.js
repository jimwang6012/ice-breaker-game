import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";
import { MainButton } from "../component/MainButton";
import { Modal, NumberInput, Space, Group, Tooltip } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faVolumeHigh,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { ColorSwatchGroup } from "../component/ColorSwatchGroup";
import { PlayerSelector } from "../component/PlayerSelector";

export default function IdlePage() {
  const navigate = useNavigate();
  const toHome = () => {
    socket.disconnect();
    navigate("/home");
  };
  const {
    isHost,
    setIsHost,
    setHostId,
    roomId,
    players,
    handlers,
    config,
    setConfig,
    colors,
    colorStatus,
    setColorStatus,
    playing,
    toggle,
    stop,
  } = useContext(AppContext);

  const [opened, setOpened] = useState(false);
  const [isUpdateResponse, setUpdateResponse] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [checkedColor, setCheckedColor] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isReadyFail, setIsReadyFail] = useState(false);

  const refRoomSize = useRef(null);
  const refBoardSize = useRef(null);
  const refRoundTime = useRef(null);
  const refBreakTime = useRef(null);
  const refBreakerPlayer = useRef(null);

  const updateConfig = () => {
    const newConfig = {
      roomSize: refRoomSize.current.value,
      boardSize: refBoardSize.current.value,
      roundTime: refRoundTime.current.value,
      breakTime: refBreakTime.current.value,
      breakerName: refBreakerPlayer.current.value,
    };
    socket.emit("update-config", { roomId, config: newConfig }, (isSuccess) => {
      setUpdateResponse(true);
      setSuccess(isSuccess);
    });
  };

  const playerReady = () => {
    socket.emit(
      "player-ready",
      { roomId, playerId: socket.id, checkedColor },
      (isReady) => {
        if (isReady) {
          setIsReady(true);
          setIsReadyFail(false);
        } else {
          setIsReadyFail(true);
        }
      }
    );
  };

  const playerUnReady = () => {
    setIsReady(false);
    socket.emit("player-unready", { roomId, playerId: socket.id });
  };

  const startGame = () => {
    socket.emit("start-game", { roomId }, (isSuccess) => {
      if (!isSuccess) {
        alert("Not everyone is ready");
      }
    });
  };

  const checkColorBox = (index) => {
    if (index === checkedColor) {
      setCheckedColor(null);
    } else {
      setCheckedColor(index);
    }
  };

  useEffect(() => {
    playing ? toggle() : stop();
    socket.emit("room-information", { roomId }, (room) => {
      handlers.setState(room.players);
      setColorStatus(room.colorStatus);
      setHostId(room.hostId);
    });
    const startGame = (game) => {
      if (game.hostId === socket.id) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
      if (game?.config) setConfig(game.config);
      if (game?.colorStatus) setColorStatus(game.colorStatus);
      if (game.board) navigate(`/${roomId}/game`, { state: { game: game } });
    };
    socket.on("game-update", startGame);
    return () => {
      socket.off("game-update", startGame);
    };
  }, []);

  return (
    <div>
      <button
        onClick={playing ? stop : toggle}
        className="absolute z-10 px-5 py-3 font-semibold text-white rounded-lg top-2 left-2 text-l bg-ice-6 hover:bg-ice-5"
      >
        <FontAwesomeIcon icon={playing ? faVolumeHigh : faVolumeMute} />
      </button>
      <div className="flex items-center h-screen bg-ice-8 opacity-90">
        <Modal
          centered
          opened={opened}
          onClose={() => setOpened(false)}
          title="Game Config"
        >
          <NumberInput
            label="Room Size"
            description="From 0 to 9, greater than current player count"
            placeholder="Number of players"
            defaultValue={config.roomSize}
            min={0}
            max={9}
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
            description="From 5 to 20"
            placeholder="Size of game board"
            defaultValue={config.boardSize}
            min={0}
            max={20}
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
            description="From 0.0 to 1.0, unit is in seconds"
            placeholder="Tile break delay"
            defaultValue={config.breakTime}
            min={0}
            max={1}
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
          <PlayerSelector
            players={players}
            defaultValue={config.breakerName}
            breakerRef={refBreakerPlayer}
            disabled={!isHost}
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
          <Group
            position="center"
            grow
            style={{
              borderWidth: 3,
              borderRadius: 10,
              borderColor: isReady ? "#003853" : "transparent",
            }}
          >
            <div className="w-2/5 py-16 rounded-lg shadow-lg px-28 bg-ice-2 ">
              <div className="flex flex-row justify-center gap-2 text-2xl font-bold text-black">
                Room Code: {roomId}
                <button onClick={() => navigator.clipboard.writeText(roomId)}>
                  <FontAwesomeIcon
                    className="hover:text-ice-7"
                    icon={faClipboard}
                  />
                </button>
              </div>
              <Space h="xl" />
              <Space h="xl" />
              <Space h="xs" />
              {/* Color Picker */}
              <Group
                direction="row"
                spacing="lg"
                align="center"
                position="center"
              >
                <ColorSwatchGroup
                  colorStrings={colors}
                  colorStatus={colorStatus}
                  colorChecked={checkedColor}
                  isReady={isReady}
                  handleClick={checkColorBox}
                />
                <Tooltip
                  opened={isReadyFail}
                  label={"Please choose a valid color"}
                >
                  <MainButton
                    handleClick={isReady ? playerUnReady : playerReady}
                    text={isReady ? "Cancel" : "Ready"}
                  />
                </Tooltip>
              </Group>
            </div>
          </Group>
          {isHost ? (
            <div className="flex flex-col items-center justify-around w-3/5 xl:flex-row gap-y-2">
              {/* Two Buttons */}
              <MainButton
                handleClick={() => {
                  toHome();
                  stop();
                }}
                text="Leave Room"
              />
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
            <div className="flex flex-col items-center justify-around w-3/5 xl:flex-row gap-y-2">
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
    </div>
  );
}
