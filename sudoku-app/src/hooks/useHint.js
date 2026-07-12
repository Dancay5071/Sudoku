import { useState, useEffect, useRef, useCallback } from 'react';

const COOLDOWN_SECONDS = 60;

export default function useHint() {
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [elapsedFraction, setElapsedFraction] = useState(0);
  const [justReady, setJustReady] = useState(false);

  const intervalRef = useRef(null);
  const readyFlagRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (readyFlagRef.current) clearTimeout(readyFlagRef.current);
    };
  }, []);

  const triggerCooldown = useCallback(() => {
    if (intervalRef.current) return;

    startTimeRef.current = performance.now();
    setCooldownRemaining(COOLDOWN_SECONDS);
    setElapsedFraction(0);

    intervalRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const fraction = Math.min(elapsed / COOLDOWN_SECONDS, 1);
      const remaining = Math.max(0, Math.ceil(COOLDOWN_SECONDS - elapsed));

      setElapsedFraction(fraction);
      setCooldownRemaining(remaining);

      if (fraction >= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        setJustReady(true);
        readyFlagRef.current = setTimeout(() => setJustReady(false), 700);
      }
    }, 100);
  }, []);

  return {
    isOnCooldown: cooldownRemaining > 0,
    cooldownRemaining,
    elapsedFraction,
    justReady,
    triggerCooldown,
    totalCooldown: COOLDOWN_SECONDS,
  };
}
