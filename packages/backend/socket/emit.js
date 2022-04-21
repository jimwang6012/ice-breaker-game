import { Board } from "../model/Board.js";
import { getSocketIO } from "./index.js";

/**
 * @param {String} roomId - the room id
 * @param {String} chatMessage - message sent in the room
 */
export function MessageToChat(roomId, chatMessage) {
  getSocketIO().to(roomId).emit("message-to-chat", chatMessage);
}

/**
 * @param {String} roomId - the room id
 * @param {Object} gameState - the current gameState
 */
export function GameUpdate(roomId, gameState) {
  getSocketIO().to(roomId).emit("game-update", gameState);
}

export function RoomClosed(roomId) {
  getSocketIO().to(roomId).emit("room-closed");
}

/**
 * @param {String} roomId - the room id
 * @param {String} socketId - the current boardState
 */
export function MemberJoin(roomId, socketId) {
  getSocketIO().to(roomId).emit("member-join", { socketID: socketId });
}
