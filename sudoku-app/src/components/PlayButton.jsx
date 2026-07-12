import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon } from './icons';
import '../styles/animations.css';

export default function PlayButton({ onClick }) {
  return (
    <div className="play-btn-wrapper">
      <motion.button
        className="play-button"
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <PlayIcon size={20} aria-hidden="true" />
        Jugar
      </motion.button>
    </div>
  );
}
