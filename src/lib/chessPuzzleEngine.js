// Forced-mate engine for the chess puzzle mode. Pure chess.js logic, no UI.
// Because "valid alternatives are okay", correctness is judged by whether a move
// preserves a forced mate (not by matching one stored line). The auto-opponent
// plays the most stubborn legal defense.

import { Chess } from 'chess.js';

export const toUci = (move) => move.from + move.to + (move.promotion || '');

// Does the side to move have a forced mate within `n` moves?
// Returns the principal variation as a UCI array, or null. Mutates+restores `chess`.
export function findMate(chess, n) {
  for (const move of chess.moves({ verbose: true })) {
    chess.move(move);
    if (chess.isCheckmate()) {
      chess.undo();
      return [toUci(move)];
    }
    let result = null;
    if (n > 1) {
      const replies = chess.moves({ verbose: true });
      if (replies.length > 0) {
        let allMate = true;
        let chosen = null;
        for (const reply of replies) {
          chess.move(reply);
          const sub = findMate(chess, n - 1);
          chess.undo();
          if (!sub) {
            allMate = false;
            break;
          }
          if (!chosen) chosen = [toUci(reply), ...sub];
        }
        if (allMate) result = [toUci(move), ...chosen];
      }
    }
    chess.undo();
    if (result) return result;
  }
  return null;
}

// Smallest n in [1..maxN] for which the side to move has a forced mate; else null.
function mateDistanceOn(chess, maxN) {
  for (let n = 1; n <= maxN; n += 1) {
    if (findMate(chess, n)) return n;
  }
  return null;
}

export function mateDistance(fen, maxN = 4) {
  return mateDistanceOn(new Chess(fen), maxN);
}

// First move of a forced mate from `fen` (used for hints). Returns UCI or null.
export function hintMove(fen, maxN = 4) {
  for (let n = 1; n <= maxN; n += 1) {
    const pv = findMate(new Chess(fen), n);
    if (pv) return pv[0];
  }
  return null;
}

// Evaluate a candidate player move. `budget` is the current forced-mate distance.
// Returns { correct, mate, illegal, stalemate, nextFen, san, mateLeft }.
export function evaluatePlayerMove(fen, move, budget) {
  const game = new Chess(fen);
  let applied = null;
  try {
    applied = game.move(move);
  } catch (error) {
    return { correct: false, illegal: true };
  }
  if (!applied) return { correct: false, illegal: true };

  if (game.isCheckmate()) {
    return { correct: true, mate: true, nextFen: game.fen(), san: applied.san };
  }

  // Opponent to move: the move is correct only if EVERY reply still leaves the
  // player a forced mate within budget-1.
  const replies = game.moves({ verbose: true });
  if (replies.length === 0) {
    return { correct: false, stalemate: true, san: applied.san };
  }

  let worst = 0;
  for (const reply of replies) {
    game.move(reply);
    const distance = mateDistanceOn(game, Math.max(1, budget - 1));
    game.undo();
    if (distance === null) {
      return { correct: false, san: applied.san };
    }
    if (distance > worst) worst = distance;
  }

  return { correct: true, mate: false, nextFen: game.fen(), san: applied.san, mateLeft: worst };
}

// Pick the opponent's most stubborn legal defense (maximises remaining mate depth).
// Returns { uci, san, nextFen, mateLeft, mate } or null when no legal move exists.
export function chooseDefense(fen, budget) {
  const game = new Chess(fen);
  const replies = game.moves({ verbose: true });
  if (replies.length === 0) return null;

  let best = null;
  for (const reply of replies) {
    game.move(reply);
    const mated = game.isCheckmate();
    const distance = mated ? 0 : mateDistanceOn(game, Math.max(1, budget));
    game.undo();
    const score = distance === null ? Number.POSITIVE_INFINITY : distance;
    if (best === null || score > best.score) {
      best = { reply, score };
    }
  }

  const after = new Chess(fen);
  const applied = after.move(best.reply);
  return {
    uci: toUci(best.reply),
    san: applied.san,
    nextFen: after.fen(),
    mateLeft: mateDistanceOn(after, 4),
    mate: after.isCheckmate(),
  };
}
