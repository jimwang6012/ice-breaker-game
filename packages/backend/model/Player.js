import { Direction } from "../util/direction.js";

export class Player {
  /**
   * @param {string} id - socket id
   * @param {string} name - player's name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.colorId = null;
    this.isBreaker = false;
    this.isReady = false;
    this.x = 0;
    this.y = 0;
    this.direction = Direction.down;
    this.isAlive = true;
    this.score = 0;
  }

  /**
   * @return {{id:string, name:string, colorId:number, isBreaker:boolean, isReady:boolean, x:number, y:number, direction:string, isAlive:boolean, score: number}} a dto of player
   */
  toDto() {
    return {
      id: this.id,
      name: this.name,
      colorId: this.colorId,
      isBreaker: this.isBreaker,
      isReady: this.isReady,
      x: this.x,
      y: this.y,
      direction: this.direction,
      isAlive: this.isAlive,
      score: this.score,
    };
  }
}
