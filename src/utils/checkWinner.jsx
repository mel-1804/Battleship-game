export const checkWinner = (board) => {
  // If there are no more ships (cells with 1), the player has lost.
  return board.flat().every((cell) => cell !== 1);
};
