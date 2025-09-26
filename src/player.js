import Gameboard from "./gameboard";
import createFleet from "./fleet";
import placeFleet from "./setupFleet";

export default class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.board = new Gameboard();
    this.attacks = [];

    if (isComputer) {
      const fleet = createFleet();
      placeFleet(this.board, fleet);
    }
  }

  setBoard(board) {
    this.board = board;
  }

  attack(opponentBoard, coord) {
    if (this.attacks.some(([x, y]) => x === coord[0] && y === coord[1])) {
      throw new Error("Coordinate already attacked");
    }
    this.attacks.push(coord);
    return opponentBoard.receiveAttack(coord);
  }

  randomAttack(opponentBoard, size = 10) {
    if (!this.isComputer) return;
    let coord;
    do {
      coord = [
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size),
      ];
    } while (this.attacks.some(([x, y]) => x === coord[0] && y === coord[1]));
    return this.attack(opponentBoard, coord);
  }
}
