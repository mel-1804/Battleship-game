import { useState } from "react";
import { GameBoard } from "./components/GameBoards";
import { PlaceShips } from "./components/PlaceShips";
import { generateRandomBoard } from "./utils/generateBoard";
import { checkWinner } from "./utils/checkWinner";
import { handleComputerAttack } from "./utils/attackLogicComputer";
import { handlePlayerAttack } from "./utils/attackLogicPlayer";

export const App = () => {
  const [playerBoard, setPlayerBoard] = useState(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(0))
  );
  const [enemyBoard, setEnemyBoard] = useState(generateRandomBoard());
  const [gameStarted, setGameStarted] = useState(false);
  const [enemyVisibleBoard, setEnemyVisibleBoard] = useState(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(null))
  );
  const [winner, setWinner] = useState(null);
  const [attackedCells, setAttackedCells] = useState([]); // Keep track of cells attacked by computer

  const handleShipsPlaced = (board) => {
    setPlayerBoard(board);
    setGameStarted(true);
  };

  // Reset the game to the initial state
  const resetGame = () => {
    setGameStarted(false); // Set gameStarted to false to show PlaceShips view
    setWinner(null);
    setPlayerBoard(
      Array(10)
        .fill(0)
        .map(() => Array(10).fill(0))
    );
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
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold font-serif text-yellow-300 drop-shadow-lg mb-6">
        ⚔️ Batalla Naval ⚔️
      </h1>

      {!gameStarted ? (
        <PlaceShips onShipsPlaced={handleShipsPlaced} />
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-center gap-10 mt-5">
            <div>
              <h2 className="text-2xl text-yellow-300 font-serif font-bold drop-shadow-lg mb-2">
                Tu Tablero
              </h2>
              <GameBoard board={playerBoard} isEnemy={false} />
            </div>
            <div>
              <h2 className="text-2xl text-yellow-300 font-serif font-bold drop-shadow-lg mb-2">
                Tablero Enemigo (tu PC)
              </h2>
              <GameBoard
                board={enemyVisibleBoard}
                isEnemy={true}
                onCellClick={playerAttackHandler} // Use the player attack handler
              />
            </div>
          </div>
          <div className="mt-10">
            <button
              onClick={resetGame}
              className="bg-green-200 font-serif text-2xl text-black px-4 py-2 rounded-md mt-3"
            >
              REINICIAR EL JUEGO
            </button>
          </div>
        </div>
      )}

      {winner && (
        <div className="mt-5">
          <h2 className="text-3xl font-bold font-serif text-yellow-300 drop-shadow-lg">
            {winner === "player"
              ? "¡FELICIDADES, GANASTE!"
              : "LO SIENTO... GANÓ TU COMPUTADOR!"}
          </h2>
          <button
            onClick={resetGame}
            className="bg-green-200 font-serif text-2xl text-black px-4 py-2 rounded-md mt-3"
          >
            JUGAR NUEVA PARTIDA
          </button>
        </div>
      )}
    </div>
  );
};
