// Chess puzzle registry + per-difficulty behaviour config. Chopped-down fixture
// set (not a full tactics database) — a handful of solver-verified forced mates
// per tier.

import easyPuzzles from './chess-puzzles/easy.json';
import mediumPuzzles from './chess-puzzles/medium.json';
import hardPuzzles from './chess-puzzles/hard.json';
import expertPuzzles from './chess-puzzles/expert.json';

export const DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'expert'];

const PUZZLES = {
  easy: easyPuzzles,
  medium: mediumPuzzles,
  hard: hardPuzzles,
  expert: expertPuzzles,
};

// label, blurb, line length, scoring, hint policy, and (expert) a move timer.
export const DIFFICULTY_CONFIG = {
  easy: {
    id: 'easy',
    label: 'Easy',
    blurb: 'One-move tactics',
    lengthLabel: 'Mate in 1',
    accent: 'emerald',
    basePoints: 10,
    hintPolicy: 'auto', // reveal after a mistake
    maxHints: 1,
    timerSeconds: null,
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    blurb: 'Short 2-move combinations',
    lengthLabel: 'Mate in 2',
    accent: 'sky',
    basePoints: 25,
    hintPolicy: 'request', // one hint on demand
    maxHints: 1,
    timerSeconds: null,
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    blurb: 'Deeper mate-in-3 lines',
    lengthLabel: 'Mate in 3',
    accent: 'amber',
    basePoints: 50,
    hintPolicy: 'request',
    maxHints: 1,
    timerSeconds: null,
  },
  expert: {
    id: 'expert',
    label: 'Expert',
    blurb: 'High precision, timed',
    lengthLabel: 'Mate in 3',
    accent: 'rose',
    basePoints: 100,
    hintPolicy: 'none',
    maxHints: 0,
    timerSeconds: 60,
  },
};

export function getPuzzlesByDifficulty(difficulty) {
  return PUZZLES[difficulty] || [];
}

// Random puzzle from a tier, avoiding the previous id when possible. Falls back
// to any non-empty tier if the requested one is empty.
export function getRandomPuzzle(difficulty, excludeId = null) {
  let pool = getPuzzlesByDifficulty(difficulty);
  if (pool.length === 0) {
    const fallbackTier = DIFFICULTY_ORDER.find((tier) => getPuzzlesByDifficulty(tier).length > 0);
    pool = getPuzzlesByDifficulty(fallbackTier);
  }
  if (pool.length === 0) return null;

  const candidates = pool.length > 1 && excludeId
    ? pool.filter((puzzle) => puzzle.id !== excludeId)
    : pool;
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}

// Random puzzle across every tier (mixed mode).
export function getRandomPuzzleAnyTier(excludeId = null) {
  const all = DIFFICULTY_ORDER.flatMap(getPuzzlesByDifficulty);
  if (all.length === 0) return null;
  const candidates = excludeId ? all.filter((puzzle) => puzzle.id !== excludeId) : all;
  const list = candidates.length > 0 ? candidates : all;
  return list[Math.floor(Math.random() * list.length)];
}
