import Player from "../src/player";
import Ship from "../src/ship";
import Gameboard from "../src/gameboard";

describe("Player", () => {
  test("player attacks opponent's board and hits a ship", () => {
    const player = new Player("Human");
    const opponent = new Player("Computer");
    const opponentBoard = new Gameboard();
    const ship = new Ship(1);
    opponentBoard.placeShip(ship, [0, 0]);
    opponent.setBoard(opponentBoard);

    const result = player.attack(opponent.board, [0, 0]);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("player attacks opponent's board and misses", () => {
    const player = new Player("Human");
    const opponent = new Player("Computer");
    const opponentBoard = new Gameboard();
    const ship = new Ship(1);
    opponentBoard.placeShip(ship, [1, 1]);
    opponent.setBoard(opponentBoard);

    const result = player.attack(opponent.board, [0, 0]);
    expect(result).toBe("missed");
    expect(opponent.board.missedAttacks).toEqual([[0, 0]]);
  });

  test("computer initializes with full fleet", () => {
    const computer = new Player("Computer", true);
    expect(computer.board.ships.length).toBe(7);
  });

  test("computer makes a random attack", () => {
    const computer = new Player("Computer", true);
    const board = new Gameboard();
    computer.randomAttack(board);
    expect(computer.attacks.length).toBe(1);
  });

  test("prevents attacking the same coordinate twice", () => {
    const player = new Player("Human");
    const opponentBoard = new Gameboard();
    player.setBoard(opponentBoard);

    player.attack(opponentBoard, [0, 0]);
    expect(() => player.attack(opponentBoard, [0, 0])).toThrow(
      "Coordinate already attacked"
    );
  });

  test("computer targets adjacent cells after a hit", () => {
    const computer = new Player("Computer", true);
    const board = new Gameboard();
    const ship = new Ship(2);
    board.placeShip(ship, [0, 0], "horizontal");

    computer.attack(board, [0, 0]);
    expect(ship.hits).toBe(1);

    const result = computer.smartAttack(board);
    expect(result === "hit" || result === "missed").toBe(true);

    const lastAttack = computer.attacks.at(-1);
    expect(
      [
        [0, 1],
        [1, 0],
      ].some(([r, c]) => r === lastAttack[0] && c === lastAttack[1])
    ).toBe(true);
  });
});
