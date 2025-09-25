export default class Gameboard {
  constructor(size = 4) {
    this.size = size;
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, coord) {
    this.ships.push({ ship, coord, hits: [] });
  }

  receiveAttack(coord) {
    for (let placed of this.ships) {
      if (placed.coord[0] === coord[0] && placed.coord[1] === coord[1]) {
        placed.ship.hit();
        placed.hits.push(coord);
        return "hit";
      }
    }

    this.missedAttacks.push(coord);
    return "missed";
  }

  allSunk() {
    return this.ships.every((placed) => placed.ship.isSunk());
  }
}
