export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, start, direction = "horizontal") {
    const [x, y] = start;
    const coords = [];

    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        coords.push([x, y + i]);
      } else if (direction === "vertical") {
        coords.push([x + i, y]);
      }
    }
    this.ships.push({ ship, coords, hits: [] });
  }

  // receiveAttack(coord) {
  //   for (let placed of this.ships) {
  //     if (placed.coord[0] === coord[0] && placed.coord[1] === coord[1]) {
  //       placed.ship.hit();
  //       placed.hits.push(coord);
  //       return "hit";
  //     }
  //   }

  //   this.missedAttacks.push(coord);
  //   return "missed";
  // }

  // allSunk() {
  //   return this.ships.every((placed) => placed.ship.isSunk());
  // }
}
