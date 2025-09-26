import Player from "./player.js";
import createFleet from "./fleet.js";
import placeFleet from "./setupFleet.js";
import { createBoard, updateCell, setStatus } from "./dom.js";

const human = new Player("Human");
const computer = new Player("Computer", true);

const humanFleet = createFleet();
placeFleet(human.board, humanFleet);

function renderBoards() {
  createBoard(human.board.ships, "player-board", false);
  createBoard(computer.board.ships, "computer-board", true, handlePlayerClick);
}

function handlePlayerClick(coord, cell) {
  const result = human.attack(computer.board, coord);
  updateCell(cell, result);

  if (computer.board.allSunk()) {
    setStatus("You win!");
    return;
  }

  const computerResult = computer.randomAttack(human.board);

  const [row, col] = computer.attacks.at(-1);
  const playerCells = document.getElementById("player-board").children;
  const index = row * 10 + col;
  updateCell(playerCells[index], computerResult);

  if (human.board.allSunk()) {
    setStatus("Computer wins!");
    return;
  }
}

renderBoards();
setStatus("Game start! Click on computer board to attack!");
