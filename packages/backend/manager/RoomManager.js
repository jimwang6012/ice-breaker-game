import { Socket } from "socket.io";
import { Player } from "../model/Player.js";
import { Room } from "../model/Room.js";
import {
  BoardUpdate,
  MemberJoin,
  PlayerUpdate,
  RoomClosed,
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
    PlayerUpdate(roomId, room.playersToDto());
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
      console.log(socket.id + " joined room " + roomId);
      room.addPlayer(new Player(socket.id, name));
      MemberJoin(roomId, socket.id);
      PlayerUpdate(roomId, room.playersToDto());
      console.log(rooms);
      console.log(roomId);
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
        room.removePlayer(socket.id);
        PlayerUpdate(roomId, room.playersToDto());
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
    BoardUpdate(roomId, room.board);
    PlayerUpdate(roomId, room.playersToDto());
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
    player.x = x;
    player.y = y;
    player.direction = direction;
    PlayerUpdate(roomId, room.playersToDto());
  }

  /**
   * @param {string} roomId
   * @param {number} x
   * @param {number} y
   */
  static breakTile(roomId, x, y) {
    let room = rooms.get(roomId);
    room.board.break(x, y);
    BoardUpdate(roomId, room.board);
  }
}
