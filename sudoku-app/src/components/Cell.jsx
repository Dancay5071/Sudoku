import React, { useRef, useEffect } from 'react';
import { valueToDisplay } from '../lib/gameUtils';

function Cell({
  value,
  notes = [],
  isSelected = false,
  isPeer = false,
  isSameValue = false,
  isGiven = false,
  isHint = false,
  isError = false,
  isCompleted = false,
  isBoxAlt = false,
  boardSize = 9,
  onClick,
}) {
  const cellRef = useRef(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== null && value !== prevValueRef.current && cellRef.current) {
      let cls;
      if (isError) {
        cls = 'cell-shake';
      } else if (isHint) {
        cls = 'cell-hint-pop';
      } else {
        cls = 'cell-pop';
      }

      cellRef.current.classList.remove('cell-pop', 'cell-shake', 'cell-hint-pop');
      void cellRef.current.offsetWidth;
      cellRef.current.classList.add(cls);

      const duration = isHint ? 600 : 350;
      const timer = setTimeout(() => {
        cellRef.current?.classList.remove('cell-pop', 'cell-shake', 'cell-hint-pop');
      }, duration);
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value, isError, isHint]);

  const displayValue = valueToDisplay(value, boardSize);
  const hasValue = value !== null;
  const hasNotes = notes.length > 0;
  const noteGridClass = boardSize === 16 ? 'notes-4x4' : 'notes-3x3';

  const classNames = [
    'sudoku-cell',
    isBoxAlt && 'box-alt',
    isHint && 'hint-cell',
    isGiven && !isHint && 'given',
    isPeer && !isSelected && 'peer',
    isSameValue && !isSelected && 'same-value',
    isCompleted && 'completed',
    isSelected && 'selected',
    isError && 'error',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={cellRef}
      className={classNames}
      onClick={onClick}
      role="gridcell"
      aria-selected={isSelected}
      aria-label={
        hasValue
          ? `Valor ${displayValue}${isGiven ? ', fijo' : ''}${isHint ? ', pista' : ''}${isError ? ', incorrecto' : ''}`
          : `Celda vacía${hasNotes ? `, ${notes.length} notas` : ''}`
      }
    >
      {hasValue ? (
        <span className="cell-value">{displayValue}</span>
      ) : hasNotes ? (
        <div className={`cell-notes ${noteGridClass}`}>
          {Array.from({ length: boardSize }, (_, i) => i + 1).map(n => (
            <div key={n} className="note-item">
              {notes.includes(n) ? valueToDisplay(n, boardSize) : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function areCellPropsEqual(prev, next) {
  return (
    prev.value === next.value &&
    prev.isSelected === next.isSelected &&
    prev.isPeer === next.isPeer &&
    prev.isSameValue === next.isSameValue &&
    prev.isGiven === next.isGiven &&
    prev.isHint === next.isHint &&
    prev.isError === next.isError &&
    prev.isCompleted === next.isCompleted &&
    prev.isBoxAlt === next.isBoxAlt &&
    prev.boardSize === next.boardSize &&
    prev.onClick === next.onClick &&
    prev.notes.length === next.notes.length &&
    prev.notes.every((n, i) => n === next.notes[i])
  );
}

export default React.memo(Cell, areCellPropsEqual);
