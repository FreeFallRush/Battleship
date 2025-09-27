import createFleet from "./fleet.js";
import { createBoard, setStatus } from "./dom.js";

export default function setup(human, onComplete) {
  const fleet = createFleet();

  let orientation = "horizontal";

  createBoard(human.board.ships, "player-board", false);
  setStatus(
    "Drag your ships onto the board. Use Rotate button or 'R' key to rotate."
  );

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

  let rotateBtn = document.getElementById("rotate-btn");
  if (!rotateBtn) {
    rotateBtn = document.createElement("button");
    rotateBtn.id = "rotate-btn";
    rotateBtn.textContent = "Rotate Ships";
    document.getElementById("game").appendChild(rotateBtn);
  }

  let draggedShip = null;
  let dragOffset = 0;

  fleetContainer.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("ship-piece")) {
      draggedShip = e.target;
      draggedShip.classList.add("dragging");

      const shipCells = Array.from(draggedShip.children);
      const rect = shipCells[0].getBoundingClientRect();
      if (draggedShip.dataset.orientation === "horizontal") {
        dragOffset = Math.floor((e.clientX - rect.left) / rect.width);
      } else {
        dragOffset = Math.floor((e.clientY - rect.top) / rect.height);
      }
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

    let row = parseInt(cell.dataset.row, 10);
    let col = parseInt(cell.dataset.col, 10);
    const shipIndex = parseInt(draggedShip.dataset.index, 10);
    const ship = fleet[shipIndex];

    if (draggedShip.dataset.orientation === "horizontal") {
      col -= dragOffset;
    } else {
      row -= dragOffset;
    }

    try {
      human.board.placeShip(ship, [row, col], draggedShip.dataset.orientation);
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

  function toggleOrientation() {
    orientation = orientation === "horizontal" ? "vertical" : "horizontal";

    document.querySelectorAll(".ship-piece").forEach((shipDiv) => {
      if (orientation === "vertical") {
        shipDiv.classList.add("vertical");
        shipDiv.dataset.orientation = "vertical";
      } else {
        shipDiv.classList.remove("vertical");
        shipDiv.dataset.orientation = "horizontal";
      }
    });

    setStatus(`Orientation: ${orientation}. Drag your ships.`);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
      toggleOrientation();
    }
  });

  rotateBtn.addEventListener("click", toggleOrientation);
}
