export const handlePlayerAttack = (
  row,
  col,
  enemyBoard,
  enemyVisibleBoard,
  setEnemyVisibleBoard,
  setWinner,
  checkWinner
) => {
  if (enemyVisibleBoard[row][col] !== null) return; // Avoid repeated attacks

  const newVisibleBoard = enemyVisibleBoard.map((r) => r.slice());
  newVisibleBoard[row][col] = enemyBoard[row][col] === 1 ? 2 : 3; // 2 = impact, 3 = fail
  setEnemyVisibleBoard(newVisibleBoard);

  const updatedEnemyBoard = enemyBoard.map((r, i) =>
    r.map((cell, j) => (newVisibleBoard[i][j] === 2 ? 2 : cell))
  );

  if (checkWinner(updatedEnemyBoard)) {
    setWinner("player");
  }
};

export const handleComputerAttack = (
  playerBoard,
  setPlayerBoard,
  attackedCells,
  setAttackedCells,
  checkWinner,
  setWinner
) => {
  // If the computer has a recent impact, attack nearby cells
  let targetCell;
  const possibleTargets = [];

  // Look for nearby cells if the computer has a previous hit
  attackedCells.forEach((cell) => {
    const [lastRow, lastCol] = cell;
    // Check for adjacent cells (up, down, left, right)
    [
      [lastRow - 1, lastCol], // above
      [lastRow + 1, lastCol], // below
      [lastRow, lastCol - 1], // left
      [lastRow, lastCol + 1], // right
    ].forEach(([r, c]) => {
      if (
        r >= 0 &&
        r < 10 &&
        c >= 0 &&
        c < 10 &&
        playerBoard[r][c] !== 2 &&
        playerBoard[r][c] !== 3
      ) {
        possibleTargets.push([r, c]);
      }
    });
  });

  if (possibleTargets.length > 0) {
    // Pick a random nearby cell
    targetCell =
      possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
  } else {
    // If no recent hits, pick a random untried cell
    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (playerBoard[row][col] === 2 || playerBoard[row][col] === 3);

    targetCell = [row, col];
  }

  const [targetRow, targetCol] = targetCell;
  const newPlayerBoard = playerBoard.map((row) => row.slice());
  newPlayerBoard[targetRow][targetCol] =
    newPlayerBoard[targetRow][targetCol] === 1 ? 2 : 3;

  setPlayerBoard(newPlayerBoard);
  setAttackedCells((prev) => [...prev, targetCell]);

  // Check if the computer won
  if (checkWinner(newPlayerBoard)) {
    setWinner("computer");
  }
};
