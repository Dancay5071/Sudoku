const BOX = { 9: 3, 16: 4 };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateSolvedBoard(size) {
  const k = BOX[size];

  const board = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) =>
      ((r * k + Math.floor(r / k) + c) % size) + 1
    )
  );

  for (let band = 0; band < k; band++) {
    const rowPerm = shuffle(Array.from({ length: k }, (_, i) => i));
    const bandRows = rowPerm.map(i => [...board[band * k + i]]);
    for (let i = 0; i < k; i++) board[band * k + i] = bandRows[i];
  }

  for (let stack = 0; stack < k; stack++) {
    const colPerm = shuffle(Array.from({ length: k }, (_, i) => i));
    for (let r = 0; r < size; r++) {
      const orig = [...board[r]];
      for (let i = 0; i < k; i++) {
        board[r][stack * k + i] = orig[stack * k + colPerm[i]];
      }
    }
  }

  const bandPerm = shuffle(Array.from({ length: k }, (_, i) => i));
  const newRows = bandPerm.flatMap(b =>
    Array.from({ length: k }, (_, i) => [...board[b * k + i]])
  );
  for (let r = 0; r < size; r++) board[r] = newRows[r];

  const stackPerm = shuffle(Array.from({ length: k }, (_, i) => i));
  for (let r = 0; r < size; r++) {
    const orig = [...board[r]];
    for (let s = 0; s < k; s++) {
      for (let c = 0; c < k; c++) {
        board[r][stackPerm[s] * k + c] = orig[s * k + c];
      }
    }
  }

  const valuePerm = shuffle(Array.from({ length: size }, (_, i) => i + 1));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      board[r][c] = valuePerm[board[r][c] - 1];
    }
  }

  return board;
}

const CLUE_COUNT = {
  9: { 'Fácil': 46, 'Medio': 36, 'Difícil': 26 },
  16: { 'Fácil': 150, 'Medio': 120, 'Difícil': 96 },
};


export function createPuzzle(solvedBoard, difficulty, size) {
  const clues = CLUE_COUNT[size]?.[difficulty] ?? CLUE_COUNT[size]['Medio'];
  const totalCells = size * size;
  const toRemove = totalCells - clues;

  const flatSolution = solvedBoard.flat();
  const indices = shuffle(Array.from({ length: totalCells }, (_, i) => i));
  const removedSet = new Set(indices.slice(0, toRemove));

  return flatSolution.map((val, idx) => ({
    value: removedSet.has(idx) ? null : val,
    notes: [],
    isGiven: !removedSet.has(idx),
    isError: false,
    solution: val,
  }));
}

export function isValidPlacement(board2D, row, col, value, size) {
  const k = BOX[size];

  for (let c = 0; c < size; c++) {
    if (c !== col && board2D[row][c] === value) return false;
  }

  for (let r = 0; r < size; r++) {
    if (r !== row && board2D[r][col] === value) return false;
  }

  const boxRow = Math.floor(row / k) * k;
  const boxCol = Math.floor(col / k) * k;
  for (let r = boxRow; r < boxRow + k; r++) {
    for (let c = boxCol; c < boxCol + k; c++) {
      if ((r !== row || c !== col) && board2D[r][c] === value) return false;
    }
  }

  return true;
}

export function isBoardComplete(grid) {
  return grid.every(cell => cell.value !== null && cell.value === cell.solution);
}


export function gridTo2D(grid, size) {
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => grid[r * size + c].value)
  );
}
