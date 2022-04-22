export class Board {
  constructor() {
    this.board = [
      [0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ];
  }

  break(x, y) {
    this.board[x][y] = 0;
  }

  check(x, y) {
    if (this.board[x][y] === 1) {
      return true;
    } else {
      return false;
    }
  }

  toDto() {
    return this.board;
  }
}
