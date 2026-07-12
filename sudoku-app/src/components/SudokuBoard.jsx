import React, { useCallback } from 'react';
import Cell from './Cell';
import { getBoxVariant } from '../lib/gameUtils';
import '../styles/board.css';

const SudokuBoard = React.memo(function SudokuBoard({
  size = 9,
  grid,
  onCellClick,
  selectedCell,
  peers,
  selectedValue,
  completedCells = new Set(),
}) {
  return (
    <div className="board-scroll-wrapper" role="grid" aria-label={`Tablero Sudoku ${size}×${size}`}>
      <div className="board-center">
        <div className={`sudoku-board size-${size}`}>
          {grid.map((cell, idx) => {
            const isSameValue =
              selectedValue !== null &&
              cell.value !== null &&
              cell.value === selectedValue &&
              idx !== selectedCell;

            return (
              <Cell
                key={idx}
                value={cell.value}
                notes={cell.notes}
                isGiven={cell.isGiven}
                isHint={cell.isHint ?? false}
                isError={cell.isError}
                isSelected={selectedCell === idx}
                isPeer={peers ? peers.has(idx) : false}
                isSameValue={isSameValue}
                isCompleted={completedCells.has(idx)}
                isBoxAlt={getBoxVariant(idx, size) === 1}
                boardSize={size}
                onClick={() => onCellClick(idx)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default SudokuBoard;
