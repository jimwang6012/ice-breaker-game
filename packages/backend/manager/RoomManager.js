import { Socket } from "socket.io";
import { Player } from "../model/Player.js";
import { Room } from "../model/Room.js";
import {
  GameEnded,
  GameUpdate,
  MessageToChat,
  RoomClosed,
  GameTimeChanged,
} from "../socket/emit.js";
import { generateString } from "./util.js";

/**
 * @type {Map<string,Room>} - all the rooms
 */
let rooms = new Map();

export class RoomManager {
  /**
   * @param {Socket} socket, user's socket
   * @param {string} name, user's name
   * @return {Room} the created room
   */
  static createRoom(socket, name) {
    const roomId = generateString(6);
    socket.join(roomId);
    const host = new Player(socket.id, name);
    const room = new Room(roomId, host);
    rooms.set(room.roomId, room);
    GameUpdate(roomId, room.toDto());
    return room;
  }

  /**
   * @return {Room} the room
   * @param {string} roomId
   */
  static getRoom(roomId) {
    return rooms.get(roomId);
  }

  /**
   * @param {Socket} socket, user's socket
   * @param {string} roomId - id of the room
   * @param {string} name, user's name
   * @return {Room} the room the player join
   */
  static joinRoom(socket, roomId, name) {
    const room = rooms.get(roomId);
    if (room && room.isOpen) {
      socket.join(roomId);
      room.addPlayer(new Player(socket.id, name));
      const messageValue = name + " has joined the room!";
      MessageToChat(roomId, messageValue, "system");
      GameUpdate(roomId, room.toDto());
      return room;
    } else {
      return null;
    }
  }

  /**
   * remove the player from the room
   * @param {Socket} socket, user's socket
   * @param {string} roomId - id of the room
   */
  static leaveRoom(socket, roomId) {
    const room = rooms.get(roomId);
    if (room) {
      if (room.hostId === socket.id) {
        // if the host left, delete the room
        RoomManager.deleteRoom(socket, roomId);
      } else {
        const leaver = room.getPlayer(socket.id);
        if (!isNaN(leaver.colorId)) {
          room.colorStatus[leaver.colorId] = null;
        }
        if (leaver.isBreaker) {
          room.resetBreaker();
          room.config.breakerName = "";
          room.setHostAsBreaker();
        }
        const leaverName = leaver.name;
        const messageValue = leaverName + " has left the room!";
        MessageToChat(roomId, messageValue, "system");
        room.removePlayer(socket.id);
        GameUpdate(roomId, room.toDto());
      }
    }
  }

  /**
   * @param {Socket} socket, user's socket
   * @param {string} roomId - id of the room
   */
  static deleteRoom(socket, roomId) {
    const room = rooms.get(roomId);

    // only host can delete its room
    if (room && room.hostId == socket.id) {
      rooms.delete(roomId);
      RoomClosed(roomId);
    }
  }

