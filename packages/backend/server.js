import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  BoardBreakOn,
  BoardMovementOn,
  CreateRoomOn,
  JoinRoomOn,
  MessageOn,
  StartGameOn,
  UpdateConfigOn,
  PlayerReadyOn,
  PlayerUnReadyOn,
  UserDisconnectOn,
  OnRoomInformationRequest,
} from "./socket/on.js";
import { initSocketServer, getSocketIO } from "./socket/index.js";

const ROOMS = new Map();

// Setup Express
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8080;

// Setup JSON parsing for the request body
app.use(express.json());

// Setup our routes.
initSocketServer(httpServer);

const io = getSocketIO();

io.on("connection", (socket) => {
  CreateRoomOn(socket);
  JoinRoomOn(socket);
  StartGameOn(socket);
  MessageOn(socket);
  BoardMovementOn(socket);
  BoardBreakOn(socket);
  UserDisconnectOn(socket);
  UpdateConfigOn(socket);
  PlayerReadyOn(socket);
  PlayerUnReadyOn(socket);
  OnRoomInformationRequest(socket);
});

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, "public")));

// Serve up the frontend's "build" directory, if we're running in production mode.
if (process.env.NODE_ENV === "production") {
  console.log("Running in production!");

  // Make all files in that folder public
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // If we get any GET request we can't process using one of the server routes, serve up index.html by default.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// app.listen(process.env.PORT || 3000);
