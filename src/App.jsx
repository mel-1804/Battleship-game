import { useState } from "react";
import { GameBoard } from "./utils/gameBoards";
import { generateRandomBoard } from "./utils/generateBoard";
import { playerBoardInitial } from "./utils/initialBoards";
import { checkWinner } from "./utils/checkWinner";
import { handlePlayerAttack, handleComputerAttack } from "./utils/attackLogic";

export const App = () => {
  const [playerBoard, setPlayerBoard] = useState(playerBoardInitial);
  const [enemyBoard, setEnemyBoard] = useState(generateRandomBoard());
  const [gameStarted, setGameStarted] = useState(false);
  const [enemyVisibleBoard, setEnemyVisibleBoard] = useState(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(null))
  );
  const [winner, setWinner] = useState(null);
  const [attackedCells, setAttackedCells] = useState([]); // Keep track of cells attacked by computer

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setWinner(null);
    setPlayerBoard(playerBoardInitial);
    setEnemyBoard(generateRandomBoard());
    setEnemyVisibleBoard(
      Array(10)
        .fill(0)
        .map(() => Array(10).fill(null))
    );
    setAttackedCells([]); // Reset attacked cells at the start of the game
  };

  // Handling player's attack on the enemy board
  const playerAttackHandler = (row, col) => {
    handlePlayerAttack(
      row,
      col,
      enemyBoard,
      enemyVisibleBoard,
      setEnemyVisibleBoard,
      setWinner,
      checkWinner
    );

    // After player's attack, trigger the computer's attack
    handleComputerAttack(
      playerBoard,
      setPlayerBoard,
      attackedCells,
      setAttackedCells,
      checkWinner,
      setWinner
    );
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-10 mt-10">Batalla Naval</h1>

      {!gameStarted ? (
        <button
          onClick={startGame}
          className="bg-blue-500 text-2xl text-white px-4 py-2 rounded-md"
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
            <h2 className="text-xl font-bold mb-2">Tablero Enemigo (tu PC)</h2>
            <GameBoard
              board={enemyVisibleBoard}
              isEnemy={true}
              onCellClick={playerAttackHandler} // Use the player attack handler
            />
          </div>
        </div>
      )}

      {winner && (
        <div className="mt-5">
          <h2 className="text-3xl font-bold text-red-500">
            {winner === "player"
              ? "¡FELICIDADES, GANASTE!"
              : "LO SIENTO... GANÓ TU COMPUTADOR!"}
          </h2>
          <button
            onClick={startGame}
            className="bg-green-500 text-2xl text-white px-4 py-2 rounded-md mt-3"
          >
            JUGAR NUEVAMENTE
          </button>
        </div>
      )}
    </div>
  );
};
