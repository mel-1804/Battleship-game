import { useState } from "react";
import GameBoard from "../src/components/GameBoard";

// Function to generate a board with random ships
const generateRandomBoard = () => {
  let board = Array(10)
    .fill(0)
    .map(() => Array(10).fill(0));

  let ships = [5, 4, 3, 3, 2]; // Ships size

  ships.forEach((size) => {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * 10);
      let col = Math.floor(Math.random() * 10);
      let horizontal = Math.random() < 0.5;

      if (horizontal) {
        if (col + size > 10) continue;
        if (board[row].slice(col, col + size).some((cell) => cell === 1))
          continue;
        for (let i = 0; i < size; i++) board[row][col + i] = 1;
      } else {
        if (row + size > 10) continue;
        if (board.slice(row, row + size).some((r) => r[col] === 1)) continue;
        for (let i = 0; i < size; i++) board[row + i][col] = 1;
      }
      placed = true;
    }
  });

  return board;
};

function App() {
  const playerBoardInitial = [
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  ];

  const [playerBoard, setPlayerBoard] = useState(playerBoardInitial);
  const enemyBoard = generateRandomBoard(); // Generate random ships for the enemy
  const [gameStarted, setGameStarted] = useState(false);
  const [enemyVisibleBoard, setEnemyVisibleBoard] = useState(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(null))
  );

  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };

  // Handle user's attack
  const handlePlayerAttack = (row, col) => {
    if (!gameStarted || enemyVisibleBoard[row][col] !== null) return; // Avoid repeating attacks

    const newVisibleBoard = enemyVisibleBoard.map((row) => row.slice());
    newVisibleBoard[row][col] = enemyBoard[row][col] === 1 ? 2 : 3; // 2 = impact, 3 = fail
    setEnemyVisibleBoard(newVisibleBoard);

    setTimeout(handleComputerAttack, 1000);
  };

  // computer's turn
  const handleComputerAttack = () => {
    let row, col;
    let newPlayerBoard = playerBoard.map((row) => row.slice());

    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (newPlayerBoard[row][col] === 2 || newPlayerBoard[row][col] === 3);

    newPlayerBoard[row][col] = newPlayerBoard[row][col] === 1 ? 2 : 3;
    setPlayerBoard(newPlayerBoard);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5">Batalla Naval</h1>

        {!gameStarted ? (
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Comenzar el juego
          </button>
        ) : (
          <div className="flex justify-center gap-10 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Tu Tablero</h2>
              <GameBoard board={playerBoard} isEnemy={false} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Tablero Enemigo</h2>
              <GameBoard
                board={enemyVisibleBoard}
                isEnemy={true}
                onCellClick={handlePlayerAttack}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
