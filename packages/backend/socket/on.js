import { GameUpdate, MessageToChat } from "./emit.js";
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
      if (room) {
        const roomStatus = room.toDto();
        callback(roomStatus);
      } else {
        callback(null);
      }
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
    MessageToChat(roomID, chatMessage, "chat");
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function BoardMovementOn(socket) {
  socket.on("movement", ({ roomId, x, y, direction }, callback) => {
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
      RoomManager.leaveRoom(socket, room);
    });
  });
}

/**
 * @param {Socket} socket - user socket
 */
export function UpdateConfigOn(socket) {
  socket.on("update-config", ({ roomId, config }, callback) => {
    const isSuccess = RoomManager.updateConfig(roomId, config);
    if (callback) {
      callback(isSuccess);
    }
  });
}
