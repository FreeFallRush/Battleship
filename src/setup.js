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

  //DESKTOP DRAG & DROP
  let draggedShip = null;
  let dragOffset = 0;

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

    if (draggedShip.dataset.orientation === "horizontal") col -= dragOffset;
    else row -= dragOffset;

    try {
      human.board.placeShip(ship, [row, col], draggedShip.dataset.orientation);
      draggedShip.remove();
      createBoard(human.board.ships, "player-board", false);

      if (fleetContainer.children.length === 0) onComplete();
    } catch (err) {
      setStatus(err.message);
    }

    draggedShip = null;
  });

  // MOBILE TOUCH DRAG
  let touchShip = null;
  let offset = { x: 0, y: 0 };

  fleetContainer.addEventListener("touchstart", (e) => {
    const target = e.target.closest(".ship-piece");
    if (!target) return;

    touchShip = target;
    const touch = e.touches[0];
    const rect = touchShip.getBoundingClientRect();
    offset.x = touch.clientX - rect.left;
    offset.y = touch.clientY - rect.top;

    touchShip.style.position = "absolute";
    touchShip.style.zIndex = 1000;
    touchShip.style.left = `${rect.left}px`;
    touchShip.style.top = `${rect.top}px`;
  });

  fleetContainer.addEventListener("touchmove", (e) => {
    if (!touchShip) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchShip.style.left = `${touch.clientX - offset.x}px`;
    touchShip.style.top = `${touch.clientY - offset.y}px`;
  });

  fleetContainer.addEventListener("touchend", (e) => {
    if (!touchShip) return;

    const touch = e.changedTouches[0];
    const targetCell = document
      .elementFromPoint(touch.clientX, touch.clientY)
      ?.closest(".cell");

    if (!targetCell) {
      touchShip.style.position = "";
      touchShip.style.left = "";
      touchShip.style.top = "";
      touchShip = null;
      return;
    }

    let row = parseInt(targetCell.dataset.row, 10);
    let col = parseInt(targetCell.dataset.col, 10);
    const shipIndex = parseInt(touchShip.dataset.index, 10);
    const ship = fleet[shipIndex];

    if (touchShip.dataset.orientation === "horizontal") col -= 0;
    else row -= 0;

    try {
      human.board.placeShip(ship, [row, col], touchShip.dataset.orientation);
      touchShip.remove();
      createBoard(human.board.ships, "player-board", false);

      if (fleetContainer.children.length === 0) onComplete();
    } catch (err) {
      setStatus(err.message);
      touchShip.style.position = "";
      touchShip.style.left = "";
      touchShip.style.top = "";
    }

    touchShip = null;
  });
}
