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
