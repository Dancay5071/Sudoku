import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, XCircle, Clock } from 'lucide-react';
import { fetchTopScores } from '../lib/leaderboard';
import { formatTime } from '../lib/gameUtils';

const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];
const MEDAL_COLOR = ['#d4a017', '#9ba3b0', '#c87d52'];

const MODES = [
  { size: 9, label: 'Clásico 9×9' },
  { size: 16, label: 'Hexa 16×16' }
];

const DIFFICULTIES = ['Fácil', 'Medio', 'Difícil'];

function ScoreRow({ entry, position }) {
  return (
    <div className="score-row">
      <span className="score-row__medal" style={{ color: MEDAL_COLOR[position] }}>
        {MEDAL_EMOJI[position]}
      </span>
      <span className="score-row__name">{entry.name}</span>
      <div className="score-row__right">
        <span className="score-row__pts">{entry.score.toLocaleString()}</span>
        <span className="score-row__meta">{formatTime(entry.elapsedTime)} · {entry.difficulty}</span>
      </div>
    </div>
  );
}

export default function LeaderboardModal({ isVisible, onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(9);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isVisible) return;
      setLoading(true);
      const data = await fetchTopScores(selectedSize, selectedDifficulty);
      if (mounted) {
        setScores(data);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [isVisible, selectedSize, selectedDifficulty]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-card modal-card--victory"
            initial={{ scale: 0.84, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px' }}
          >
            <motion.div
              className="modal-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
            >
              <Trophy size={36} />
            </motion.div>

            <motion.h2
              className="modal-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Mejores Puntajes
            </motion.h2>

            <motion.div 
              className="leaderboard-filters" 
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {MODES.map(m => (
                  <button
                    key={m.size}
                    className={`difficulty-pill ${selectedSize === m.size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(m.size)}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    className={`difficulty-pill ${selectedDifficulty === d ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(d)}
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="victory-leaderboard"
              style={{ marginTop: '1.5rem', width: '100%', minHeight: '120px' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {loading ? (
                <div className="victory-leaderboard--loading">
                  <div className="pastel-spinner"></div>
                </div>
              ) : scores.length === 0 ? (
                <p className="leaderboard-empty" style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--text-muted)' }}>
                  Aún no hay puntajes registrados.<br/>¡Jugá una partida y sé el primero! 🏆
                </p>
              ) : (
                <div className="score-list">
                  {scores.map((s, i) => (
                    <ScoreRow key={`${s.name}-${i}`} entry={s} position={i} />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="modal-actions"
              style={{ marginTop: '1.5rem' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="modal-btn modal-btn--secondary"
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%' }}
              >
                Cerrar
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
