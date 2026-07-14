import React, { useCallback } from 'react';
import { Play } from 'lucide-react';
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
  isPaused = false,
  onTogglePause,
}) {
  return (
    <div className="board-scroll-wrapper" role="grid" aria-label={`Tablero Sudoku ${size}×${size}`}>
      <div className="board-center">
        <div className={`sudoku-board size-${size}`}>
          {isPaused ? (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'var(--bg-overlay)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: 'var(--radius-sm)',
              gap: '1.5rem',
            }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.8rem', 
                color: 'var(--text-primary)', 
                fontWeight: '700', 
                letterSpacing: '0.1em',
                textShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                EN PAUSA
              </span>
              <button 
                className="play-button"
                style={{ padding: '0.8rem 2.5rem', fontSize: '1.2rem' }}
                onClick={onTogglePause}
              >
                <Play size={24} fill="currentColor" />
                REANUDAR
              </button>
            </div>
          ) : null}
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
