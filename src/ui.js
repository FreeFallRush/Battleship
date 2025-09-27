export function setStatus(text) {
  document.getElementById("status").textContent = text;
}

export function updateProgress(human, computer) {
  const humanRemaining = shipsRemaining(human.board);
  const computerRemaining = shipsRemaining(computer.board);
  document.getElementById(
    "progress"
  ).textContent = `Your ships left: ${humanRemaining} | Computer ships left: ${computerRemaining}`;
}

export function shipsRemaining(board) {
  return board.ships.filter((s) => !s.ship.isSunk()).length;
}

export function showGameOver(message) {
  document.getElementById("gameover-message").textContent = message;
  document.getElementById("gameover-popup").classList.remove("hidden");
}

export function hideGameOver() {
  document.getElementById("gameover-popup").classList.add("hidden");
}
