import Ship from "./ship";
import Player from "./player";

const player1 = new Player("Sally");
const player2 = new Player("Robot");

const ship1 = new Ship(2);
const ship2 = new Ship(3);

player1.board.placeShip(ship1, [0, 0]);
player2.board.placeShip(ship2, [1, 1]);

console.log("Game start!");
console.log("Player 1 attacks [1,1]:", player1.attack(player2, [1, 1]));
console.log("Player 2 attacks [0,0]:", player2.attack(player1, [0, 0]));

console.log("Are all Player 1 ships sunk?", player1.board.allSunk());
console.log("Are all Player 2 ships sunk?", player2.board.allSunk());
