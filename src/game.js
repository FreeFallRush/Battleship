import Player from "./player.js";
import setup from "./setup.js";
import { createBoard, updateCell, setStatus } from "./dom.js";

let human;
let computer;

function initGame() {
  human = new Player("Human");
  computer = new Player("Computer", true);

  setup(human, startGame);
}

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
restartBtn.addEventListener("click", () => {
  restartGame();
});

function restartGame() {
  setStatus("Game reset. Place your ships again!");
  document.getElementById("player-board").innerHTML = "";
  document.getElementById("computer-board").innerHTML = "";
  document.getElementById("fleet-container").innerHTML = "";
  initGame();
}

initGame();