  /**
   * @param {string} roomId
   */
  static startGame(roomId) {
    let room = rooms.get(roomId);

    if (room) {
      let players = [...room.players.values()];
      if (players.filter((p) => !p.isReady).length != 0) {
        return false;
      }
      room.isOpen = false;
      room.initBoard(room.config.boardSize);
      room.initPlayerPosition();
      room.players.forEach((player, id) => {
        if (player.isBreaker) {
          const message = player.name + " is Breaker! Game Start!";
          MessageToChat(roomId, message, "system");
        }
      });
      room.initTimer(
        () => {
          room.closeGame();

          let numSurvivor = 0;
          /**
           * @type {Player} - breaker
           */
          let breaker;
          room.players.forEach((player) => {
            player.isReady = false;
            if (player.isAlive && !player.isBreaker) {
              player.score++;
              numSurvivor++;
            }
            if (player.isBreaker) {
              breaker = player;
            }
          });
          if (numSurvivor == 0) {
            breaker.score += room.players.size;
          }
          // clear color status
          room.colorStatus = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ];

          GameEnded(roomId, room.toDto());
        },
        (time) => {
          room.checkIsAllPlayerDead();
          GameTimeChanged(roomId, time);
        }
      );
      GameUpdate(roomId, room.toDto());
      return true;
    }
  }

  /**
   * @param {string} roomId
   * @param {string} playerId
   * @param {number} x
   * @param {number} y
   * @param {string} direction
   */
  static movePlayer(roomId, playerId, x, y, direction) {
    let room = rooms.get(roomId);
    if (room) {
      let player = room.players.get(playerId);
      if (player && room.board) {
        player.x = Number(x);
        player.y = Number(y);
        player.direction = direction;
        GameUpdate(roomId, room.toDto());
        if (!room.checkPlayerAlive(playerId)) {
          this.playerDead(roomId, player);
        }
      }
    }
  }

  /**
   * @param {string} roomId
   * @param {number} x
   * @param {number} y
   */
  static breakTile(roomId, x, y) {
    let room = rooms.get(roomId);
    if (room && room.board) {
      room.board.break(x, y);

      // Check whether there is a player killed on the broken tile
      room.players.forEach((player, playerId) => {
        if (!room.checkPlayerAlive(playerId)) {
          this.playerDead(roomId, player);
        }
      });
      GameUpdate(roomId, room.toDto());
    }
  }

  /**
   * Send message to chat room when a player dies.
   * @param {String} roomId
   * @param {Player} player
   */
  static playerDead(roomId, player) {
    const message = player.name + " is dead!";
    MessageToChat(roomId, message, "system");
  }

  static updateConfig(roomId, config) {
    let room = rooms.get(roomId);
    if (room && config) {
      const { roomSize, boardSize, roundTime, breakTime, breakerName } = config;

      if (
        isNaN(roomSize) ||
        isNaN(boardSize) ||
        isNaN(roundTime) ||
        isNaN(breakTime) ||
        !breakerName
      ) {
        return false;
      }
      const newRoomSize = Number(roomSize);
      if (newRoomSize < room.players.size) {
        return false;
      }

      const newBoardSize = Number(boardSize);
      if (!(newBoardSize >= 5 && newBoardSize <= 20)) {
        return false;
      }

      let foundPlayer = null;
      for (let player of room.players.values()) {
        if (player.name === breakerName) {
          foundPlayer = player;
        }
      }

      if (!foundPlayer) {
        return false;
      }

      room.config.roomSize = newRoomSize;

      room.config.boardSize = newBoardSize;

      const newRoundTime = Number(roundTime);
      room.config.roundTime = newRoundTime;

      const newBreakTime = Number(breakTime);
      room.config.breakTime = newBreakTime;

      room.resetBreaker();
      foundPlayer.isBreaker = true;
      room.config.breakerName = breakerName;
    } else {
      return false;
    }
    GameUpdate(roomId, room.toDto());
    return true;
  }

  static playerReady(roomId, playerId, checkedColor) {
    let room = rooms.get(roomId);
    if (room) {
      let player = room.players.get(playerId);
      if (player && checkedColor !== null && !room.colorStatus[checkedColor]) {
        room.colorStatus[checkedColor] = playerId;
        player.colorId = checkedColor;
        player.isReady = true;
        GameUpdate(roomId, room.toDto());
        return true;
      } else {
        return false;
      }
    }
  }

  static playerUnReady(roomId, playerId) {
    let room = rooms.get(roomId);
    if (room) {
      let player = room.players.get(playerId);
      if (player && player.isReady) {
        room.colorStatus[player.colorId] = null;
        player.colorId = null;
        player.isReady = false;
        GameUpdate(roomId, room.toDto());
      }
    }
  }

  static getRoomInformation(roomId) {
    let room = rooms.get(roomId);
    if (room) {
      return { ...room.toDto() };
    }
  }
}
