import Player from "./player.js";
import setup from "./setup.js";
import { createBoard, updateCell, setStatus } from "./dom.js";

const human = new Player("Human");
const computer = new Player("Computer", true);

function renderBoards() {
  createBoard(human.board.ships, "player-board", false);
  createBoard(computer.board.ships, "computer-board", true, handlePlayerClick);
}

function startGame() {
  renderBoards();
  setStatus("Game start! Click on computer board to attack!");
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
  }
}

setup(human, startGame);
