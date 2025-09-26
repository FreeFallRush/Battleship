export function createBoard(
  boardData,
  containerId,
  clickable = false,
  onClick
) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (!clickable) {
        if (
          boardData.some((shipObj) =>
            shipObj.coords.some(([x, y]) => x === row && y == col)
          )
        ) {
          cell.classList.add("ship");
        }
      }
      container.appendChild(cell);

      if (clickable && onClick) {
        cell.addEventListener("click", () => onClick([row, col], cell));
      }
    }
  }
}

export function updateCell(cell, result) {
  if (result === "hit") {
    cell.classList.add("hit");
  } else if (result === "missed") {
    cell.classList.add("missed");
  }
}

export function setStatus(text) {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = text;
}
