import Player from "./player.js";
import setup from "./setup.js";
import { createBoard, updateCell } from "./dom.js";
import { setStatus, updateProgress, showGameOver } from "./ui.js";
import { initEventListeners } from "./events.js";

let human,
  computer,
  gameActive = true;

function initGame() {
  human = new Player("Human");
  computer = new Player("Computer", true);
  gameActive = true;
  setup(human, startGame);
}

function renderBoards() {
  createBoard(human.board.ships, "player-board", false);
  createBoard(computer.board.ships, "computer-board", true, handlePlayerClick);
}

function startGame() {
  renderBoards();
  setStatus("Game start! Click on computer board to attack!");
  updateProgress(human, computer);
}

function handlePlayerClick(coord, cell) {
  if (!gameActive) return;

  const result = human.attack(computer.board, coord);
  updateCell(cell, result);
  updateProgress(human, computer);

  if (computer.board.allSunk()) return endGame("You win!");

  const computerResult = computer.randomAttack(human.board);
  const [row, col] = computer.attacks.at(-1);

  const playerCells = document.getElementById("player-board").children;
  const index = row * 10 + col;
  updateCell(playerCells[index], computerResult);
  updateProgress(human, computer);

  if (human.board.allSunk()) endGame("Computer wins!");
}

function endGame(message) {
  gameActive = false;
  showGameOver(message);
}

function restartGame() {
  setStatus("Game reset. Place your ships again!");
  document.getElementById("player-board").innerHTML = "";
  document.getElementById("computer-board").innerHTML = "";
  document.getElementById("fleet-container").innerHTML = "";
  document.getElementById("progress").textContent = "";
  initGame();
}

initGame();
initEventListeners(restartGame);
