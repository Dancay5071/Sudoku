const HEX_CHARS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '0'];

export function valueToDisplay(val, size) {
  if (val === null || val === undefined) return null;
  if (size === 9) return val.toString();
  return HEX_CHARS[val - 1] ?? null;
}

export function displayToValue(key, size) {
  if (!key) return null;
  const k = key.toUpperCase();
  if (size === 9) {
    const n = parseInt(k, 10);
    return n >= 1 && n <= 9 ? n : null;
  }
  const idx = HEX_CHARS.indexOf(k);
  return idx === -1 ? null : idx + 1;
}

export function getValidKeys(size) {
  if (size === 9) return ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return HEX_CHARS;
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getPeers(index, size) {
  const row = Math.floor(index / size);
  const col = index % size;
  const k = size === 9 ? 3 : 4;
  const boxRow = Math.floor(row / k) * k;
  const boxCol = Math.floor(col / k) * k;

  const peers = new Set();

  for (let c = 0; c < size; c++) peers.add(row * size + c);
  for (let r = 0; r < size; r++) peers.add(r * size + col);
  for (let r = boxRow; r < boxRow + k; r++) {
    for (let c = boxCol; c < boxCol + k; c++) {
      peers.add(r * size + c);
    }
  }

  peers.delete(index);
  return peers;
}


function isGroupComplete(indices, grid) {
  return indices.every(
    idx => grid[idx].value !== null && grid[idx].value === grid[idx].solution
  );
}

export function computeCompletedCells(grid, size) {
  const k = size === 9 ? 3 : 4;
  const completed = new Set();

  for (let r = 0; r < size; r++) {
    const base = r * size;
    let rowComplete = true;
    for (let c = 0; c < size; c++) {
      const cell = grid[base + c];
      if (cell.value === null || cell.value !== cell.solution) { rowComplete = false; break; }
    }
    if (rowComplete) {
      for (let c = 0; c < size; c++) completed.add(base + c);
    }
  }

  for (let c = 0; c < size; c++) {
    let colComplete = true;
    for (let r = 0; r < size; r++) {
      const cell = grid[r * size + c];
      if (cell.value === null || cell.value !== cell.solution) { colComplete = false; break; }
    }
    if (colComplete) {
      for (let r = 0; r < size; r++) completed.add(r * size + c);
    }
  }

  for (let band = 0; band < k; band++) {
    for (let stack = 0; stack < k; stack++) {
      const rowStart = band * k;
      const colStart = stack * k;
      let boxComplete = true;
      outer: for (let r = rowStart; r < rowStart + k; r++) {
        for (let c = colStart; c < colStart + k; c++) {
          const cell = grid[r * size + c];
          if (cell.value === null || cell.value !== cell.solution) { boxComplete = false; break outer; }
        }
      }
      if (boxComplete) {
        for (let r = rowStart; r < rowStart + k; r++) {
          for (let c = colStart; c < colStart + k; c++) {
            completed.add(r * size + c);
          }
        }
      }
    }
  }

  return completed;
}


export function getBoxVariant(idx, size) {
  const k = size === 9 ? 3 : 4;
  const row = Math.floor(idx / size);
  const col = idx % size;
  const band = Math.floor(row / k);
  const stack = Math.floor(col / k);
  return (band + stack) % 2;
}
