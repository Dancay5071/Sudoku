import React from 'react';
import '../styles/hint-button.css';

const SIZE = 72;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 30;
const SW = 3;
const CIRCUMF = +(2 * Math.PI * R).toFixed(4);

function BulbIcon() {
  return (
    <g
      className="hint-bulb-icon"
      transform={`translate(${CX - 10}, ${CY - 11})`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 1a7 7 0 0 1 5 11.94c-.9.94-1.5 2.06-1.5 3.06H6.5c0-1-.6-2.12-1.5-3.06A7 7 0 0 1 10 1z" />
      <line x1="6.5" y1="16" x2="13.5" y2="16" />
      <line x1="7" y1="18.5" x2="13" y2="18.5" />
      <line x1="8.5" y1="21" x2="11.5" y2="21" />
    </g>
  );
}

export default function HintButton({
  onHint,
  isOnCooldown,
  cooldownRemaining,
  elapsedFraction = 0,
  totalCooldown,
  justReady,
  disabled = false,
}) {
  const isDisabled = isOnCooldown || disabled;

  const dashOffset = +(CIRCUMF * elapsedFraction).toFixed(3);

  return (
    <div
      className={[
        'hint-btn-wrapper',
        isOnCooldown ? 'hint-btn-wrapper--cooldown' : 'hint-btn-wrapper--ready',
        justReady ? 'hint-btn-wrapper--just-ready' : '',
      ].filter(Boolean).join(' ')}
    >
      <svg
        className="hint-ring-svg"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
      >
        <circle
          className="hint-ring-track"
          cx={CX} cy={CY} r={R}
          fill="none"
          strokeWidth={SW}
        />
        {isOnCooldown && (
          <circle
            className="hint-ring-progress"
            cx={CX} cy={CY} r={R}
            fill="none"
            strokeWidth={SW}
            strokeLinecap="round"
            strokeDasharray={CIRCUMF}
            strokeDashoffset={dashOffset}
          />
        )}
        {!isOnCooldown && (
          <circle
            className="hint-ring-ready-indicator"
            cx={CX} cy={CY} r={R}
            fill="none"
            strokeWidth={SW}
          />
        )}

        {!isOnCooldown && <BulbIcon />}

        {isOnCooldown && (
          <text
            className="hint-countdown-text"
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {cooldownRemaining}
            <tspan className="hint-countdown-unit" dx="0.5">s</tspan>
          </text>
        )}
      </svg>

      <button
        id="hint-btn"
        className="hint-btn"
        onClick={isDisabled ? undefined : onHint}
        disabled={isDisabled}
        title={
          isOnCooldown
            ? `Pista disponible en ${cooldownRemaining}s`
            : 'Obtener una pista (cooldown: 60 s)'
        }
        aria-label={
          isOnCooldown
            ? `Pista en recarga — ${cooldownRemaining} segundos`
            : 'Obtener pista'
        }
        aria-disabled={isDisabled}
      />

      <span className="hint-btn-label" aria-hidden="true">
        {isOnCooldown ? 'Recarga' : 'Pista'}
      </span>
    </div>
  );
}
