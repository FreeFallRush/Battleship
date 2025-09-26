import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

describe("Gameboard", () => {
  test("places ship horozontally", () => {
    const board = new Gameboard();
    const ship = new Ship(3);
    board.placeShip(ship, [0, 0], "horizontal");

    expect(board.ships[0].coords).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("places ship vertically", () => {
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [1, 1], "vertical");

    expect(board.ships[0].coords).toEqual([
      [1, 1],
      [2, 1],
    ]);
  });

  test("throws error if ship goes out of coordinates", () => {
    const board = new Gameboard();
    const ship = new Ship(4);

    expect(() => board.placeShip(ship, [0, 8], "horizontal")).toThrow(
      "Ship placement is outside the coordinates"
    );
  });

  test("throws error if ships overlap", () => {
    const board = new Gameboard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    board.placeShip(ship1, [0, 0], "horizontal");

    expect(() => board.placeShip(ship2, [0, 1], "vertical")).toThrow(
      "Ship placement overlaps another ship"
    );
  });

  test("registers a hit on the correct ship", () => {
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [0, 0], "horizontal");

    const result = board.receiveAttack([0, 1]);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("records a missed attack", () => {
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [0, 0], "horizontal");

    const result = board.receiveAttack([5, 5]);
    expect(result).toBe("missed");
    expect(board.missedAttacks).toEqual([[5, 5]]);
  });

  test("reports all ships sunk", () => {
    const board = new Gameboard();
    const ship = new Ship(1);
    board.placeShip(ship, [0, 0]);

    board.receiveAttack([0, 0]);
    expect(board.allSunk()).toBe(true);
  });
});
