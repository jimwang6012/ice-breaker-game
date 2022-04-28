import { GameUpdate, MessageToChat } from "./emit.js";
import { getSocketIO } from "./index.js";
import { RoomManager } from "../manager/RoomManager.js";
import { Socket } from "socket.io";

/**
 * @param {Socket} socket - user socket
 */
export function CreateRoomOn(socket) {
  socket.on("create-room", ({ name }, callback) => {
    let room = RoomManager.createRoom(socket, name);
    if (callback) {
      const roomStatus = room.toDto();
      callback(roomStatus);
    }
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function JoinRoomOn(socket) {
  socket.on("join-room", ({ roomId, name }, callback) => {
    let room = RoomManager.joinRoom(socket, roomId, name);
    if (callback) {
      const roomStatus = room.toDto();
      callback(roomStatus);
    }
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function StartGameOn(socket) {
  socket.on("start-game", ({ roomId }, callback) => {
    RoomManager.startGame(roomId);
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function MessageOn(socket) {
  socket.on("send-message", ({ roomID, chatMessage }, callback) => {
    console.log(chatMessage + " in " + roomID);
    MessageToChat(roomID, chatMessage, "chat");
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function BoardMovementOn(socket) {
  socket.on("movement", ({ roomId, x, y, direction }, callback) => {
    console.log({ roomId, x, y, direction });
    RoomManager.movePlayer(roomId, socket.id, x, y, direction);
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function BoardBreakOn(socket) {
  socket.on("break", ({ roomId, x, y }, callback) => {
    RoomManager.breakTile(roomId, x, y);
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function UserDisconnectOn(socket) {
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      console.log("Disconnecting from " + room);
      RoomManager.leaveRoom(socket, room);
    });
  });
}
