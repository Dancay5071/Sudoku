import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from './icons';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      className="header-action"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Alternar modo oscuro"
      title="Alternar modo oscuro"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        position: 'relative',
        width: '36px',
        height: '36px',
        overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute' }}
          >
            <SunIcon size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute' }}
          >
            <MoonIcon size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
