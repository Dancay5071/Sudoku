import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, XCircle, Clock, Star, Send, RotateCcw, Home, Heart } from 'lucide-react';
import { formatTime } from '../lib/gameUtils';
import { calculateScore, fetchTopScores, submitScore, MAX_SCORES } from '../lib/leaderboard';

const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];
const MEDAL_COLOR = ['#d4a017', '#9ba3b0', '#c87d52'];

function ScoreRow({ entry, position, isNew }) {
  return (
    <motion.div
      className={`score-row ${isNew ? 'score-row--new' : ''}`}
      initial={isNew ? { scale: 0.92, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <span className="score-row__medal" style={{ color: MEDAL_COLOR[position] }}>
        {MEDAL_EMOJI[position]}
      </span>
      <span className="score-row__name">{entry.name}</span>
      <div className="score-row__right">
        <span className="score-row__pts">{entry.score.toLocaleString()}</span>
        <span className="score-row__meta">{formatTime(entry.elapsedTime)} · {entry.difficulty}</span>
      </div>
    </motion.div>
  );
}

function useConfetti(active) {
  return useMemo(() => {
    if (!active) return [];
    const colors = [
      'var(--primary)', 'var(--primary-light)',
      'var(--accent)', 'var(--accent-light)',
      '#f5d4a0', '#ffd6c8',
    ];
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 1.2,
      duration: 2.0 + Math.random() * 1.5,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 8,
      round: Math.random() > 0.5,
    }));
  }, [active]);
}

