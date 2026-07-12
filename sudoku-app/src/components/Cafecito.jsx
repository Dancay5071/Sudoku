import React from 'react';
import { PortfolioIcon, CafecitoIcon, LeaderboardIcon } from './icons';
import { motion } from 'framer-motion';
import '../styles/animations.css';

export function PortfolioAction({ portfolioUrl = '#', isPlaying = false }) {
  return (
    <motion.a
      href={portfolioUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="header-action header-action--portfolio"
      title="Ver Portfolio de Daniela Cabrera"
      aria-label="Ver Portfolio"
      animate={{ opacity: isPlaying ? 0.4 : 1, x: 0, y: 0 }}
      whileHover={{ opacity: 1, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <PortfolioIcon size={14} aria-hidden="true" />
      <span className="header-action__label">Portfolio</span>
    </motion.a>
  );
}

export function CafecitoAction({ cafecitoUrl = 'https://cafecito.app', isPlaying = false }) {
  return (
    <motion.a
      href={cafecitoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`header-action header-action--cafecito ${!isPlaying ? 'header-action--pulse' : ''}`}
      aria-label="Invitar un cafecito — apoyá el proyecto"
      animate={{ opacity: isPlaying ? 0.4 : 1, x: 0, y: 0 }}
      whileHover={{ opacity: 1, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <CafecitoIcon size={14} aria-hidden="true" />
      <span className="header-action__label">Cafecito</span>
    </motion.a>
  );
}

export function LeaderboardAction({ onClick, isPlaying = false }) {
  return (
    <motion.button
      onClick={onClick}
      className="header-action header-action--leaderboard"
      title="Ver Mejores Puntajes"
      aria-label="Ver Mejores Puntajes"
      animate={{ opacity: isPlaying ? 0.4 : 1, x: 0, y: 0 }}
      whileHover={{ opacity: 1, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <LeaderboardIcon size={14} aria-hidden="true" />
      <span className="header-action__label">Puntajes</span>
    </motion.button>
  );
}
