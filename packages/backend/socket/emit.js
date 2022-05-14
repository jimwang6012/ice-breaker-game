import { getSocketIO } from "./index.js";

/**
 * @param {String} roomId - the room id
 * @param {String} value - text value of message
 * @param {String} type - type of message, can be either "chat" or "system"
 */
export function MessageToChat(roomId, value, type) {
  const message = { value: value, type: type };
  getSocketIO().to(roomId).emit("message-to-chat", message);
}

/**
 * @param {String} roomId - the room id
 * @param {Object} gameState - the current gameState
 */
export function GameUpdate(roomId, gameState) {
  getSocketIO().to(roomId).emit("game-update", gameState);
}

/**
 * @param {string} roomId - the room id
 */
export function RoomClosed(roomId) {
  getSocketIO().to(roomId).emit("room-closed");
}

/**
 * @param {String} roomId - the room id
 * @param {String} message - the message content
 */
export function SystemMessage(roomId, message) {
  getSocketIO().to(roomId).emit("system-message", message);
}

/**
 * @param {String} roomId - the room id
 */
export function GameEnded(roomId, gameState) {
  getSocketIO().to(roomId).emit("game-end", gameState);
}

/**
 * @param {String} roomId - the room id
 * @param {Number} time - time in second left in the game
 */
export function GameTimeChanged(roomId, time) {
  getSocketIO().to(roomId).emit("game-time-changed", time);
}
