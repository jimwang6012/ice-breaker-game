import { useContext, useEffect, useState } from "react";
import { useKeyDown } from "react-keyboard-input-hook";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  changeDirection,
  breakIce,
  breakerMove,
  playerMove,
} from "../component/PlayerControl";
import "./gampage.css";
import socket from "../Socket";
import { Modal } from "../component/Modal";
import { AppContext } from "../AppContextProvider";
import { LeaderBoard } from "../component/LeaderBoard";

function GamePage() {
  const navigate = useNavigate();

  const windowSizeChanged = () => {
    const initWidth = window.innerWidth * 0.7;
    const initHeight = window.innerHeight;
    const size = initWidth > initHeight ? initHeight : initWidth;
    setIceSize(size / (board.length + 3));
  };
  window.addEventListener("resize", windowSizeChanged);

  const { state } = useLocation();
  const [currentTime, setCurrentTime] = useState(0);
  const [show, setShow] = useState(false);
  const [leaderboardList, setLeaders] = useState();
  const [winningMessage, setWinner] = useState("");
  const initGame = (game, myId) => {
    const initWidth = window.innerWidth * 0.65;
    const initHeight = window.innerHeight;
    const size = initWidth > initHeight ? initHeight : initWidth;

    setBoard(game.board);
    setIceSize(size / (game.board.length + 3));

    const playerList = game.players;
    playerList.forEach((player, index) => {
      if (player.id === myId) {
        setMe(player);
      }
    });
    setPlayers(playerList);
  };

  const roomId = useParams().code;

  useEffect(() => {
    // @ts-ignore
    if (!!state.game) initGame(state.game, socket.id);

    const onGameUpdate = (game) => initGame(game, socket.id);
    const onGameEnd = (room) => {
      room.players.sort(function (a, b) {
        return b.score - a.score;
      });

      setLeaders(room.players);

      if (
        room.players.filter((player) => player.isAlive && !player.isBreaker)
          .length === 0
      ) {
        setWinner("Breaker Win !!!");
      } else {
        setWinner("Survivors Win !!!");
      }

      setShow(true);
    };
    const onGameTimeChanged = (time) => {
      setCurrentTime(time);
    };

    const gameDone = () => {
      setDone(true);
    };
    socket.on("room-closed", gameDone);
    socket.on("game-update", onGameUpdate);
    socket.on("game-end", onGameEnd);
    socket.on("game-time-changed", onGameTimeChanged);

    return () => {
      socket.off("room-closed", gameDone);
      socket.off("game-update", onGameUpdate);
      socket.off("game-end", onGameEnd);
      socket.off("game-time-changed", onGameTimeChanged);
    };
    // @ts-ignore
  }, [navigate, roomId, state.game]);

  const [players, setPlayers] = useState([]);
  const [iceSize, setIceSize] = useState(10);
  const [done, setDone] = useState(false);
  const [me, setMe] = useState({
    id: null,
    name: null,
    isAlive: true,
    isBreaker: false,
    x: 0,
    y: 0,
    direction: null,
  });
  const [board, setBoard] = useState([]);

  const { config, isTyping } = useContext(AppContext);

  const handlePlayerMove = ({ keyName }) => {
    if (me.isAlive && !done && !isTyping) {
      console.log(isTyping);
      // what every move or not, direction need to change
      if (me.isBreaker && !isBreaking) {
        changeDirection(me, keyName);
        if (keyName === "Space") {
          //handle break ice using space
          breakIce(me, board, handleBreak);
        } else {
          // movement of breakers
          breakerMove(keyName, me, board);
        }
      } else if (!me.isBreaker) {
        changeDirection(me, keyName);
        // normal non-breaker players on the ice
        playerMove(keyName, me, board.length);
      }
      socket.emit("movement", {
        roomId,
        x: me.x,
        y: me.y,
        direction: me.direction,
      });
      setMe(me);
    }
  };

  useKeyDown(handlePlayerMove);

  const [isBreaking, setIsBreaking] = useState(false);

  const handleBreak = async (row, col) => {
    setIsBreaking(true);
    await new Promise((resolve) =>
      setTimeout(resolve, config.breakTime * 1000)
    );
    board[row][col] = 0;
    setBoard([...board]);
    socket.emit("break", { roomId, y: col, x: row });
    setIsBreaking(false);
  };

  const onThisIce = (player, row, col) => {
    return player.x === row && player.y === col;
  };
  return (

    <div className="flex items-start justify-start h-screen overflow-y-auto w-11/16 bg-ice-8">
      <Modal
        title={
          <div className="text-3xl font-black text-white text-ice-6">
            {winningMessage}
          </div>
        }
        show={show}
        pageJump={() => {
          navigate("/" + roomId.toString() + "/idle");
        }}
        mainPrompt={<LeaderBoard list={leaderboardList} myID={me.id} />}
        buttonPrompt={"GG!"}
      />
          
      {/* {currentTime < 10 ? (
        <div className="m-8 text-6xl font-bold text-white">
          00:0{currentTime}
        </div>
      ) : (
        <div className="m-8 text-6xl font-bold text-white">
          00:{currentTime}
        </div>
      )} */}

      <div className="flex items-center justify-center h-screen overflow-y-auto bg-ice-8">
        {/* 以下仅为整蛊 */}
        {!me.isAlive && (
          <div
            className="absolute z-40 text-red-500 text-9xl animate-bounce"
            style={{ fontSize: 800 }}
          >
            死
          </div>
        )}
        <div className="">
          {board.map((rowItems, row) => {
            return (
              <div className="flex flex-row" key={row}>
                {rowItems.map((ice, col) => {
                  return (
                    <div className="flex" key={col}>
                      {/* {If is 0 but with less than 2 players} */}
                      {
                        ice === 1 ? (
                          <div
                            style={{
                              width: Math.round(iceSize),
                              height: Math.round(iceSize),
                              margin: Math.round(iceSize / board.length),
                            }}
                            className="flex items-center justify-center m-2 border-2 shadow-md border-ice-0 player bg-ice-0"
                          >
                            {players.map((item, index) => {
                              if (onThisIce(item, row, col)) {
                                return (
                                  <PlayerAvatar
                                    key={index}
                                    player={item}
                                    ice={iceSize}
                                  />
                                );
                              } else return null;
                            })}
                          </div>
                        ) : (
                          <div
                            style={{
                              width: Math.round(iceSize),
                              height: Math.round(iceSize),
                              margin: Math.round(iceSize / board.length),
                            }}
                            className="flex items-center justify-center m-2 border-2 player border-ice-0"
                          >
                            {players.map((item, index) => {
                              if (onThisIce(item, row, col) && item.isBreaker) {
                                return (
                                  <PlayerAvatar
                                    key={index}
                                    player={item}
                                    ice={iceSize}
                                  />
                                );
                              } else return null;
                            })}
                          </div>
                        ) // If 0
                      }
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GamePage;

function PlayerAvatar(props) {
  if (props.player.isAlive) {
    return (
      <div
        style={{ width: props.ice * 0.85, height: props.ice * 0.85 }}
        className={classNames(
          "playerme flex items-center justify-center text-white rounded-2xl text",
          {
            "": props.player.direction === "UP",
            " rotate-180": props.player.direction === "DOWN",
            " rotate-90": props.player.direction === "LEFT",
            " -rotate-90": props.player.direction === "RIGHT",
          },
          {
            "bg-green-400": props.isMe === true,
            "bg-red-500": props.isMe == null,
          }
        )}
      >
        ^
        <div
          className={classNames(" text-2xl text-white", {
            " ": props.player.direction === "UP",
            " rotate-180": props.player.direction === "DOWN",
            " -rotate-90": props.player.direction === "LEFT",
            " rotate-90": props.player.direction === "RIGHT",
          })}
        >
          {props.player.name}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
