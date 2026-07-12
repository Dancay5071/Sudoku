import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { fetchTopScores } from '../lib/leaderboard';
import { formatTime } from '../lib/gameUtils';

const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const data = await fetchTopScores();
      if (mounted) {
        setScores(data);
        setLoading(false);
      }
    }

    load();

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="lb-card lb-card--loading">
        <div className="pastel-spinner"></div>
      </div>
    );
  }

  if (scores.length === 0) return null;

  return (
    <div className="lb-card">
      <div className="lb-card__header">
        <Trophy size={13} />
        <span>Mejores puntajes</span>
      </div>

      <div className="lb-card__list">
        {scores.map((entry, i) => (
          <div key={i} className="lb-card__row">
            <span className="lb-card__medal">{MEDAL_EMOJI[i]}</span>
            <span className="lb-card__name">{entry.name}</span>
            <span className="lb-card__score">{entry.score.toLocaleString()}</span>
            <span className="lb-card__meta">
              {formatTime(entry.elapsedTime)} · {entry.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
