import Ship from "./ship";

export default function createFleet() {
  return [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(2),
    new Ship(2),
    new Ship(1),
    new Ship(1),
  ];
}
