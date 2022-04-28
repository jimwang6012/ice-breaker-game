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
    this.timer = null;
    this.currentGameTime = null; //seconds
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
      player.isAlive = true;
      player.x = 0;
      player.y = i;
      i++;
    });
  }

  /**
   * @param {() => void} onFinished call when the timer decrements
   * @param {(time:Number) => void} onTimerProceeded call when the timer finished
   */
  initTimer(onFinished, onTimerProceeded) {
    if (this.timer) {
      // ensure the previous timer is cleared before creating a new one
      clearInterval(this.timer);
    }
    this.currentGameTime = 20; //seconds, and currently we allow the user to move within 20 seconds
    const countDown = () => {
      onTimerProceeded(this.currentGameTime);
      this.currentGameTime--;
      if (this.currentGameTime < 0) {
        clearInterval(this.timer);
        onFinished();
      }
    };
    this.timer = setInterval(countDown, 1000);
  }

  closeGame() {
    this.isOpen = true;
    if (this.timer) {
      // ensure the previous timer is cleared before creating a new one
      clearInterval(this.timer);
    }
    if (this.board) {
      this.board = null;
    }
  }

  clearTimer() {
    clearInterval(this.timer);
  }

  checkIsAllPlayerDead() {
    const playersList = Array.from(this.players.values());
    let deadCount = playersList.filter((p) => !p.isAlive).length;
    if (deadCount == playersList.length - 1) {
      this.currentGameTime = 0;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
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
