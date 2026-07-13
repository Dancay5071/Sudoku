import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoIcon, XCircle } from 'lucide-react';

export default function InstructionsModal({ isVisible, onClose }) {
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
            className="modal-card"
            initial={{ scale: 0.84, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '700px', width: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '1.5rem' }}
          >
            <button 
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>

            <motion.div
              className="modal-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
              style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}
            >
              <InfoIcon size={32} />
            </motion.div>

            <motion.h2
              className="modal-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Cómo Jugar
            </motion.h2>

            <motion.div
              className="instructions-content"
              style={{ marginTop: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
                Completa el tablero sin repetir ningún símbolo en la misma fila, columna, o subcuadrícula.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Modos de Juego</h3>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong>Clásico 9×9:</strong> Usa números del <strong>1 al 9</strong>. Subcuadrículas de 3×3.
                    </li>
                    <li>
                      <strong>Hexadecimal 16×16:</strong> Usa números del <strong>0 al 9</strong> y letras <strong>A-F</strong>. Subcuadrículas de 4×4.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Mecánicas</h3>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Notas:</strong> Pulsa <kbd className="kbd">N</kbd> para activar notas y marcar candidatos.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Errores:</strong> Máximo de 3 errores permitidos.</li>
                    <li><strong>Controles:</strong> Selecciona y escribe con tu teclado. Borra con <kbd className="kbd">Backspace</kbd>.</li>
                  </ul>
                </div>
              </div>
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
                Volver
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
