export const handleComputerAttack = (
  playerBoard,
  setPlayerBoard,
  attackedCells,
  setAttackedCells,
  checkWinner,
  setWinner
) => {
  setTimeout(() => {
    const freshPlayerBoard = playerBoard.map((row) => row.slice()); // Clone the current player board
    const freshAttackedCells = [...attackedCells]; // Clone the attacked cells list

    let targetCell;
    let possibleTargets = [];
    let lastHits = freshAttackedCells.filter(
      ([r, c]) => freshPlayerBoard[r][c] === 2 // Successful hits
    );

    const findPossibleTargets = (hitRow, hitCol) => {
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
          freshPlayerBoard[r][c] !== 2 &&
          freshPlayerBoard[r][c] !== 3
        ) {
          possibleTargets.push([r, c]); // Add to possible targets
        }
      });
    };

    // Case 1: What to do after the first impact
    if (lastHits.length > 0) {
      lastHits.sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2);

      // Verification of isolated cells (cells that are not next to another hit)
      const isolatedHits = lastHits.filter(([r, c]) => {
        return !lastHits.some(
          ([nr, nc]) =>
            (nr === r - 1 && nc === c) || // Neighbor above
            (nr === r + 1 && nc === c) || // Neighbor below
            (nr === r && nc === c - 1) || // Neighbor left
            (nr === r && nc === c + 1) // Neighbor right
        );
      });

      // Looking for new cells to attack
      if (isolatedHits.length > 0) {
        const [hitRow, hitCol] = isolatedHits[0];
        findPossibleTargets(hitRow, hitCol);
      }

      // Case 2: More than one impacted cell (consecutive hits)
      if (lastHits.length >= 2 && isolatedHits.length === 0) {
        const [firstHitRow, firstHitCol] = lastHits[0];
        const [lastHitRow, lastHitCol] = lastHits[lastHits.length - 1];

        console.log("Consecutive hits detected:", lastHits);

        // Horizontal hits
        if (firstHitRow === lastHitRow) {
          // Try right attack
          if (
            lastHitCol + 1 < 10 &&
            freshPlayerBoard[lastHitRow][lastHitCol + 1] !== 2 &&
            freshPlayerBoard[lastHitRow][lastHitCol + 1] !== 3
          ) {
            targetCell = [lastHitRow, lastHitCol + 1];
          }
          // Try left attack
          else if (
            firstHitCol - 1 >= 0 &&
            freshPlayerBoard[firstHitRow][firstHitCol - 1] !== 2 &&
            freshPlayerBoard[firstHitRow][firstHitCol - 1] !== 3
          ) {
            targetCell = [firstHitRow, firstHitCol - 1];
          }
        }

        // Vertical hits
        if (firstHitCol === lastHitCol) {
          // Try below attack
          if (
            lastHitRow + 1 < 10 &&
            freshPlayerBoard[lastHitRow + 1][lastHitCol] !== 2 &&
            freshPlayerBoard[lastHitRow + 1][lastHitCol] !== 3
          ) {
            targetCell = [lastHitRow + 1, lastHitCol];
          }
          // Try above attack
          else if (
            firstHitRow - 1 >= 0 &&
            freshPlayerBoard[firstHitRow - 1][firstHitCol] !== 2 &&
            freshPlayerBoard[firstHitRow - 1][firstHitCol] !== 3
          ) {
            targetCell = [firstHitRow - 1, firstHitCol];
          }
        }
      }
    }

    // Log possible targets
    console.log("Possible targets:", possibleTargets);

    // If no target cell was found, choose the first valid cell from possible targets
    if (!targetCell && possibleTargets.length > 0) {
      for (let i = 0; i < possibleTargets.length; i++) {
        const [r, c] = possibleTargets[i];
        if (freshPlayerBoard[r][c] !== 2 && freshPlayerBoard[r][c] !== 3) {
          targetCell = [r, c];
          break;
        }
      }
    }

    // If still no target cell, choose a completely random cell
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

    // Log the selected target cell
    console.log("Target cell:", targetCell);

    // Attack the target cell
    const [targetRow, targetCol] = targetCell;
    const newPlayerBoard = freshPlayerBoard.map((row) => row.slice());
    newPlayerBoard[targetRow][targetCol] =
      newPlayerBoard[targetRow][targetCol] === 1 ? 2 : 3; // Mark the cell as hit or miss

    setPlayerBoard(newPlayerBoard);
    setAttackedCells((prev) => [...prev, targetCell]);

    if (checkWinner(newPlayerBoard)) {
      setWinner("computer");
    }
  }, 1000); // Simulate a "thinking" delay
};
