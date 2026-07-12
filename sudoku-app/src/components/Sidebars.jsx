import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PencilLine, Eraser, ArrowLeft, Heart } from 'lucide-react';
import { formatTime } from '../lib/gameUtils';
import HintButton from './HintButton';

function HeartIcon({ index, errorCount }) {
  const isLost = index < errorCount;
  const wasLostRef = useRef(isLost);
  const spanRef = useRef(null);

  useEffect(() => {
    const justLost = isLost && !wasLostRef.current;
    wasLostRef.current = isLost;

    if (!spanRef.current) return;

    if (justLost) {
      spanRef.current.classList.remove('heart-lost', 'heart-pulse');
      void spanRef.current.offsetWidth; // force reflow
      spanRef.current.classList.add('heart-lost');
    }
  }, [isLost]);

  return (
    <span
      ref={spanRef}
      className={`heart-icon ${isLost ? 'heart-broken' : ''}`}
      aria-hidden="true"
    >
      <Heart
        size={22}
        fill={!isLost ? 'var(--primary)' : 'none'}
        color={!isLost ? 'var(--primary)' : 'var(--border-medium)'}
      />
    </span>
  );
}

export function SidebarLeft({ onBack, errorCount, maxErrors }) {
  return (
    <div className="game-sidebar sidebar-left">
      <motion.button
        id="back-btn"
        className="sidebar-btn sidebar-btn--back"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Volver al menú"
      >
        <ArrowLeft size={20} />
        <span className="btn-label">Menú</span>
      </motion.button>

      <div className="sidebar-divider" />

      <div className="sidebar-stats">
        <span className="stats-label">Vidas</span>
        <div
          className="error-hearts hearts-container"
          aria-label={`${maxErrors - errorCount} de ${maxErrors} vidas restantes`}
          role="img"
        >
          {Array.from({ length: maxErrors }, (_, i) => (
            <HeartIcon key={i} index={i} errorCount={errorCount} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarRight({
  boardSize,
  difficulty,
  isNotesMode,
  onToggleNotes,
  elapsedTime,
  onHint,
  isHintOnCooldown,
  hintCooldownRemaining,
  hintElapsedFraction,
  hintTotalCooldown,
  hintJustReady,
  isGameOver,
  isComplete,
}) {
  return (
    <div className="game-sidebar sidebar-right">
      <div className="sidebar-stats">
        <span className="stats-label">Modo</span>
        <span className="toolbar-mode">{boardSize === 9 ? '9×9' : '16×16'}</span>
        <span className="toolbar-difficulty">{difficulty}</span>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-stats">
        <span className="stats-label">Tiempo</span>
        <div className="toolbar-timer" aria-label="Tiempo transcurrido" aria-live="polite">
          {formatTime(elapsedTime)}
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-actions">
        <motion.button
          id="notes-toggle-btn"
          className={`sidebar-btn ${isNotesMode ? 'sidebar-btn--active-notes' : ''}`}
          onClick={onToggleNotes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Modo notas (N)"
          aria-pressed={isNotesMode}
        >
          <PencilLine size={20} />
          <span className="btn-label">Notas</span>
        </motion.button>

        <HintButton
          onHint={onHint}
          isOnCooldown={isHintOnCooldown}
          cooldownRemaining={hintCooldownRemaining}
          elapsedFraction={hintElapsedFraction}
          totalCooldown={hintTotalCooldown}
          justReady={hintJustReady}
          disabled={isGameOver || isComplete}
        />
      </div>
    </div>
  );
}
