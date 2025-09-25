import Gameboard from "./gameboard.js";

export default class Player {
  constructor(name = "Player") {
    this.name = name;
    this.board = new Gameboard();
  }

  attack(enemy, coord) {
    return enemy.board.receiveAttack(coord);
  }
}