export default function VictoryModal({
  isVisible,
  isGameOver = false,
  elapsedTime,
  errorCount,
  maxErrors,
  boardSize,
  difficulty,
  onNewGame,
  onBack,
  onRevive,
}) {
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newEntryIdx, setNewEntryIdx] = useState(-1);
  const [simulatingAd, setSimulatingAd] = useState(false);

  const myScore = useMemo(
    () =>
      isGameOver
        ? 0
        : calculateScore({ elapsedTime, errorCount, difficulty, boardSize }),
    [isGameOver, elapsedTime, errorCount, difficulty, boardSize]
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!isVisible || isGameOver) return;

      setLoading(true);
      const data = await fetchTopScores();
      if (mounted) {
        setScores(data);
        setLoading(false);
      }
    }

    if (isVisible) {
      setPlayerName('');
      setSaved(false);
      setNewEntryIdx(-1);
      load();
    }

    return () => { mounted = false; };
  }, [isVisible, isGameOver]);

  const qualifies = useMemo(() => {
    if (isGameOver || loading) return false;
    return (
      scores.length < MAX_SCORES ||
      myScore > (scores[scores.length - 1]?.score ?? 0)
    );
  }, [isGameOver, loading, scores, myScore]);

  const handleSave = async () => {
    const name = playerName.trim();
    if (!name || saving) return;

    setSaving(true);
    const success = await submitScore({
      name,
      score: myScore,
      elapsedTime,
      errorCount,
      difficulty,
      boardSize
    });

    if (success) {
      const updated = await fetchTopScores();
      const idx = updated.findIndex(s => s.name === name && s.score === myScore);

      setScores(updated);
      setNewEntryIdx(idx);
      setSaved(true);
    }

    setSaving(false);
  };

  const confetti = useConfetti(isVisible && !isGameOver);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {confetti.map(p => (
            <motion.div
              key={p.id}
              className="confetti-piece"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.round ? '50%' : '2px',
              }}
              initial={{ y: -20, opacity: 1 }}
              animate={{ y: '108vh', opacity: 0 }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
            />
          ))}

          <motion.div
            className="modal-card modal-card--victory"
            initial={{ scale: 0.84, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
          >
            <motion.div
              className={`modal-icon ${isGameOver ? 'modal-icon--gameover' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.28 }}
            >
              {isGameOver ? <XCircle size={36} /> : <Trophy size={36} />}
            </motion.div>

            <motion.h2
              className="modal-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
            >
              {isGameOver ? '¡Sin más vidas!' : '¡Completado!'}
            </motion.h2>

            <motion.p
              className="modal-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isGameOver
                ? 'Intentalo de nuevo, ¡vas a lograrlo!'
                : 'Resolviste el puzzle exitosamente.'}
            </motion.p>

            <motion.div
              className="modal-stats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
            >
              <div className="stat-item">
                <Clock size={15} className="stat-icon" />
                <span className="stat-label">Tiempo</span>
                <span className="stat-value">{formatTime(elapsedTime)}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <XCircle size={15} className="stat-icon" />
                <span className="stat-label">Errores</span>
                <span className="stat-value">{errorCount}/{maxErrors}</span>
              </div>
              {!isGameOver && (
                <>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <Star size={15} className="stat-icon" />
                    <span className="stat-label">Puntaje</span>
                    <span className="stat-value stat-value--score">
                      {myScore.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </motion.div>

            {!isGameOver && (
              <motion.div
                className="victory-leaderboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="section-label">
                  <Trophy size={13} /> Mejores puntajes
                </p>

                {loading ? (
                  <div className="victory-leaderboard--loading">
                    <div className="pastel-spinner"></div>
                  </div>
                ) : scores.length === 0 && !saved ? (
                  <p className="leaderboard-empty">Sé el primero en el podio 🏆</p>
                ) : (
                  <div className="score-list">
                    {scores.map((s, i) => (
                      <ScoreRow
                        key={`${s.name}-${i}`}
                        entry={s}
                        position={i}
                        isNew={saved && i === newEntryIdx}
                      />
                    ))}
                  </div>
                )}

                {!loading && !saved && (
                  <div className="name-entry">
                    {qualifies && (
                      <span className="record-badge">🏆 ¡Nuevo récord!</span>
                    )}
                    {!qualifies && scores.length >= MAX_SCORES && (
                      <span className="no-record-msg">
                        No alcanzaste el top 3 aún. ¡Seguí practicando!
                      </span>
                    )}
                    {(qualifies || scores.length < MAX_SCORES) && (
                      <div className="name-input-row">
                        <input
                          id="player-name-input"
                          className="name-input"
                          type="text"
                          placeholder="Tu nombre..."
                          value={playerName}
                          onChange={e => setPlayerName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSave()}
                          maxLength={20}
                          autoFocus
                          disabled={saving}
                        />
                        <motion.button
                          id="save-score-btn"
                          className="save-btn"
                          onClick={handleSave}
                          disabled={!playerName.trim() || saving}
                          whileHover={{ scale: (!playerName.trim() || saving) ? 1 : 1.05 }}
                          whileTap={{ scale: (!playerName.trim() || saving) ? 1 : 0.95 }}
                        >
                          {saving ? <div className="pastel-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Send size={14} />}
                          {saving ? 'Guardando...' : 'Guardar'}
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}

                {saved && (
                  <motion.p
                    className="saved-msg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✅ ¡Puntaje guardado!
                  </motion.p>
                )}
              </motion.div>
            )}

              <motion.div
                className="modal-actions"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58 }}
                style={{ flexDirection: 'column', gap: '0.75rem' }}
              >
                {isGameOver && (
                  <motion.button
                    className="modal-btn modal-btn--primary"
                    style={{ backgroundColor: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }}
                    onClick={() => {
                      setSimulatingAd(true);
                      setTimeout(() => {
                        setSimulatingAd(false);
                        onRevive();
                      }, 3000);
                    }}
                    disabled={simulatingAd}
                    whileHover={{ scale: simulatingAd ? 1 : 1.02 }}
                    whileTap={{ scale: simulatingAd ? 1 : 0.98 }}
                  >
                    {simulatingAd ? (
                      <div className="pastel-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                    ) : (
                      <Heart size={16} fill="white" />
                    )}
                    {simulatingAd ? 'Viendo anuncio...' : 'Revivir (Ver Ad)'}
                  </motion.button>
                )}
                
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <motion.button
                    id="victory-new-game"
                    className="modal-btn modal-btn--primary"
                    style={{ flex: 1 }}
                    onClick={onNewGame}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <RotateCcw size={16} />
                    Nuevo Juego
                  </motion.button>
                  <motion.button
                    id="victory-back"
                    className="modal-btn modal-btn--secondary"
                    style={{ flex: 1 }}
                    onClick={onBack}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Home size={16} />
                    Menú
                  </motion.button>
                </div>
              </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
