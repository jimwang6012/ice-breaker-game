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
});

// When we make a GET request to '/hello', send back this HTML content.
app.get("/hello", (req, res) => {
  res
    .status(200)
    .contentType("text/html")
    .send(
      `<!DOCTYPE html>
        <html>
            <head>
                <title>Served from an Express endpoint!</title>
            </head>
            <body>
                <h1>Hello, Express!</h1>
                <p>This HTML content was served from an Express endpoint!</p>
            </body>
        </html>`
    );
});

// When we make a GET request to '/api', send back this JSON content.
// Uses the "name" query param e.g. http://localhost:3000/api?name=Clara
app.get("/api", (req, res) => {
  res.json({
    greeting: "Hello, world!",
    name: req.query.name,
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
