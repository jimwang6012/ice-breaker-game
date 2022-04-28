import { useEffect, useState } from "react";
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

function GamePage() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const [currentTime, setCurrentTime] = useState(0);

  const initGame = (game, myId) => {
    setBoard(game.board);
    const playerList = game.players;
    playerList.forEach((player, index) => {
      if (player.id === myId) {
        setMe(player);
        playerList.splice(index, 1);
      }
    });
    setPlayers(playerList);
  };

  const roomId = useParams().code;
  useEffect(() => {
    // @ts-ignore
    if (!!state.game) initGame(state.game, socket.id);

    const onGameUpdate = (game) => initGame(game, socket.id);
    const onGameEnd = () => {
      alert("game-end");
      navigate("/" + roomId.toString() + "/idle");
    };
    const onGameTimeChanged = (time) => {
      setCurrentTime(time);
    };
    socket.on("game-update", onGameUpdate);
    socket.on("game-end", onGameEnd);
    socket.on("game-time-changed", onGameTimeChanged);

    return () => {
      socket.off("game-update", onGameUpdate);
      socket.off("game-end", onGameEnd);
      socket.off("game-time-changed", onGameTimeChanged);
    };
    // @ts-ignore
  }, [navigate, roomId, state.game]);

  const [players, setPlayers] = useState([]);
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

  const handlePlayerMove = ({ keyName }) => {
    if (me.isAlive && !done) {
      // what every move or not, direction need to change
      changeDirection(me, keyName);

      if (me.isBreaker) {
        if (keyName === "Space") {
          //handle break ice using space
          breakIce(me, board, handleBreak);
        }
        // movement of breakers
        breakerMove(keyName, me, board);
      } else {
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
  useEffect(() => {
    const gameDone = () => {
      setDone(true);
    };
    socket.on("room-closed", gameDone);
    return () => {
      // Clean up
      socket.off("room-closed", gameDone);
    };
  }, []);

  const handleBreak = (row, col) => {
    board[row][col] = 0;
    setBoard([...board]);
    socket.emit("break", { roomId, y: col, x: row });
  };

  const onThisIce = (player, row, col) => {
    return player.x === row && player.y === col;
  };
  return (
    <div className="flex items-start justify-start w-11/16 h-screen overflow-y-auto bg-ice-8">
      {currentTime < 10 ? (
        <div className="text-6xl m-8 font-bold text-white">
          00:0{currentTime}
        </div>
      ) : (
        <div className="text-6xl m-8 font-bold text-white">
          00:{currentTime}
        </div>
      )}

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
                          <div className="flex items-center justify-center m-2 shadow-md player w-28 h-28 bg-ice-0">
                            {players.map((item, index) => {
                              if (onThisIce(item, row, col)) {
                                return (
                                  <PlayerAvatar key={index} player={item} />
                                );
                              } else return null;
                            })}
                            {onThisIce(me, row, col) && (
                              <PlayerAvatar player={me} isMe={true} />
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center m-2 player w-28 h-28">
                            {players.map((item, index) => {
                              if (onThisIce(item, row, col) && item.isBreaker) {
                                return (
                                  <PlayerAvatar key={index} player={item} />
                                );
                              } else return null;
                            })}
                            {onThisIce(me, row, col) && me.isBreaker && (
                              <PlayerAvatar player={me} isMe={true} />
                            )}
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
        className={classNames(
          "playerme flex items-center justify-center w-20 h-20 text-white rounded-2xl text",
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
