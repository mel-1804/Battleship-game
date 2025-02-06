export const generateRandomBoard = () => {
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
