import Player from "../src/player";
import Ship from "../src/ship";

describe("Player", () => {
  test("player attacks opponent's board", () => {
    const player1 = new Player("Sam");
    const player2 = new Player("Jill");
    const ship = new Ship(1);
    player2.board.placeShip(ship, [0, 0]);

    const result = player1.attack(player2, [0, 0]);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("records a miss when attack misses", () => {
    const player1 = new Player("Sam");
    const player2 = new Player("Jill");
    const ship = new Ship(1);
    player2.board.placeShip(ship, [1, 1]);

    const result = player1.attack(player2, [0, 0]);
    expect(result).toBe("missed");
    expect(player2.board.missedAttacks).toEqual([[0, 0]]);
  });
});
