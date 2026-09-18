// Web Worker wrapper around the chess engine (chessAI.js). Running the (blocking)
// negamax search off the main thread keeps the board responsive during the
// multi-second thinks the stronger levels need. PlayVsComputer.jsx posts
// { id, fen, depth, noise, timeLimitMs }; we reply with { id, move }. The `id`
// (the game key at request time) lets the UI drop replies from a game that has
// since been reset or a move that's been superseded.

import { bestMove } from './chessAI';

self.onmessage = (event) => {
  const { id, fen, depth, noise, timeLimitMs } = event.data || {};
  let move = null;
  try {
    move = bestMove(fen, { depth, noise, timeLimitMs });
  } catch (error) {
    // Surface nothing playable rather than crashing the worker; the UI treats a
    // null move as "no reply" and the game simply waits (shouldn't happen for a
    // legal position with legal moves).
    move = null;
  }
  self.postMessage({ id, move });
};
