import React from 'react';

const DEFAULTS = {
  width: 24,
  height: 24,
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

function Icon({ children, size = 24, className = '', style = {}, ...props }) {
  return (
    <svg
      {...DEFAULTS}
      width={size}
      height={size}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </svg>
  );
}

export function PlayIcon({ size = 24, ...props }) {
  return (
    <Icon size={size} {...props}>
      <path d="M6 4.5L20 12L6 19.5V4.5Z" strokeLinejoin="round" />
    </Icon>
  );
}

export function PortfolioIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <path d="M14 3h7v7" />
      <path d="M21 3L11 13" />
    </Icon>
  );
}

export function CafecitoIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <path d="M6 8h10l-1.5 9a2 2 0 01-2 1.5H9.5a2 2 0 01-2-1.5L6 8Z" />
      <path d="M16 10h1.5a2.5 2.5 0 010 5H16" />
      <path d="M9 5c0-1 1-1.5 1-2.5" strokeLinecap="round" />
      <path d="M12 5c0-1 1-1.5 1-2.5" strokeLinecap="round" />
    </Icon>
  );
}

export function SudokuGridIcon({ size = 22, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </Icon>
  );
}

export function HexaGridIcon({ size = 22, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <line x1="7.5" y1="3" x2="7.5" y2="21" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="16.5" y1="3" x2="16.5" y2="21" />
      <line x1="3" y1="7.5" x2="21" y2="7.5" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="16.5" x2="21" y2="16.5" />
    </Icon>
  );
}

export function EraseIcon({ size = 20, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
      <path d="M6.5 17.5L15 9" />
    </Icon>
  );
}

export function NotesIcon({ size = 20, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5Z" />
    </Icon>
  );
}

export function LeaderboardIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Icon>
  );
}
