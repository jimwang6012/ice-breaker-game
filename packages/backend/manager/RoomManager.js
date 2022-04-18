import { Socket } from "socket.io";
import { Player } from "../model/Player.js";
import { Room } from "../model/Room.js";
import { BoardUpdate, PlayerUpdate } from "../socket/emit.js";
import { getSocketIO } from "../socket/index.js";
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
   * @return {string} the created room id
   */
  static createRoom(socket, name) {
    const roomId = generateString(6);
    socket.join(roomId);
    const host = new Player(socket.id, name);
    const room = new Room(roomId, host);
    rooms.set(room.roomId, room);
    return roomId;
  }

  /**
   * @return {Room} the room
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
      getSocketIO().to(roomId).emit("member-join", { socketID: socket.id });
      room.addPlayer(new Player(socket.id, name));
      console.log(rooms);
      console.log(roomId);
    } else {
      console.log("Can't find room");
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
    }
  }

  static startGame(roomId) {
    let room = rooms.get(roomId);
    room.isOpen = false;
    room.initBoard();
    BoardUpdate(roomId, room.board);
    PlayerUpdate(roomId, room.playersToDto());
  }

  static movePlayer(roomId, playerId, x, y, direction) {
    let room = rooms.get(roomId);
    let player = room.players.get(playerId);
    player.x = x;
    player.y = y;
    player.direction = direction;
    PlayerUpdate(roomId, room.playersToDto());
  }

  static breakTile(roomId, x, y) {
    let room = rooms.get(roomId);
    room.board.break(x, y);
    BoardUpdate(roomId, room.board);
  }
}
