import { Direction } from "../util/direction.js";

export class Player {
  /**
   * @param {string} id - socket id
   * @param {string} name - player's name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.isBreaker = false;
    this.x = 0;
    this.y = 0;
    this.direction = Direction.down;
    this.isAlive = true;
  }

  /**
   * @return {{name:string, id:string, isBreaker:boolean, x:number, y:number, direction:string, isAlive:boolean}} a dto of player
   */
  toDto() {
    return {
      id: this.id,
      name: this.name,
      isBreaker: this.isBreaker,
      x: this.x,
      y: this.y,
      direction: this.direction,
      isAlive: this.isAlive,
    };
  }
}
