// A small in-browser chess engine for the play-vs-computer mode. Negamax with
// alpha-beta pruning, material + piece-square-table evaluation, MVV-LVA capture
// ordering, and an optional eval-noise term so the weaker levels blunder like a
// human beginner instead of playing perfectly at shallow depth. Nothing serious —
// runs on the main thread, depths kept low enough to feel instant.

import { Chess } from 'chess.js';

const PIECE_VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const MATE = 1_000_000;

// Piece-square tables (white's perspective, a1 = index 0 → a8 = 56). Encourage
// centralisation, developed knights/bishops, castled kings. Mirrored for black.
const PST = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, -20, -20, 10, 10, 5,
    5, -5, -10, 0, 0, -10, -5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, 5, 10, 25, 25, 10, 5, 5,
    10, 10, 20, 30, 30, 20, 10, 10,
    50, 50, 50, 50, 50, 50, 50, 50,
    0, 0, 0, 0, 0, 0, 0, 0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 0, 10, 10, 10, 10, 0, -10,
    -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -20, -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 5, 5, 0, 0, 0,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    5, 10, 10, 10, 10, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20,
    -10, 0, 5, 0, 0, 0, 0, -10,
    -10, 5, 5, 5, 5, 5, 0, -10,
    0, 0, 5, 5, 5, 5, 0, -5,
    -5, 0, 5, 5, 5, 5, 0, -5,
    -10, 0, 5, 5, 5, 5, 0, -10,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -20, -10, -10, -5, -5, -10, -10, -20,
  ],
  k: [
    20, 30, 10, 0, 0, 10, 30, 20,
    20, 20, 0, 0, 0, 0, 20, 20,
    -10, -20, -20, -20, -20, -20, -20, -10,
    -20, -30, -30, -40, -40, -30, -30, -20,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
  ],
};

const FILES = 'abcdefgh';
const squareIndex = (square) => (Number(square[1]) - 1) * 8 + FILES.indexOf(square[0]);

// Static evaluation from the perspective of the side to move (negamax convention).
function evaluate(game) {
  let score = 0;
  const board = game.board();
  for (const row of board) {
    for (const cell of row) {
      if (!cell) continue;
      const idx = squareIndex(cell.square);
      // Mirror vertically for black (rank r → 7-r, same file); PSTs are written
      // from white's perspective with rank 1 at index 0.
      const pstIdx = cell.color === 'w' ? idx : (7 - Math.floor(idx / 8)) * 8 + (idx % 8);
      const positional = PST[cell.type][pstIdx];
      const val = PIECE_VALUE[cell.type] + positional;
      score += cell.color === 'w' ? val : -val;
    }
  }
  return game.turn() === 'w' ? score : -score;
}

// MVV-LVA-ish ordering: try captures (high victim, low attacker) and promotions
// first so alpha-beta prunes more.
function orderMoves(moves) {
  return moves
    .map((m) => {
      let s = 0;
      if (m.captured) s += 10 * PIECE_VALUE[m.captured] - PIECE_VALUE[m.piece];
      if (m.promotion) s += PIECE_VALUE[m.promotion];
      return { m, s };
    })
    .sort((a, b) => b.s - a.s)
    .map((x) => x.m);
}

// Quiescence: at the leaf, keep searching captures/promotions only until the
// position is "quiet", so the engine doesn't stop mid-exchange and hang material.
function quiesce(game, alpha, beta, deadline) {
  const standPat = evaluate(game);
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;
  if (deadline && Date.now() > deadline) return alpha; // time-out: stop extending

  const tactical = game.moves({ verbose: true }).filter((m) => m.captured || m.promotion);
  for (const move of orderMoves(tactical)) {
    game.move(move);
    const score = -quiesce(game, -beta, -alpha, deadline);
    game.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function negamax(game, depth, alpha, beta, deadline) {
  if (game.isGameOver()) {
    if (game.isCheckmate()) return -MATE - depth; // prefer faster mates
    return 0; // stalemate / draw
  }
  if (depth === 0) return quiesce(game, alpha, beta, deadline);
  if (deadline && Date.now() > deadline) return evaluate(game); // time-out: graceful

  let best = -Infinity;
  for (const move of orderMoves(game.moves({ verbose: true }))) {
    game.move(move);
    const score = -negamax(game, depth - 1, -beta, -alpha, deadline);
    game.undo();
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

// Choose a move for the side to move via iterative deepening (bounded by a time
// budget so the strong level can't freeze the tab). `depth` is the target ply,
// `noise` adds a deterministic per-move eval jitter (centipawns) so weak levels
// make human-like errors. Returns { uci, san, from, to } or null (no legal move).
export function bestMove(fen, { depth = 2, noise = 0, timeLimitMs = 2500 } = {}) {
  const rootGame = new Chess(fen);
  const rootMoves = orderMoves(rootGame.moves({ verbose: true }));
  if (rootMoves.length === 0) return null;

  const deadline = Date.now() + timeLimitMs;
  let best = rootMoves[0];

  for (let d = 1; d <= depth; d += 1) {
    let alpha = -Infinity;
    let localBest = null;
    let localBestScore = -Infinity;
    let aborted = false;

    for (const move of rootMoves) {
      rootGame.move(move);
      let score = -negamax(rootGame, d - 1, -Infinity, -alpha, deadline);
      rootGame.undo();
      if (noise > 0) score += (pseudoRandom(fen + move.from + move.to) - 0.5) * 2 * noise;
      if (score > localBestScore) {
        localBestScore = score;
        localBest = move;
      }
      if (localBestScore > alpha) alpha = localBestScore;
      if (Date.now() > deadline) { aborted = true; break; }
    }

    if (localBest) best = localBest;
    if (aborted) break; // keep the last fully-searched depth's choice
  }

  return { uci: best.from + best.to + (best.promotion || ''), san: best.san, from: best.from, to: best.to };
}

// Deterministic hash-based jitter (avoids Math.random so the same position isn't
// re-evaluated differently on a re-render; keyed by fen+move it still varies per move).
function pseudoRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

// Strength presets exposed to the UI (slider stops).
export const AI_LEVELS = [
  { id: 1, label: 'Beginner', blurb: 'Sees one move ahead, blunders often', depth: 1, noise: 120, timeLimitMs: 400 },
  { id: 2, label: 'Casual', blurb: 'Looks two moves ahead', depth: 2, noise: 45, timeLimitMs: 800 },
  { id: 3, label: 'Club', blurb: 'Three-move search + captures', depth: 3, noise: 15, timeLimitMs: 1500 },
  { id: 4, label: 'Sharp', blurb: 'Deep search, clean tactics', depth: 4, noise: 0, timeLimitMs: 2500 },
];
