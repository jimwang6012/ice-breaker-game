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
    this.config = {
      roomSize: 8,
      boardSize: 9,
      roundTime: 60,
      breakTime: 1,
    };
    this.timer = null;
    this.currentGameTime = null; //seconds
  }

  /**
   * @param {Player} player - new player
   */
  addPlayer(player) {
    this.players.set(player.id, player);
  }

  initBoard(size) {
    this.board = new Board(size);
  }

  initPlayerPosition() {
    let i = 0;
    this.players.forEach((player, id) => {
      player.isAlive = true;
      if (player.isBreaker) {
        const center = Math.floor((this.config.boardSize - 1) / 2);
        player.x = center;
        player.y = center;
      } else {
        player.x = 0;
        player.y = i;
        i++;
      }
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
    this.currentGameTime = this.config?.roundTime; //seconds, and currently we allow the user to move within 20 seconds
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
   * Check if a certain player is alive
   * @param {String} playerId
   */
  checkPlayerAlive(playerId) {
    const player = this.getPlayer(playerId);
    if (
      player.isAlive &&
      !player.isBreaker &&
      !this.board.check(player.x, player.y)
    ) {
      player.isAlive = false;
      return false;
    } else {
      return true;
    }
  }

  toDto() {
    let players = [];
    this.players.forEach((player, playerId) => {
      players.push({
        ...player.toDto(),
      });
    });

    if (this.isOpen) {
      return {
        roomId: this.roomId,
        hostId: this.hostId,
        board: this.board?.toDto(),
        players: players,
        config: this.config,
      };
    } else {
      return {
        roomId: this.roomId,
        hostId: this.hostId,
        board: this.board?.toDto(),
        players: players,
      };
    }
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
