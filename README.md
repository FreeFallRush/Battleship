# Battleship Game

**Live Demo:** [Play Battleship](https://freefallrush.github.io/Battleship/)

## Introduction

This project is a **JavaScript implementation of the classic Battleship game**, built with **Test Driven Development (TDD)** principles using Jest.  
The game pits a human player against a computer player, and includes features like ship placement, turn-based attacks, and a simple random ships placement for the computer opponent.

The goal is to practice **modular JavaScript design**, TDD, and DOM manipulation while building a fully playable game.

---

## Features

- Player vs Computer gameplay
- **Drag & drop** ship placement on desktop
- **Random ship placement** for mobile devices
- Turn-based attacks with status updates
- Gameover popup when all ships of a player are sunk
- Responsive design for mobile and desktop

---

### Desktop

- Drag and drop your ships onto the **Player Board**
- Press **"R"** to rotate ships horizontally or vertically
- Click on the **Computer Board** to attack

### Mobile

- Ships are placed **randomly** for both players
- Tap on the computer board to attack

### Rules

- Each player has **7 ships**:
  - 1 Carrier (5 cells)
  - 1 Battleship (4 cells)
  - 1 Cruiser (3 cells)
  - 2 Destroyers (2 cells)
  - 2 Submarines (1 cell)
- **Hit** = red, **Miss** = white
- First player to sink all enemy ships wins

---

## Testing

- **Jest** is used for unit tests of `Ship`, `Gameboard`, and `Player` classes
- Tests cover:
  - Ship hits and sunk status
  - Attack results (hit/miss)
  - Preventing repeated attacks
  - Full fleet initialization for computer player

> **Note:** DOM manipulation is not tested since it’s handled in separate modules (`dom.js`, `ui.js`).

## Getting Started

1. Clone the repository

2. Install dependencies:
   npm install

3. Run tests:
   npm test

4. Open index.html in your browser to play.
