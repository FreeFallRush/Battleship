import Ship from "./ship.js";
import Player from "./player.js";
import "./game.js";

const player1 = new Player("Sally");
const player2 = new Player("Robot");

const ship1 = new Ship(2);
const ship2 = new Ship(3);

player1.board.placeShip(ship1, [0, 0]);
player2.board.placeShip(ship2, [1, 1]);
