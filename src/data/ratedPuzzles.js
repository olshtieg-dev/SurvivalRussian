// ELO-rated tactics puzzles sourced from the Lichess open puzzle database (CC0).
// 100 puzzles per 100-point rating bucket, 600 → 2200. Unlike the forced-mate set
// in chessPuzzles.js, these are general tactics (win material, mate, defend) and
// are judged by matching the stored solution line (see tacticsEngine.js).
//
// Each puzzle: { id, rating, startFen, setupMove, fen, sideToMove, solution[], themes[] }
// `startFen`+`setupMove` are the opponent's "hook" move played on load; `fen` is the
// position the solver actually faces (side-to-move === the human's colour).

import elo600 from './chess-puzzles/rated/elo-600.json';
import elo700 from './chess-puzzles/rated/elo-700.json';
import elo800 from './chess-puzzles/rated/elo-800.json';
import elo900 from './chess-puzzles/rated/elo-900.json';
import elo1000 from './chess-puzzles/rated/elo-1000.json';
import elo1100 from './chess-puzzles/rated/elo-1100.json';
import elo1200 from './chess-puzzles/rated/elo-1200.json';
import elo1300 from './chess-puzzles/rated/elo-1300.json';
import elo1400 from './chess-puzzles/rated/elo-1400.json';
import elo1500 from './chess-puzzles/rated/elo-1500.json';
import elo1600 from './chess-puzzles/rated/elo-1600.json';
import elo1700 from './chess-puzzles/rated/elo-1700.json';
import elo1800 from './chess-puzzles/rated/elo-1800.json';
import elo1900 from './chess-puzzles/rated/elo-1900.json';
import elo2000 from './chess-puzzles/rated/elo-2000.json';
import elo2100 from './chess-puzzles/rated/elo-2100.json';
import elo2200 from './chess-puzzles/rated/elo-2200.json';

// Bucket floor → puzzle list. Bucket B holds ratings [B, B+100).
const BUCKETS = {
  600: elo600, 700: elo700, 800: elo800, 900: elo900,
  1000: elo1000, 1100: elo1100, 1200: elo1200, 1300: elo1300,
  1400: elo1400, 1500: elo1500, 1600: elo1600, 1700: elo1700,
  1800: elo1800, 1900: elo1900, 2000: elo2000, 2100: elo2100, 2200: elo2200,
};

export const ELO_MIN = 600;
export const ELO_MAX = 2200;
export const ELO_STEP = 100;
export const ELO_BUCKETS = Object.keys(BUCKETS).map(Number).sort((a, b) => a - b);

// Snap an arbitrary rating to its bucket floor, clamped to the available range.
export function bucketFor(elo) {
  const snapped = Math.round(elo / ELO_STEP) * ELO_STEP;
  return Math.min(ELO_MAX, Math.max(ELO_MIN, snapped));
}

export function getPuzzlesByElo(elo) {
  return BUCKETS[bucketFor(elo)] || [];
}

// Random puzzle from the bucket for `elo`, avoiding the previous id when possible.
export function getRandomRatedPuzzle(elo, excludeId = null) {
  const pool = getPuzzlesByElo(elo);
  if (pool.length === 0) return null;
  const candidates = excludeId && pool.length > 1
    ? pool.filter((p) => p.id !== excludeId)
    : pool;
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}
