import { supabase } from './supabaseClient';

export const MAX_SCORES = 3;
const ERROR_PENALTY = 200;
const MIN_SCORE = 100;

const BASE_SCORE = {
  9: { 'Fácil': 3_000, 'Medio': 5_000, 'Difícil': 8_000 },
  16: { 'Fácil': 5_000, 'Medio': 8_000, 'Difícil': 12_000 },
};

const VALID_DIFFICULTIES = new Set(['Fácil', 'Medio', 'Difícil']);
const VALID_BOARD_SIZES = new Set([9, 16]);

function sanitizeName(raw) {
  return raw
    .trim()
    .slice(0, 20)
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F]/g, '')
    .trim();
}

function validateEntry(entry) {
  const { name, score, elapsedTime, errorCount, difficulty, boardSize } = entry;

  if (!name || name.length === 0) return { valid: false, reason: 'empty name' };
  if (!VALID_DIFFICULTIES.has(difficulty)) return { valid: false, reason: 'invalid difficulty' };
  if (!VALID_BOARD_SIZES.has(boardSize)) return { valid: false, reason: 'invalid boardSize' };
  if (!Number.isInteger(elapsedTime) || elapsedTime < 0) return { valid: false, reason: 'invalid time' };
  if (!Number.isInteger(errorCount) || errorCount < 0 || errorCount > 3) return { valid: false, reason: 'invalid errorCount' };

  const maxPossible = BASE_SCORE[boardSize]?.[difficulty] ?? 3_000;
  if (score < MIN_SCORE || score > maxPossible) {
    return { valid: false, reason: `score ${score} out of expected range [${MIN_SCORE}, ${maxPossible}]` };
  }

  return { valid: true };
}

export function calculateScore({ elapsedTime, errorCount, difficulty, boardSize }) {
  const base = BASE_SCORE[boardSize]?.[difficulty] ?? 3_000;
  return Math.max(MIN_SCORE, base - elapsedTime - errorCount * ERROR_PENALTY);
}

const LOCAL_STORAGE_KEY = 'sudoku_local_leaderboard';

function getLocalScores(boardSize, difficulty) {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    let scores = data ? JSON.parse(data) : [];
    if (boardSize) scores = scores.filter(s => s.boardSize === boardSize);
    if (difficulty) scores = scores.filter(s => s.difficulty === difficulty);
    return scores;
  } catch {
    return [];
  }
}

function saveLocalScore(entry) {
  try {
    const current = getLocalScores();
    current.push({
      ...entry,
      date: new Date().toISOString().slice(0, 10),
    });
    current.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.elapsedTime - b.elapsedTime;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current.slice(0, MAX_SCORES)));
    return true;
  } catch {
    return false;
  }
}

export async function fetchTopScores(boardSize, difficulty) {
  try {
    let query = supabase
      .from('high_scores')
      .select('name, score, elapsed_time, error_count, difficulty, board_size, created_at');
      
    if (boardSize) query = query.eq('board_size', boardSize);
    if (difficulty) query = query.eq('difficulty', difficulty);

    const { data, error } = await query
      .order('score', { ascending: false })
      .order('elapsed_time', { ascending: true })
      .limit(MAX_SCORES);

    if (error) throw error;
    const parsedData = (data ?? []).map(row => ({
      name: row.name,
      score: row.score,
      elapsedTime: row.elapsed_time,
      errorCount: row.error_count,
      difficulty: row.difficulty,
      boardSize: row.board_size,
      date: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    }));

    return parsedData;

  } catch (err) {
    console.warn('[leaderboard] Supabase fetch failed. Falling back to LocalStorage.', err.message);
    return getLocalScores(boardSize, difficulty);
  }
}

export async function submitScore(entry) {
  const name = sanitizeName(entry.name);
  const sanitized = { ...entry, name };

  const { valid, reason } = validateEntry(sanitized);
  if (!valid) {
    console.warn('[leaderboard] submitScore blocked — invalid entry:', reason, sanitized);
    return false;
  }

  try {
    const { error } = await supabase
      .from('high_scores')
      .insert([{
        name: sanitized.name,
        score: sanitized.score,
        elapsed_time: sanitized.elapsedTime,
        error_count: sanitized.errorCount,
        difficulty: sanitized.difficulty,
        board_size: sanitized.boardSize,
      }]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('[leaderboard] Supabase insert failed. Falling back to LocalStorage.', err.message);
    return saveLocalScore(sanitized);
  }
}
