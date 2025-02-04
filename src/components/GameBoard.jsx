import PropTypes from "prop-types";
import "../App.css"; // Opcional, para estilos

const GameBoard = ({ board }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div key={colIndex} className={`cell cell-${cell}`}>
              {cell === 2 ? "💥" : cell === 3 ? "❌" : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// 📌 Validación de props
GameBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number).isRequired)
    .isRequired,
};

export default GameBoard;
