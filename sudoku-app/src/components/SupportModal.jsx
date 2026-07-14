import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, XCircle, ExternalLink, CreditCard } from 'lucide-react';

export default function SupportModal({ isVisible, onClose, cafecitoUrl = 'https://cafecito.app/dani5071' }) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(cafecitoUrl)}&color=000000&bgcolor=ffffff`;

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
            style={{ maxWidth: '400px', width: '95%', position: 'relative', padding: '1.5rem', textAlign: 'center' }}
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
              style={{ color: '#29B6F6', marginBottom: '0.5rem' }}
            >
              <Heart size={36} fill="#29B6F6" />
            </motion.div>

            <motion.h2
              className="modal-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ¡Apoyá el Proyecto!
            </motion.h2>

            <motion.p
              className="modal-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: '1.5rem' }}
            >
              Escaneá el QR con la cámara de tu celular para elegir la opción.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '12px',
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem'
              }}
            >
              <img src={qrCodeUrl} alt="QR Code Cafecito" style={{ display: 'block', width: '180px', height: '180px' }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <a
                href={cafecitoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn--primary"
                style={{ backgroundColor: '#29B6F6', color: 'white', borderColor: '#29B6F6', textDecoration: 'none' }}
              >
                <ExternalLink size={16} />
                Abrir Cafecito
              </a>

              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-medium)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <CreditCard size={14} /> Transferencia Directa
                </p>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.5px' }}>
                  dani5071
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
