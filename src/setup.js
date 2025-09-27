import createFleet from "./fleet.js";
import { createBoard, setStatus } from "./dom.js";

export default function setup(human, onComplete) {
  const fleet = createFleet();
  const mobile = window.innerWidth <= 768;
  let orientation = "horizontal";

  const fleetContainer = document.getElementById("fleet-container");
  fleetContainer.innerHTML = "";

  const rotateBtn =
    document.getElementById("rotate-btn") ||
    (() => {
      const btn = document.createElement("button");
      btn.id = "rotate-btn";
      btn.textContent = "Rotate Ships";
      document.getElementById("game").appendChild(btn);
      return btn;
    })();

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
    if (e.key.toLowerCase() === "r") toggleOrientation();
  });
  rotateBtn.addEventListener("click", toggleOrientation);

  //MOBILE random placement
  if (mobile) {
    fleetContainer.style.display = "none";
    rotateBtn.style.display = "none";
    const fleetHeader = fleetContainer.previousElementSibling;
    if (fleetHeader) fleetHeader.style.display = "none";

    const boardsContainer = document.getElementById("boards");
    const playerBoardContainer = document.getElementById(
      "player-board-container"
    );
    const computerBoardContainer = document.getElementById(
      "computer-board-container"
    );
    boardsContainer.insertBefore(computerBoardContainer, playerBoardContainer);

    fleet.forEach((ship) => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const dir = Math.random() < 0.5 ? "horizontal" : "vertical";
        try {
          human.board.placeShip(ship, [row, col], dir);
          placed = true;
        } catch (err) {
          console.warn(
            `Failed to place ship of length ${ship.length} at [${row},${col}] dir: ${dir}`
          );
        }
      }
    });

    createBoard(human.board.ships, "player-board", false);
    onComplete();
    return;
  }
  //DESKTOP drag & drop
  setStatus(
    "Drag your ships onto the board. Use Rotate button or 'R' key to rotate."
  );

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
  let dragOffset = 0;

  const playerBoard = document.getElementById("player-board");

  fleetContainer.addEventListener("dragstart", (e) => {
    if (!e.target.classList.contains("ship-piece")) return;
    draggedShip = e.target;
    draggedShip.classList.add("dragging");

    const firstCell = draggedShip.children[0].getBoundingClientRect();
    dragOffset =
      draggedShip.dataset.orientation === "horizontal"
        ? Math.floor((e.clientX - firstCell.left) / firstCell.width)
        : Math.floor((e.clientY - firstCell.top) / firstCell.height);
  });

  fleetContainer.addEventListener("dragend", () => {
    if (draggedShip) draggedShip.classList.remove("dragging");
    draggedShip = null;
  });

  playerBoard.addEventListener("dragover", (e) => e.preventDefault());

  playerBoard.addEventListener("drop", (e) => {
    if (!draggedShip) return;
    const cell = e.target.closest(".cell");
    if (!cell) return;

    let row = parseInt(cell.dataset.row, 10);
    let col = parseInt(cell.dataset.col, 10);
    const shipIndex = parseInt(draggedShip.dataset.index, 10);
    const ship = fleet[shipIndex];
    const length = ship.length;
    const dir = draggedShip.dataset.orientation;

    if (
      (dir === "horizontal" && col - dragOffset < 0) ||
      (dir === "vertical" && row - dragOffset < 0) ||
      (dir === "horizontal" && col - dragOffset + length > 10) ||
      (dir === "vertical" && row - dragOffset + length > 10)
    ) {
      setStatus("Ship cannot be placed outside the board!");
      return;
    }

    if (dir === "horizontal") col -= dragOffset;
    else row -= dragOffset;

    try {
      human.board.placeShip(ship, [row, col], dir);
      draggedShip.remove();
      createBoard(human.board.ships, "player-board", false);

      if (fleetContainer.children.length === 0) {
        onComplete();
        rotateBtn.style.display = "none";
      }
    } catch (err) {
      setStatus(err.message);
    }

    draggedShip = null;
  });

  createBoard(human.board.ships, "player-board", false);
}
