// Solve-loop logic for the ELO-rated tactics puzzles. Correctness is judged
// against the stored Lichess solution line (these are general tactics, not just
// mates, so mate-search can't validate them). An alternative move is accepted
// only when it also delivers immediate checkmate (covers multiple mating moves
// on the final ply).

import { Chess } from 'chess.js';

export const toUci = (move) => move.from + move.to + (move.promotion || '');

export const uciSquares = (uci) => [uci.slice(0, 2), uci.slice(2, 4)];

// Apply the opponent's scripted reply (a UCI from the solution line) to `fen`.
// Returns { uci, san, from, to, nextFen, mate } or null if illegal.
export function applyLineMove(fen, uci) {
  const game = new Chess(fen);
  let applied;
  try {
    applied = game.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.slice(4) || undefined });
  } catch (error) {
    return null;
  }
  if (!applied) return null;
  return {
    uci,
    san: applied.san,
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    nextFen: game.fen(),
    mate: game.isCheckmate(),
  };
}

// Evaluate a human move against the expected solution move.
// Returns { illegal } | { correct, mate, nextFen, san, uci }.
export function evaluateTacticMove(fen, move, expectedUci) {
  const game = new Chess(fen);
  let applied;
  try {
    applied = game.move(move);
  } catch (error) {
    return { illegal: true };
  }
  if (!applied) return { illegal: true };

  const uci = toUci(applied);
  const mate = game.isCheckmate();
  // Correct = matches the stored line, or is any alternative immediate mate.
  const correct = uci === expectedUci || mate;

  return { correct, mate, nextFen: game.fen(), san: applied.san, uci };
}
