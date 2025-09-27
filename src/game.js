import Player from "./player.js";
import setup from "./setup.js";
import { createBoard, updateCell, setStatus } from "./dom.js";

let human;
let computer;
let gameActive = true;

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
  updateProgress();
}

function handlePlayerClick(coord, cell) {
  if (!gameActive) return;

  const result = human.attack(computer.board, coord);
  updateCell(cell, result);
  updateProgress();

  if (computer.board.allSunk()) {
    endGame("You win!");
    return;
  }

  const computerResult = computer.randomAttack(human.board);
  const [row, col] = computer.attacks.at(-1);

  const playerCells = document.getElementById("player-board").children;
  const index = row * 10 + col;
  updateCell(playerCells[index], computerResult);
  updateProgress();

  if (human.board.allSunk()) {
    endGame("Computer wins!");
  }
}

function shipsRemaining(board) {
  return board.ships.filter((s) => !s.ship.isSunk()).length;
}

function updateProgress() {
  const humanRemaining = shipsRemaining(human.board);
  const computerRemaining = shipsRemaining(computer.board);
  document.getElementById(
    "progress"
  ).textContent = `Your ships left: ${humanRemaining} | Computer ships left: ${computerRemaining}`;
}

function endGame(message) {
  gameActive = false;
  document.getElementById("gameover-message").textContent = message;
  document.getElementById("gameover-popup").classList.remove("hidden");
}

const instructionsBtn = document.getElementById("instructions-btn");
const instructionsPopup = document.getElementById("instructions-popup");
const closeInstructions = document.getElementById("close-instructions");

instructionsBtn.addEventListener("click", () => {
  instructionsPopup.classList.remove("hidden");
});

closeInstructions.addEventListener("click", () => {
  instructionsPopup.classList.add("hidden");
});

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", () => restartGame());

const playAgainBtn = document.getElementById("play-again-btn");
const closeGameover = document.getElementById("close-gameover");

playAgainBtn.addEventListener("click", () => {
  restartGame();
  document.getElementById("gameover-popup").classList.add("hidden");
});

closeGameover.addEventListener("click", () => {
  document.getElementById("gameover-popup").classList.add("hidden");
});

function restartGame() {
  setStatus("Game reset. Place your ships again!");
  document.getElementById("player-board").innerHTML = "";
  document.getElementById("computer-board").innerHTML = "";
  document.getElementById("fleet-container").innerHTML = "";
  document.getElementById("progress").textContent = "";
  initGame();
}

initGame();
