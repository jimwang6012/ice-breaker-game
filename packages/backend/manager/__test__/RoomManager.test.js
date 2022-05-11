import { Direction } from "../../util/direction.js";
import { RoomManager } from "../RoomManager.js";
import * as util from "../util.js";

jest.mock("../../socket/emit.js");
jest.mock("../util.js");

describe("Room manager test", () => {
  let socket, existRoomId, anotherSocket, room;

  beforeAll((done) => {
    socket = {
      id: "testid",
      join: (id) => {},
    };
    anotherSocket = {
      id: "another id",
      join: (id) => {},
    };
    existRoomId = "ExistTestRoomId";
    done();
  });

  beforeEach(() => {
    jest.spyOn(util, "generateString").mockReturnValue(existRoomId);
    room = RoomManager.createRoom(socket, "HostName");
  });

  it("test create room", (done) => {
    jest.spyOn(util, "generateString").mockReturnValue("New Create");
    let room = RoomManager.createRoom(socket, "HostName");
    expect(room).toBeDefined();
    expect(room.hostId).toBe(socket.id);
    done();
  });

  it("test join room", (done) => {
    let room = RoomManager.joinRoom(
      anotherSocket,
      existRoomId,
      "New Person's name"
    );
    expect(room).toBeDefined();
    expect(room.roomId).toBe(existRoomId);
    expect(anotherSocket.id).not.toBe(room.hostId);
    done();
  });

  it("test join not existed room", (done) => {
    let room = RoomManager.joinRoom(socket, "not-existed-room-Id", "name");
    let roomFromManager = RoomManager.getRoom("not-existed-room-Id");

    expect(room).toBeNull();
    expect(roomFromManager).toBeUndefined();
    done();
  });

  it("start game should fail without every is ready", (done) => {
    let roomBefore = RoomManager.getRoom(existRoomId);
    expect(roomBefore.isOpen).toBe(true);
    let res = RoomManager.startGame(existRoomId);
    expect(res).toBe(false);
    done();
  });

  it("delete room by host", (done) => {
    RoomManager.deleteRoom(socket, existRoomId);
    let room = RoomManager.getRoom(existRoomId);
    expect(room).toBeUndefined();
    done();
  });

  it("delete room by non-host is not allowed", (done) => {
    RoomManager.deleteRoom(anotherSocket, existRoomId);
    let room = RoomManager.getRoom(existRoomId);
    expect(room).toBeTruthy();
    done();
  });

  it("player move", (done) => {
    let room = RoomManager.getRoom(existRoomId);
    jest.spyOn(room, "initTimer");
    jest.spyOn(room, "initBoard");
    jest.spyOn(room, "initPlayerPosition");
    let players = new Map();
    players["id"] = { isReady: true };
    jest.spyOn(room.players, "values").mockReturnValue(players.values());
    RoomManager.startGame(existRoomId);
    RoomManager.movePlayer(existRoomId, socket.id, 9, 6, Direction.up);

    expect(room.getPlayer(socket.id).direction).toBe(Direction.up);
    expect(room.getPlayer(socket.id).x).toBe(9);
    expect(room.getPlayer(socket.id).y).toBe(6);
    done();
  });

  it("break tile", (done) => {
    jest.spyOn(room, "initTimer");
    jest.spyOn(room, "initBoard");
    jest.spyOn(room, "initPlayerPosition");
    let players = new Map();
    players["id"] = { isReady: true };
    jest.spyOn(room.players, "values").mockReturnValue(players.values());
    RoomManager.startGame(existRoomId);
    jest.spyOn(room.board, "break");
    RoomManager.breakTile(existRoomId, 1, 1);
    expect(room.board.check(1, 1)).toBe(false);
    done();
  });

  it("update config", (done) => {
    let config = {
      roomSize: 10,
      boardSize: 10,
      roundTime: 10,
      breakTime: 10,
      breakerName: "HostName",
    };
    let res = RoomManager.updateConfig(existRoomId, config);
    let room = RoomManager.getRoom(existRoomId);
    expect(res).toBe(true);
    expect(room.config).toStrictEqual(config);
    done();
  });
});
