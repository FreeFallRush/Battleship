import createFleet from "./fleet.js";
import { createBoard, setStatus } from "./dom.js";

export default function setup(human, onComplete) {
  const fleet = createFleet();
  let orientation = "horizontal";

  createBoard(human.board.ships, "player-board", false);
  setStatus("Drag your ships onto the board. Press R to rotate.");

  const fleetContainer = document.getElementById("fleet-container");
  fleetContainer.innerHTML = "";
  fleet.forEach((ship, index) => {
    const piece = document.createElement("div");
    piece.classList.add("ship-piece");
    piece.dataset.length = ship.length;
    piece.dataset.index = index;
    piece.dataset.orientation = "horizontal";

    for (let i = 0; i < ship.length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("ship-cell");
      piece.appendChild(cell);
    }

    piece.draggable = true;
    fleetContainer.appendChild(piece);
  });

  let draggedShip = null;

  fleetContainer.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("ship-piece")) {
      draggedShip = e.target;
      draggedShip.classList.add("dragging");
    }
  });

  fleetContainer.addEventListener("dragend", () => {
    if (draggedShip) {
      draggedShip.classList.remove("dragging");
      draggedShip = null;
    }
  });

  const playerBoard = document.getElementById("player-board");
  playerBoard.addEventListener("dragover", (e) => e.preventDefault());

  playerBoard.addEventListener("drop", (e) => {
    if (!draggedShip) return;
    const cell = e.target.closest(".cell");
    if (!cell) return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const shipIndex = parseInt(draggedShip.dataset.index, 10);
    const ship = fleet[shipIndex];

    try {
      human.board.placeShip(ship, [row, col], orientation);
      draggedShip.remove();
      createBoard(human.board.ships, "player-board", false);

      if (fleetContainer.children.length === 0) {
        setStatus("All ships placed! Battle begins!");
        onComplete();
      }
    } catch (err) {
      setStatus(err.message);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
      orientation = orientation === "horizontal" ? "vertical" : "horizontal";
      setStatus(`Orientation: ${orientation}. Drag your ships.`);
    }
  });
}
