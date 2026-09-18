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
// Bounded by `qdepth` and delta-pruned — an unbounded qsearch explodes in sharp
// positions (measured: >6s for a nominal depth-2 search), which made the deeper
// levels time out on every move.
const QMAX = 6; // hard ceiling on quiescence plies
const DELTA_MARGIN = 200; // skip captures that can't plausibly raise alpha (centipawns)

// `lastTo` (target square of the move that led here) makes the search
// recapture-focused: the first ply considers every capture, but deeper plies
// only follow recaptures onto that same square. Following ALL captures every ply
// is what made quiescence explode (measured >6s for a depth-2 search in the
// Italian); resolving the exchange on the contested square is what actually
// matters for not hanging material.
function quiesce(game, alpha, beta, deadline, qdepth = QMAX, lastTo = null) {
  const standPat = evaluate(game);
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;
  if (qdepth <= 0) return alpha; // depth cap: treat as quiet
  if (deadline && Date.now() > deadline) return alpha; // time-out: stop extending

  let tactical = game.moves({ verbose: true }).filter((m) => m.captured || m.promotion);
  if (lastTo) tactical = tactical.filter((m) => m.to === lastTo || m.promotion); // recaptures only
  for (const move of orderMoves(tactical)) {
    // Delta pruning: if even winning this piece (plus the promo margin) can't lift
    // us within DELTA_MARGIN of alpha, the whole capture is hopeless — skip it.
    const gain = (move.captured ? PIECE_VALUE[move.captured] : 0)
      + (move.promotion ? PIECE_VALUE[move.promotion] - PIECE_VALUE.p : 0);
    if (standPat + gain + DELTA_MARGIN < alpha) continue;
    game.move(move);
    const score = -quiesce(game, -beta, -alpha, deadline, qdepth - 1, move.to);
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

  const start = Date.now();
  const deadline = start + timeLimitMs;
  let best = rootMoves[0];
  let reached = 0; // deepest fully-completed ply (for tuning / diagnostics)
  let lastIterMs = 0; // wall time of the last completed depth, for time management

  for (let d = 1; d <= depth; d += 1) {
    // Time management: each extra ply costs roughly a branching-factor more. If the
    // previous depth already took long enough that the next almost certainly can't
    // finish, stop now and return it — otherwise the top level would burn its whole
    // budget every move on a depth it never completes.
    if (d > 1 && Date.now() + lastIterMs * 5 > deadline) break;
    const iterStart = Date.now();
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

    // Only commit a depth that FULLY completed. A partial depth's late root moves
    // carry timed-out static-eval scores, so committing it would clobber the last
    // good move with a semi-random one — the "dumb moves on Sharp" bug.
    if (aborted) break; // keep the last fully-searched depth's choice
    if (localBest) { best = localBest; reached = d; }
    lastIterMs = Date.now() - iterStart;
  }

  return { uci: best.from + best.to + (best.promotion || ''), san: best.san, from: best.from, to: best.to, depth: reached };
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

// Strength presets exposed to the UI (slider stops). Time budgets are generous
// because the search runs in a Web Worker (see chessAI.worker.js) — a long think
// no longer freezes the board. Iterative deepening returns the deepest FULLY
// completed depth within the budget, so a level that can't finish its target ply
// in a sharp position falls back cleanly to a shallower one (never a blunder).
//
// `timeLimitMs` is the baseline think time; `maxTimeLimitMs` is the ceiling the
// adaptive budget (computeTimeBudget) ramps toward deeper into the game and when
// the engine is behind. Every tier scales (roughly base → 2× base) so each one
// digs in a bit when pressed while staying ordered — even at full urgency
// Beginner < Casual < Club < Sharp. (Beginner is depth-1 capped, so its extra
// time is nominal — the search finishes well under a second regardless.)
export const AI_LEVELS = [
  { id: 1, label: 'Beginner', blurb: 'Sees one move ahead, blunders often', depth: 1, noise: 120, timeLimitMs: 1000, maxTimeLimitMs: 2000 },
  { id: 2, label: 'Casual', blurb: 'Looks a couple moves ahead, thinks a bit harder when pressed', depth: 2, noise: 45, timeLimitMs: 3000, maxTimeLimitMs: 6000 },
  { id: 3, label: 'Club', blurb: 'Three-move search, thinks harder when pressed', depth: 3, noise: 15, timeLimitMs: 6000, maxTimeLimitMs: 12000 },
  { id: 4, label: 'Sharp', blurb: 'Deep search; thinks up to 20s when losing or late', depth: 4, noise: 0, timeLimitMs: 10000, maxTimeLimitMs: 20000 },
];

// Adaptive think time: spend more of the level's budget deeper into the game and
// (weighted heavier) when the engine is behind on material — so it defends hard
// when losing and can coast in a won/early position. Returns a timeLimitMs in
// [base, max]. `engineColor` is the side the computer plays ('w' | 'b').
const FEN_PIECE_CP = { p: 100, n: 320, b: 330, r: 500, q: 900, P: 100, N: 320, B: 330, R: 500, Q: 900 };

export function computeTimeBudget(level, fen, engineColor) {
  const base = level.timeLimitMs;
  const max = level.maxTimeLimitMs ?? base;
  if (max <= base) return base;

  const [placement = '', , , , , fullmoveStr] = fen.split(' ');
  const fullmove = Number(fullmoveStr) || 1;

  // Material balance from the engine's perspective (centipawns, kings excluded).
  let diff = 0;
  for (const ch of placement) {
    const cp = FEN_PIECE_CP[ch];
    if (!cp) continue;
    const isWhite = ch === ch.toUpperCase();
    diff += (isWhite ? 'w' : 'b') === engineColor ? cp : -cp;
  }

  const deficitPawns = Math.max(0, -diff) / 100;
  const losing = Math.min(1, deficitPawns / 4); // down ~4 pawns → full urgency
  const progress = Math.min(1, Math.max(0, (fullmove - 6) / 34)); // ramps moves 6 → 40
  const urgency = Math.min(1, losing + 0.5 * progress); // deficit dominates, phase adds
  return Math.round(base + (max - base) * urgency);
}
