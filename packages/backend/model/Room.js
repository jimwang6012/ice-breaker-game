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

  playersToDto() {
    let players = [];
    this.players.forEach((player, playerId) => {
      players.push({
        ...player.toDto(),
      });
    });

    return {
      players: players,
    };
  }

  /**
   * @param {string} id - user's socket id
   */
  removePlayer(id) {
    this.players.delete(id);
  }
}
