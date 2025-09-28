import Gameboard from "./gameboard.js";
import createFleet from "./fleet.js";
import placeFleet from "./setupFleet.js";

export default class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.board = new Gameboard();
    this.attacks = [];

    this.lastHit = null;
    this.targetQueue = [];

    if (isComputer) {
      const fleet = createFleet();
      placeFleet(this.board, fleet);
    }
  }

  setBoard(board) {
    this.board = board;
  }

  attack(opponentBoard, coord) {
    if (!(opponentBoard && typeof opponentBoard.receiveAttack === "function")) {
      throw new Error("Invalid board passed to attack");
    }

    if (this.attacks.some(([x, y]) => x === coord[0] && y === coord[1])) {
      throw new Error("Coordinate already attacked");
    }

    this.attacks.push(coord);
    const result = opponentBoard.receiveAttack(coord);

    if (this.isComputer && result === "hit") {
      this.lastHit = coord;
      this.enqueueNeighbors(coord, opponentBoard.size);
    }

    return result;
  }

  enqueueNeighbors([row, col], size) {
    const candidates = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    for (let [r, c] of candidates) {
      if (
        r >= 0 &&
        r < size &&
        c >= 0 &&
        c < size &&
        !this.attacks.some(([x, y]) => x === r && y === c) &&
        !this.targetQueue.some(([x, y]) => x === r && y === c)
      ) {
        this.targetQueue.push([r, c]);
      }
    }
  }

  smartAttack(opponentBoard, size = 10) {
    if (!this.isComputer) return;

    let coord;

    while (this.targetQueue.length > 0) {
      coord = this.targetQueue.shift();
      if (!this.attacks.some(([x, y]) => x === coord[0] && y === coord[1])) {
        return this.attack(opponentBoard, coord);
      }
    }

    do {
      coord = [
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size),
      ];
    } while (this.attacks.some(([x, y]) => x === coord[0] && y === coord[1]));

    return this.attack(opponentBoard, coord);
  }

  randomAttack(opponentBoard, size = 10) {
    return this.smartAttack(opponentBoard, size);
  }
}
