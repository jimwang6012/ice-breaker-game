import { useEffect, useState } from "react";
import { useKeyDown } from "react-keyboard-input-hook";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  changeDirection,
  breakIce,
  breakerMove,
  playerMove,
} from "../component/PlayerControl";
import "./gampage.css";
import socket from "../Socket";

function GamePage() {
  const { state } = useLocation();

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
    socket.on("game-update", (game) => initGame(game, socket.id));
    // @ts-ignore
  }, [state.game]);

  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState({
    id: null,
    name: null,
    isAlive: true,
    isBreaker: false,
    x: -1,
    y: -1,
    direction: null,
  });
  const [board, setBoard] = useState([]);

  const handlePlayerMove = ({ keyName }) => {
    if (me.isAlive) {
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

  const handleBreak = (row, col) => {
    board[row][col] = 0;
    setBoard([...board]);
    socket.emit("break", { roomId, y: col, x: row });
  };

  const onThisIce = (player, row, col) => {
    return player.x === row && player.y === col;
  };
  return (
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
                              return <PlayerAvatar key={index} player={item} />;
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
                              return <PlayerAvatar key={index} player={item} />;
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
