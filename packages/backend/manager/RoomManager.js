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
import { Colors } from "../util/color.js";
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
    host.isBreaker = true;
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
      console.log("Can't find room");
    }
  }

  /**
   * remove the player from the room
   * @param {Socket} socket, user's socket
   * @param {string} roomId - id of the room
   */
  static leaveRoom(socket, roomId) {
    console.log(`${socket.id} is leaving ${roomId}`);

    const room = rooms.get(roomId);
    if (room) {
      if (room.hostId === socket.id) {
        // if the host left, delete the room
        RoomManager.deleteRoom(socket, roomId);
      } else {
        const leaverName = room.getPlayer(socket.id).name;
        const messageValue = leaverName + " has left the room!";
        MessageToChat(roomId, messageValue, "system");
        room.removePlayer(socket.id);
        GameUpdate(roomId, room.toDto());
      }
    } else {
      console.log("Can't find room for #leaveRoom");
    }
  }

  /**
   * @param {Socket} socket, user's socket
   * @param {string} roomId - id of the room
   */
  static deleteRoom(socket, roomId) {
    const room = rooms.get(roomId);

    // only host can delete its room
    if (room.hostId == socket.id) {
      rooms.delete(roomId);
      console.log(`${socket.id} host is deleting ${roomId}`);
      RoomClosed(roomId);
    }
  }

  /**
   * @param {string} roomId
   */
  static startGame(roomId) {
    let room = rooms.get(roomId);
    room.isOpen = false;
    room.initBoard();
    room.initPlayerPosition();
    room.initTimer(
      () => {
        console.log("game timer finished");
        room.closeGame();
        GameEnded(roomId);
      },
      (time) => {
        console.log(`game timer clicked ${time}`);

        room.checkIsAllPlayerDead();
        GameTimeChanged(roomId, time);
      }
    );
    GameUpdate(roomId, room.toDto());
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
    let player = room?.players.get(playerId);
    player.x = Number(x);
    player.y = Number(y);
    player.direction = direction;
    if (!player.isBreaker && !room.board.check(x, y)) {
      player.isAlive = false;
    }
    GameUpdate(roomId, room.toDto());
  }

  /**
   * @param {string} roomId
   * @param {number} x
   * @param {number} y
   */
  static breakTile(roomId, x, y) {
    let room = rooms.get(roomId);
    room.board.break(x, y);
    room.checkPlayersAlive(x, y);
    GameUpdate(roomId, room.toDto());
  }
}
