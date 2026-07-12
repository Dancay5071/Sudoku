import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import { SidebarLeft, SidebarRight } from './components/Sidebars';
import VictoryModal from './components/VictoryModal';
import PlayButton from './components/PlayButton';
import { PortfolioAction, CafecitoAction, LeaderboardAction } from './components/Cafecito';
import Leaderboard from './components/Leaderboard';
import LeaderboardModal from './components/LeaderboardModal';
import useGameState from './hooks/useGameState';
import useHint from './hooks/useHint';
import { SudokuGridIcon, HexaGridIcon } from './components/icons';

import './styles/variables.css';
import './styles/animations.css';
import './App.css';


const MODES = [
  {
    size: 9,
    icon: <SudokuGridIcon size={28} className="mode-card-icon" />,
    title: 'Clásico 9×9',
    sub: 'Valores 1–9',
  },
  {
    size: 16,
    icon: <HexaGridIcon size={28} className="mode-card-icon" />,
    title: 'Hexadecimal',
    sub: '16×16 · 0–F',
  },
];

const DIFFICULTIES = ['Fácil', 'Medio', 'Difícil'];


function SetupScreen({ boardSize, setBoardSize, difficulty, setDifficulty, onPlay }) {

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      <div className="setup-card">
        <div className="setup-section">
          <span className="setup-label">Modo de juego</span>
          <div className="mode-cards">
            {MODES.map(m => (
              <motion.button
                key={m.size}
                id={`mode-btn-${m.size}`}
                className={`mode-card ${boardSize === m.size ? 'active' : ''}`}
                onClick={() => setBoardSize(m.size)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {m.icon}
                <span className="mode-card-title">{m.title}</span>
                <span className="mode-card-sub">{m.sub}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <span className="setup-label">Dificultad</span>
          <div className="difficulty-pills">
            {DIFFICULTIES.map(d => (
              <motion.button
                key={d}
                id={`difficulty-${d}`}
                className={`difficulty-pill ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {d}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="action-area">
          <PlayButton onClick={onPlay} isPlaying={false} />
          <p className="keyboard-hint">
            Navegá con <kbd className="kbd">↑↓←→</kbd> · Notas con <kbd className="kbd">N</kbd>
          </p>
        </div>

        <Leaderboard />
      </div>
    </motion.div>
  );
}

function GameScreen({
  boardSize,
  difficulty,
  grid,
  selectedCell,
  peers,
  selectedValue,
  isNotesMode,
  errorCount,
  maxErrors,
  elapsedTime,
  isComplete,
  isGameOver,
  onCellClick,
  onToggleNotes,
  onErase,
  onBack,
  onValueInput,
  onNewGame,
  completedCells,
  onHint,
  isHintOnCooldown,
  hintCooldownRemaining,
  hintElapsedFraction,
  hintTotalCooldown,
  hintJustReady,
}) {
  return (
    <motion.div
      key="game"
      className="game-layout"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <SidebarLeft
        onBack={onBack}
        errorCount={errorCount}
        maxErrors={maxErrors}
      />

      <div className="board-column">
        <SudokuBoard
          size={boardSize}
          grid={grid}
          onCellClick={onCellClick}
          selectedCell={selectedCell}
          peers={peers}
          selectedValue={selectedValue}
          completedCells={completedCells}
        />
        <NumberPad
          boardSize={boardSize}
          onValueClick={onValueInput}
          onErase={onErase}
        />
      </div>


      <SidebarRight
        boardSize={boardSize}
        difficulty={difficulty}
        isNotesMode={isNotesMode}
        onToggleNotes={onToggleNotes}
        elapsedTime={elapsedTime}
        onHint={onHint}
        isHintOnCooldown={isHintOnCooldown}
        hintCooldownRemaining={hintCooldownRemaining}
        hintElapsedFraction={hintElapsedFraction}
        hintTotalCooldown={hintTotalCooldown}
        hintJustReady={hintJustReady}
        isGameOver={isGameOver}
        isComplete={isComplete}
      />


      <VictoryModal
        isVisible={isComplete || isGameOver}
        isGameOver={isGameOver}
        elapsedTime={elapsedTime}
        errorCount={errorCount}
        maxErrors={maxErrors}
        boardSize={boardSize}
        difficulty={difficulty}
        onNewGame={onNewGame}
        onBack={onBack}
      />
    </motion.div>
  );
}


export default function App() {

  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const {
    boardSize, setBoardSize,
    difficulty, setDifficulty,
    isPlaying,
    isComplete,
    isGameOver,
    grid,
    selectedCell,
    peers,
    selectedValue,
    isNotesMode, setIsNotesMode,
    errorCount,
    maxErrors,
    elapsedTime,
    startGame,
    returnToMenu,
    handleCellSelect,
    handleValueInput,
    handleErase,
    handleHint,
    completedCells,
  } = useGameState();

  const {
    isOnCooldown: isHintOnCooldown,
    cooldownRemaining: hintCooldownRemaining,
    elapsedFraction: hintElapsedFraction,
    justReady: hintJustReady,
    triggerCooldown: triggerHintCooldown,
    totalCooldown: hintTotalCooldown,
  } = useHint();

  const onHint = useCallback(() => {
    handleHint();
    triggerHintCooldown();
  }, [handleHint, triggerHintCooldown]);

  const toggleNotes = useCallback(
    () => setIsNotesMode(v => !v),
    [setIsNotesMode]
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <PortfolioAction portfolioUrl="https://dani-cabrera.dev" isPlaying={isPlaying} />

        <div className="app-header__center">
          <div className="app-logo">
            <SudokuGridIcon size={20} className="app-logo-icon" aria-hidden="true" />
            <h1 className="app-title">Sudoku</h1>
          </div>
          <p className="app-tagline">Una experiencia limpia, moderna y relajante.</p>
        </div>

        <div className="header-actions-right" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifySelf: 'flex-end' }}>
          <LeaderboardAction onClick={() => setIsLeaderboardOpen(true)} isPlaying={isPlaying} />
          <CafecitoAction cafecitoUrl="https://cafecito.app" isPlaying={isPlaying} />
        </div>
      </header>

      <main style={{ width: '100%', flex: 1 }}>
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <SetupScreen
              boardSize={boardSize}
              setBoardSize={setBoardSize}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              onPlay={startGame}
            />
          ) : (
            <GameScreen
              boardSize={boardSize}
              difficulty={difficulty}
              grid={grid}
              selectedCell={selectedCell}
              peers={peers}
              selectedValue={selectedValue}
              isNotesMode={isNotesMode}
              errorCount={errorCount}
              maxErrors={maxErrors}
              elapsedTime={elapsedTime}
              isComplete={isComplete}
              isGameOver={isGameOver}
              onCellClick={handleCellSelect}
              onToggleNotes={toggleNotes}
              onErase={handleErase}
              onBack={returnToMenu}
              onValueInput={handleValueInput}
              onNewGame={startGame}
              completedCells={completedCells}
              onHint={onHint}
              isHintOnCooldown={isHintOnCooldown}
              hintCooldownRemaining={hintCooldownRemaining}
              hintElapsedFraction={hintElapsedFraction}
              hintTotalCooldown={hintTotalCooldown}
              hintJustReady={hintJustReady}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <span className="footer-left">© 2026 Daniela Cabrera</span>
        <span className="footer-right">React · Vite</span>
      </footer>

      <LeaderboardModal
        isVisible={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
}
