import { hideGameOver } from "./ui.js";

export function initEventListeners(restartGame) {
  const instructionsBtn = document.getElementById("instructions-btn");
  const instructionsPopup = document.getElementById("instructions-popup");
  const closeInstructions = document.getElementById("close-instructions");

  instructionsBtn.addEventListener("click", () => {
    instructionsPopup.classList.remove("hidden");
  });
  closeInstructions.addEventListener("click", () => {
    instructionsPopup.classList.add("hidden");
  });

  document.getElementById("restart-btn").addEventListener("click", restartGame);

  document.getElementById("play-again-btn").addEventListener("click", () => {
    restartGame();
    hideGameOver();
  });

  document
    .getElementById("close-gameover")
    .addEventListener("click", hideGameOver);
}
