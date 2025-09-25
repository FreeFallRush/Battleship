import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

describe("Gameboard", () => {
  test("places ship at a given coordinate", () => {
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [0, 0]);
    expect(board.ships.length).toBe(1);
  });

  test("register a hit on the ship", () => {
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [0, 0]);

    const result = board.receiveAttack([0, 0]);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("records a missed attack", () => {
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [0, 0]);

    const result = board.receiveAttack([1, 1]);
    expect(result).toBe("missed");
    expect(board.missedAttacks).toEqual([[1, 1]]);
  });

  test("reports all ships sunk", () => {
    const board = new Gameboard();
    const ship = new Ship(1);
    board.placeShip(ship, [0, 0]);

    board.receiveAttack([0, 0]);
    expect(board.allSunk()).toBe(true);
  });
});
