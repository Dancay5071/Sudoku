import React from 'react';
import { Edit2, LayoutGrid, Grid3x3 } from 'lucide-react';
import '../styles/animations.css';

export default function GameControls({ 
  boardSize, 
  setBoardSize, 
  isNotesMode, 
  toggleNotesMode,
  difficulty,
  setDifficulty
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div className="controls-container" style={{ marginBottom: 0, justifyContent: 'center' }}>
        <button 
          className={`control-btn ${boardSize === 9 ? 'active' : ''}`}
          onClick={() => setBoardSize(9)}
        >
          <Grid3x3 size={18} />
          Clásico 9x9
        </button>
        <button 
          className={`control-btn ${boardSize === 16 ? 'active' : ''}`}
          onClick={() => setBoardSize(16)}
        >
          <LayoutGrid size={18} />
          Hexadecimal 16x16
        </button>
        <button 
          className={`control-btn notes-toggle ${isNotesMode ? 'active' : ''}`}
          onClick={toggleNotesMode}
        >
          <Edit2 size={18} />
          Notas {isNotesMode ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="controls-container" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', alignSelf: 'center', marginRight: '0.5rem', fontWeight: 600 }}>Dificultad:</span>
        <button 
          className={`control-btn ${difficulty === 'Fácil' ? 'active' : ''}`}
          onClick={() => setDifficulty('Fácil')}
          style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
        >
          Fácil
        </button>
        <button 
          className={`control-btn ${difficulty === 'Medio' ? 'active' : ''}`}
          onClick={() => setDifficulty('Medio')}
          style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
        >
          Medio
        </button>
        <button 
          className={`control-btn ${difficulty === 'Difícil' ? 'active' : ''}`}
          onClick={() => setDifficulty('Difícil')}
          style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
        >
          Difícil
        </button>
      </div>
    </div>
  );
}
