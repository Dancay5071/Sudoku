import React from 'react';
import { Grid3x3, Hash, Coffee, BarChart2, Info, Sun, Moon } from 'lucide-react';

const DEFAULTS = {
  width: 24,
  height: 24,
  strokeWidth: 1.25,
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

export function CafecitoIcon(props) { return <Coffee strokeWidth={1.25} {...props} /> }
export function SudokuGridIcon(props) { return <Grid3x3 strokeWidth={1.25} {...props} /> }
export function HexaGridIcon(props) { return <Hash strokeWidth={1.25} {...props} /> }
export function LeaderboardIcon(props) { return <BarChart2 strokeWidth={1.25} {...props} /> }
export function InfoIcon(props) { return <Info strokeWidth={1.25} {...props} /> }
export function SunIcon(props) { return <Sun strokeWidth={1.25} {...props} /> }
export function MoonIcon(props) { return <Moon strokeWidth={1.25} {...props} /> }
export function EraseIcon({ size = 20, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <path d="M21 16H9L3.5 10.5a2 2 0 0 1 0-2.83l5.17-5.17a2 2 0 0 1 2.83 0L17 8" />
      <path d="m5 5 14 14" />
    </Icon>
  );
}

export function PlayIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" strokeWidth="0" />
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
