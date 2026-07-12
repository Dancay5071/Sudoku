import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { getValidKeys, valueToDisplay } from '../lib/gameUtils';

export default function NumberPad({ boardSize, onValueClick, onErase }) {
  const keys = getValidKeys(boardSize);
  const colCount = boardSize === 9 ? 3 : 4;

  return (
    <div className={`numpad numpad--${boardSize === 9 ? '9' : '16'}`}>
      <div
        className="numpad-grid"
        style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
      >
        {keys.map((key) => (
          <motion.button
            key={key}
            id={`numpad-key-${key}`}
            className="numpad-key"
            onClick={() => onValueClick(key)}
            whileHover={{ scale: 1.08, backgroundColor: 'var(--primary-light)' }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {key}
          </motion.button>
        ))}
      </div>

      <motion.button
        id="numpad-erase"
        className="numpad-erase"
        onClick={onErase}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Delete size={18} />
        Borrar
      </motion.button>
    </div>
  );
}
