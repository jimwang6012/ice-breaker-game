import { Server } from "socket.io";

let io;

function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
}

function getSocketIO() {
  if (!io) {
    throw new Error("SocketIO not initialized.");
  }
  return io;
}

export { initSocketServer, getSocketIO };
