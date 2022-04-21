export class Board {
  constructor() {
    this.board = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ];
  }

  break(x, y) {
    this.board[y][x] = 0;
  }

  check(x, y) {
    if (this.board[y][x] === 1) {
      return true;
    } else {
      return false;
    }
  }

  toDto() {
    return this.board;
  }
}
