export const handleComputerAttack = (
  playerBoard,
  setPlayerBoard,
  attackedCells,
  setAttackedCells,
  checkWinner,
  setWinner
) => {
  setTimeout(() => {
    const freshPlayerBoard = playerBoard.map((row) => row.slice()); // Clone the current board
    const freshAttackedCells = [...attackedCells]; // Clone the attack list

    let targetCell = null;
    let possibleTargets = [];

    let lastHits = freshAttackedCells.filter(
      ([r, c]) => freshPlayerBoard[r][c] === 2 // Filter only successful hits
    );

    const findPossibleTargets = (hitRow, hitCol) => {
      let newTargets = [];

      [
        [hitRow - 1, hitCol], // Above
        [hitRow + 1, hitCol], // Below
        [hitRow, hitCol - 1], // Left
        [hitRow, hitCol + 1], // Right
      ].forEach(([r, c]) => {
        if (
          r >= 0 &&
          r < 10 &&
          c >= 0 &&
          c < 10 &&
          freshPlayerBoard[r][c] !== 2 && // Have not been impacted
          freshPlayerBoard[r][c] !== 3 // It was not a fail
        ) {
          newTargets.push([r, c]);
        }
      });

      possibleTargets.push(...newTargets);
    };

    // Case 1: If there are recent impacts, prioritize the right direction
    if (lastHits.length > 0) {
      lastHits.sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2);

      // Check if there are impacts aligned in a row or column
      const [firstHitRow, firstHitCol] = lastHits[0];
      const isHorizontal = lastHits.every(([r]) => r === firstHitRow);
      const isVertical = lastHits.every(([, c]) => c === firstHitCol);

      if (isHorizontal || isVertical) {
        const [firstHitRow, firstHitCol] = lastHits[0];
        const [lastHitRow, lastHitCol] = lastHits[lastHits.length - 1];

        // Follow the right direction first
        if (isHorizontal) {
          if (
            lastHitCol + 1 < 10 &&
            freshPlayerBoard[lastHitRow][lastHitCol + 1] !== 2 &&
            freshPlayerBoard[lastHitRow][lastHitCol + 1] !== 3
          ) {
            targetCell = [lastHitRow, lastHitCol + 1]; // Right
          } else if (
            firstHitCol - 1 >= 0 &&
            freshPlayerBoard[firstHitRow][firstHitCol - 1] !== 2 &&
            freshPlayerBoard[firstHitRow][firstHitCol - 1] !== 3
          ) {
            targetCell = [firstHitRow, firstHitCol - 1]; // Left
          }
        }

        if (isVertical) {
          if (
            lastHitRow + 1 < 10 &&
            freshPlayerBoard[lastHitRow + 1][lastHitCol] !== 2 &&
            freshPlayerBoard[lastHitRow + 1][lastHitCol] !== 3
          ) {
            targetCell = [lastHitRow + 1, lastHitCol]; // Below
          } else if (
            firstHitRow - 1 >= 0 &&
            freshPlayerBoard[firstHitRow - 1][firstHitCol] !== 2 &&
            freshPlayerBoard[firstHitRow - 1][firstHitCol] !== 3
          ) {
            targetCell = [firstHitRow - 1, firstHitCol]; // Above
          }
        }
      } else {
        // If they are not aligned, look for new possible attacks
        lastHits.forEach(([r, c]) => findPossibleTargets(r, c));
      }
    }

    // Case 2: If there is no direct target, search in `possibleTargets`
    if (!targetCell && possibleTargets.length > 0) {
      for (let i = 0; i < possibleTargets.length; i++) {
        const [r, c] = possibleTargets[i];
        if (freshPlayerBoard[r][c] !== 2 && freshPlayerBoard[r][c] !== 3) {
          targetCell = [r, c];
          break;
        }
      }
    }

    // Case 3: If there are no other options, re-analyze `lastHits`
    if (!targetCell && lastHits.length > 0) {
      lastHits.forEach(([r, c]) => findPossibleTargets(r, c));

      if (possibleTargets.length > 0) {
        targetCell = possibleTargets[0];
      }
    }

    // Case 4: If there is still no target, attack randomly
    if (!targetCell) {
      let randomRow, randomCol;
      do {
        randomRow = Math.floor(Math.random() * 10);
        randomCol = Math.floor(Math.random() * 10);
      } while (
        freshPlayerBoard[randomRow][randomCol] === 2 ||
        freshPlayerBoard[randomRow][randomCol] === 3
      );
      targetCell = [randomRow, randomCol];
    }

    // Attack the selected cell
    const [targetRow, targetCol] = targetCell;
    const newPlayerBoard = freshPlayerBoard.map((row) => row.slice());
    newPlayerBoard[targetRow][targetCol] =
      newPlayerBoard[targetRow][targetCol] === 1 ? 2 : 3; // Impact or fail

    setPlayerBoard(newPlayerBoard);
    setAttackedCells((prev) => [...prev, targetCell]);

    if (checkWinner(newPlayerBoard)) {
      setWinner("computer");
    }
  }, 1000); // Simulation of "thinking time"
};
