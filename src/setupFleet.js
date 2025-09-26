export default function placeFleet(board, fleet, size = 10) {
  for (let ship of fleet) {
    let placed = false;

    while (!placed) {
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);

      try {
        board.placeShip(ship, [x, y], direction);
        placed = true;
      } catch (e) {
        continue;
      }
    }
  }
}
