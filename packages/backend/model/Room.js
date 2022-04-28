import { Player } from "./Player.js";
import { Board } from "./Board.js";

export class Room {
  /**
   * @param {string} roomId - generated room id
   * @param {Player} host - host player
   */
  constructor(roomId, host) {
    this.roomId = roomId;
    this.hostId = host.id;
    this.board = null;
    this.isOpen = true;
    this.players = new Map();
    this.players.set(host.id, host);
  }

  /**
   * @param {Player} player - new player
   */
  addPlayer(player) {
    this.players.set(player.id, player);
  }

  initBoard() {
    this.board = new Board();
  }

  initPlayerPosition() {
    let i = 0;
    this.players.forEach((player, id) => {
      player.x = 0;
      player.y = i;
      i++;
    });
  }

  checkPlayersAlive(x, y) {
    this.players.forEach((player, playerId) => {
      if (player.isAlive && player.x == x && player.y == y) {
        player.isAlive = false;
      }
    });
  }

  toDto() {
    let players = [];
    this.players.forEach((player, playerId) => {
      players.push({
        ...player.toDto(),
      });
    });

    return {
      roomId: this.roomId,
      board: this.board?.toDto(),
      players: players,
    };
  }

  /**
   * @param {string} id - user's socket id
   */
  removePlayer(id) {
    this.players.delete(id);
  }

  /**
   * @param {string} id - user's socket id
   */
  getPlayer(id) {
    return this.players.get(id);
  }
}
