import PropTypes from "prop-types";
import "../App.css";

const GameBoard = ({ board, onCellClick, isEnemy }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell cell-${cell} ${isEnemy ? "cursor-pointer" : ""}`}
              onClick={() => isEnemy && onCellClick(rowIndex, colIndex)}
            >
              {cell === 2 ? "💥" : cell === 3 ? "❌" : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

GameBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number).isRequired)
    .isRequired,
  onCellClick: PropTypes.func, // Handles the clics on the enemy's board
  isEnemy: PropTypes.bool, // Makes differences between boards
};

export default GameBoard;
