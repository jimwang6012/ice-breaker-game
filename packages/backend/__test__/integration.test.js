import { RoomManager } from "../manager/RoomManager.js";
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import * as SocketOn from "../socket/on.js";
import { getSocketIO, initSocketServer } from "../socket/index.js";
import { domainToASCII } from "url";

describe("create and join room", () => {
  let io, serverSocket, clientSocket1, clientSocket2;
  beforeAll((done) => {
    const httpServer = createServer();
    initSocketServer(httpServer);
    io = getSocketIO();
    httpServer.listen(() => {
      // initialised 2 client socket
      const port = httpServer.address().port;
      clientSocket1 = Client(`http://localhost:${port}`);
      clientSocket2 = Client(`http://localhost:${port}`);

      io.on("connection", (socket) => {
        serverSocket = socket;
        SocketOn.CreateRoomOn(serverSocket);
        SocketOn.JoinRoomOn(serverSocket);
        SocketOn.StartGameOn(serverSocket);
        SocketOn.BoardBreakOn(serverSocket);
        SocketOn.BoardMovementOn(serverSocket);
      });

      let connectedClientNum = 0;

      function socketConnected() {
        connectedClientNum++;

        if (connectedClientNum == 2) {
          done();
        }
      }
      clientSocket1.on("connect", socketConnected);
      clientSocket2.on("connect", socketConnected);
    });
  });

  afterAll((done) => {
    io.close();
    clientSocket1?.close();
    clientSocket2?.close();
    done();
  });

  beforeEach((done) => {
    clientSocket1.off("create-room");
    clientSocket2.off("create-room");

    clientSocket1.off("join-room");
    clientSocket2.off("join-room");
    done();
  });

  it("should create a room", (done) => {
    clientSocket1.emit("create-room", { name: "world" }, (room) => {
      expect(room.players.length).toBe(1);
      expect(RoomManager.getRoom(room.roomId).roomId).toBe(room.roomId);
      done();
    });
  });

  it("create and join rooms", (done) => {
    clientSocket1.emit("create-room", { name: "world" }, (room) => {
      let roomId = room.roomId;
      clientSocket2.emit("join-room", { roomId, name: "world" }, (room) => {
        expect(room.players.length).toBe(2);
        expect(room.roomId).toBe(roomId);
        done();
      });
    });
  });

  describe("room move", () => {
    let roomId;
    beforeAll((done) => {
      clientSocket1.emit("create-room", { name: "world" }, (room) => {
        roomId = room.roomId;
        clientSocket2.emit("join-room", { roomId, name: "world" }, (room) => {
          expect(room.players.length).toBe(2);
          expect(room.roomId).toBe(roomId);
          done();
        });
      });
    });

    it("start-game", (done) => {
      clientSocket2.on("game-update", (game) => {
        let room = RoomManager.getRoom(roomId);
        expect(room.board.toDto()).toStrictEqual(game.board);
        room.clearTimer();
        done();
      });
      clientSocket1.emit("start-game", { roomId });
    });
  });
});
