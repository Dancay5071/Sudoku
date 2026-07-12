
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  generateSolvedBoard,
  createPuzzle,
  isBoardComplete,
} from '../lib/sudoku';
import {
  displayToValue,
  getValidKeys,
  getPeers,
  computeCompletedCells,
} from '../lib/gameUtils';

const MAX_ERRORS = 3;

export default function useGameState() {
  const [boardSize, setBoardSize] = useState(9);
  const [difficulty, setDifficulty] = useState('Medio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  useEffect(() => {
    if (isComplete || isGameOver) stopTimer();
  }, [isComplete, isGameOver, stopTimer]);

  useEffect(() => {
    if (errorCount >= MAX_ERRORS && isPlaying && !isGameOver) {
      setIsGameOver(true);
    }
  }, [errorCount, isPlaying, isGameOver]);

  const startGame = useCallback(() => {
    const solvedBoard = generateSolvedBoard(boardSize);
    const puzzle = createPuzzle(solvedBoard, difficulty, boardSize);
    setGrid(puzzle);
    setSelectedCell(null);
    setIsNotesMode(false);
    setErrorCount(0);
    setIsComplete(false);
    setIsGameOver(false);
    setElapsedTime(0);
    setIsPlaying(true);
    startTimer();
  }, [boardSize, difficulty, startTimer]);

  const returnToMenu = useCallback(() => {
    stopTimer();
    setIsPlaying(false);
    setIsComplete(false);
    setIsGameOver(false);
    setSelectedCell(null);
    setIsNotesMode(false);
  }, [stopTimer]);

  const handleCellSelect = useCallback((index) => {
    setSelectedCell(prev => (prev === index ? null : index));
  }, []);

  const handleErase = useCallback(() => {
    if (selectedCell === null) return;
    setGrid(prev => {
      const cell = prev[selectedCell];
      if (cell.isGiven || cell.isHint || cell.value === null) return prev;
      const newGrid = [...prev];
      newGrid[selectedCell] = { ...cell, value: null, notes: [], isError: false };
      return newGrid;
    });
  }, [selectedCell]);

  const pendingCompleteRef = useRef(false);
  const pendingErrorRef = useRef(false);

  const handleHint = useCallback(() => {
    if (isComplete || isGameOver) return;

    setGrid(prev => {
      const candidates = prev.reduce((acc, cell, idx) => {
        if (!cell.isGiven && !cell.isHint && cell.value === null) acc.push(idx);
        return acc;
      }, []);

      if (candidates.length === 0) return prev;

      const targetIdx = candidates[Math.floor(Math.random() * candidates.length)];
      const cell = prev[targetIdx];

      const newGrid = [...prev];
      newGrid[targetIdx] = {
        ...cell,
        value: cell.solution,
        notes: [],
        isError: false,
        isHint: true,
      };

      pendingCompleteRef.current = isBoardComplete(newGrid);
      return newGrid;
    });
  }, [isComplete, isGameOver]);

  const handleValueInput = useCallback((displayKey) => {
    if (selectedCell === null || isComplete || isGameOver) return;

    setGrid(prev => {
      const cell = prev[selectedCell];
      if (cell.isGiven) return prev;

      const intValue = displayToValue(displayKey, boardSize);
      if (intValue === null) return prev;

      const newGrid = [...prev];

      if (isNotesMode) {
        if (cell.value !== null) return prev;
        const notes = cell.notes.includes(intValue)
          ? cell.notes.filter(n => n !== intValue)
          : [...cell.notes, intValue];
        newGrid[selectedCell] = { ...cell, notes };
      } else {
        const isCorrect = intValue === cell.solution;
        newGrid[selectedCell] = {
          ...cell,
          value: intValue,
          notes: [],
          isError: !isCorrect,
        };

        if (!isCorrect && !cell.isError) {
          pendingErrorRef.current = true;
        }

        if (isCorrect) {
          pendingCompleteRef.current = isBoardComplete(newGrid);
        }
      }

      return newGrid;
    });
  }, [selectedCell, boardSize, isNotesMode, isComplete, isGameOver]);

  useEffect(() => {
    if (pendingCompleteRef.current) {
      pendingCompleteRef.current = false;
      setIsComplete(true);
    }
    if (pendingErrorRef.current) {
      pendingErrorRef.current = false;
      setErrorCount(prev => prev + 1);
    }
  });

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      if (selectedCell !== null && e.key.startsWith('Arrow')) {
        e.preventDefault();
        const row = Math.floor(selectedCell / boardSize);
        const col = selectedCell % boardSize;
        const deltas = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        const [dr, dc] = deltas[e.key] ?? [0, 0];
        const newRow = Math.max(0, Math.min(boardSize - 1, row + dr));
        const newCol = Math.max(0, Math.min(boardSize - 1, col + dc));
        setSelectedCell(newRow * boardSize + newCol);
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        setIsNotesMode(prev => !prev);
        return;
      }

      const key = e.key.toUpperCase();
      const validKeys = getValidKeys(boardSize);
      if (validKeys.includes(key)) {
        handleValueInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, selectedCell, boardSize, handleValueInput, handleErase]);

  const peers = useMemo(() => {
    if (selectedCell === null) return new Set();
    return getPeers(selectedCell, boardSize);
  }, [selectedCell, boardSize]);

  const selectedValue = selectedCell !== null ? (grid[selectedCell]?.value ?? null) : null;

  const completedCells = useMemo(() => {
    if (!isPlaying || grid.length === 0) return new Set();
    return computeCompletedCells(grid, boardSize);
  }, [grid, boardSize, isPlaying]);

  return {
    boardSize, setBoardSize,
    difficulty, setDifficulty,
    isPlaying,
    isComplete,
    isGameOver,
    grid,
    selectedCell,
    peers,
    selectedValue,
    completedCells,
    isNotesMode,
    setIsNotesMode,
    errorCount,
    maxErrors: MAX_ERRORS,
    elapsedTime,

    startGame,
    returnToMenu,
    handleCellSelect,
    handleHint,
  };
}
