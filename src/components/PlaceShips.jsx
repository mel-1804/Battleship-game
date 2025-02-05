import { useState } from "react";
import PropTypes from "prop-types";

const BOARD_SIZE = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2]; // Tamaños de los barcos

export const PlaceShips = ({ onShipsPlaced }) => {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE)
      .fill(0)
      .map(() => Array(BOARD_SIZE).fill(0))
  );
  const [currentShip, setCurrentShip] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(true);

  const handleCellClick = (row, col) => {
    if (currentShip >= SHIP_SIZES.length) return;

    const shipSize = SHIP_SIZES[currentShip];
    const newBoard = board.map((row) => [...row]);

    // Verificar si el barco cabe en la dirección seleccionada
    for (let i = 0; i < shipSize; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      if (r >= BOARD_SIZE || c >= BOARD_SIZE || newBoard[r][c] === 1) {
        alert("El barco no cabe aquí.");
        return;
      }
    }

    // Colocar el barco en el tablero
    for (let i = 0; i < shipSize; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      newBoard[r][c] = 1;
    }

    setBoard(newBoard);
    setCurrentShip(currentShip + 1);
  };

  const handleConfirm = () => {
    if (currentShip < SHIP_SIZES.length) {
      alert("Coloca todos los barcos antes de continuar.");
      return;
    }
    onShipsPlaced(board);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col mb-4">
        <button
          onClick={() => setIsHorizontal(!isHorizontal)}
          className="px-4 py-2 bg-blue-800 text-yellow-100 text-2xl font-bold font-serif rounded-md"
        >
          Dirección: {isHorizontal ? "Horizontal" : "Vertical"}
        </button>
        <h1 className="text-xl text-yellow-200 font-serif">
          Escoge la posición de tus barcos
        </h1>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`w-8 h-8 border rounded-md ${
                cell === 1 ? "bg-gray-400" : "bg-yellow-100"
              }`}
            />
          ))
        )}
      </div>
      <button
        onClick={handleConfirm}
        className="mt-4 px-4 py-2 bg-green-800 text-yellow-100 text-2xl font-bold font-serif rounded-md"
      >
        Confirmar
      </button>
      <h1 className="text-lg text-yellow-200 font-serif">
        Ahora comienza el juego...
      </h1>
    </div>
  );
};

PlaceShips.propTypes = {
  onShipsPlaced: PropTypes.func.isRequired,
};
