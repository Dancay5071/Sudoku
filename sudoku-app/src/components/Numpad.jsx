import React from 'react';
import { motion } from 'framer-motion';
import { Delete, Edit3 } from 'lucide-react';
import '../styles/numpad.css';

export default function Numpad({ boardSize, onInput, onErase, isNotesMode, onToggleNotes, disabled }) {
  const isHex = boardSize === 16;
  const numbers = isHex 
    ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    : ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className={`numpad-container ${disabled ? 'numpad-disabled' : ''}`}>
      <div className={`numpad-grid ${isHex ? 'numpad-grid-hex' : 'numpad-grid-classic'}`}>
        {numbers.map((num) => (
          <motion.button
            key={num}
            className="numpad-btn numpad-btn-number"
            onClick={() => !disabled && onInput(num)}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            aria-label={`Ingresar ${num}`}
            disabled={disabled}
          >
            {num}
          </motion.button>
        ))}
        
        <motion.button
          className={`numpad-btn numpad-btn-action ${isNotesMode ? 'numpad-notes-active' : ''}`}
          onClick={() => !disabled && onToggleNotes()}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          aria-label="Alternar Notas"
          title="Modo Notas"
          disabled={disabled}
        >
          <Edit3 size={20} />
        </motion.button>

        <motion.button
          className="numpad-btn numpad-btn-action"
          onClick={() => !disabled && onErase()}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          aria-label="Borrar"
          title="Borrar"
          disabled={disabled}
        >
          <Delete size={20} />
        </motion.button>
      </div>
    </div>
  );
}
