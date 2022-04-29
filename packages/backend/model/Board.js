export class Board {
  constructor(size) {
    this.board = Array(size)
      .fill()
      .map(() => Array(size).fill(1));
    const breakerStart = Math.floor((size - 1) / 2);
    this.board[breakerStart][breakerStart] = 0;
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
