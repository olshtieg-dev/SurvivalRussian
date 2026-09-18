'use client';

// Play a full game against the in-browser minimax engine (chessAI.js). Strength
// is a slider over AI_LEVELS (search depth + blunder-noise). The human plays the
// bottom colour; the engine replies asynchronously so the board stays responsive
// while it thinks.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, Cpu, Flag, RotateCcw } from 'lucide-react';
import ChessBoardView from './ChessBoardView';
import { AI_LEVELS, computeTimeBudget } from '../../lib/chessAI';

const PROMO_GLYPH = { q: '♛', r: '♜', b: '♝', n: '♞' };
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function kingInCheckSquare(game) {
  if (!game.isCheck()) return null;
  const turn = game.turn();
  for (const row of game.board()) {
    for (const cell of row) {
      if (cell && cell.type === 'k' && cell.color === turn) return cell.square;
    }
  }
  return null;
}

export default function PlayVsComputer({ onExit }) {
  const [levelId, setLevelId] = useState(2);
  const [humanColor, setHumanColor] = useState('w');
  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [resigned, setResigned] = useState(false);
  const gameKey = useRef(0); // bumped on new game to cancel stale async AI replies
  const workerRef = useRef(null); // the engine Web Worker (created client-side)
  const requestRef = useRef(0); // monotonic id so a slow reply for an old position is ignored

  const level = useMemo(() => AI_LEVELS.find((l) => l.id === levelId) || AI_LEVELS[1], [levelId]);
  const game = useMemo(() => new Chess(fen), [fen]);
  const checkSquare = kingInCheckSquare(game);
  const turn = game.turn();
  const isHumanTurn = turn === humanColor && !game.isGameOver() && !resigned;
  // The engine is "thinking" exactly when it's its turn and the game is live.
  const thinking = !resigned && !game.isGameOver() && turn !== humanColor;

  const clearSelection = () => { setSelected(null); setLegalTargets([]); };

  const newGame = useCallback((color = humanColor) => {
    gameKey.current += 1;
    setFen(START_FEN);
    setHumanColor(color);
    setSelected(null);
    setLegalTargets([]);
    setLastMove(null);
    setPendingPromotion(null);
    setResigned(false);
  }, [humanColor]);

  const doMove = useCallback((from, to, promotion) => {
    const g = new Chess(fen);
    let applied;
    try {
      applied = g.move({ from, to, promotion });
    } catch (error) {
      return false;
    }
    if (!applied) return false;
    setFen(g.fen());
    setLastMove({ from, to });
    clearSelection();
    return true;
  }, [fen]);

  // The engine search runs in a Web Worker so a multi-second think never freezes
  // the board. Created once on mount, torn down on unmount.
  useEffect(() => {
    const worker = new Worker(new URL('../../lib/chessAI.worker.js', import.meta.url));
    workerRef.current = worker;
    return () => { worker.terminate(); workerRef.current = null; };
  }, []);

  // Engine reply: whenever it's the computer's turn, ask the worker for a move and
  // apply it when it replies. The per-request id + gameKey guard drop replies for a
  // position that's been superseded (new game, resign, or a later turn).
  useEffect(() => {
    if (resigned || game.isGameOver()) return undefined;
    if (turn === humanColor) return undefined;
    const worker = workerRef.current;
    if (!worker) return undefined;

    const myKey = gameKey.current;
    const requestFen = fen;
    const reqId = (requestRef.current += 1);

    const handleMessage = (event) => {
      const { id, move } = event.data || {};
      if (id !== reqId) return; // a newer request has superseded this one
      worker.removeEventListener('message', handleMessage);
      if (gameKey.current !== myKey) return; // a new game started while thinking
      if (!move) return;
      const g = new Chess(requestFen);
      try {
        g.move({ from: move.from, to: move.to, promotion: move.uci.slice(4) || undefined });
      } catch (error) {
        return;
      }
      setFen(g.fen());
      setLastMove({ from: move.from, to: move.to });
    };

    worker.addEventListener('message', handleMessage);
    // Adaptive budget: think longer late in the game / when behind (capped per level).
    const engineColor = humanColor === 'w' ? 'b' : 'w';
    const timeLimitMs = computeTimeBudget(level, requestFen, engineColor);
    // Defer the post one frame so the human's move + "thinking" status paint first.
    const timer = setTimeout(() => {
      worker.postMessage({
        id: reqId,
        fen: requestFen,
        depth: level.depth,
        noise: level.noise,
        timeLimitMs,
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      worker.removeEventListener('message', handleMessage);
    };
  }, [fen, turn, humanColor, level, resigned, game]);

  const handleSquareClick = useCallback((square) => {
    if (!isHumanTurn) return;
    const piece = game.get(square);
    if (selected) {
      if (square === selected) { clearSelection(); return; }
      const matching = game.moves({ square: selected, verbose: true }).filter((m) => m.to === square);
      if (matching.length === 0) {
        if (piece && piece.color === humanColor) {
          setSelected(square);
          setLegalTargets(game.moves({ square, verbose: true }).map((m) => m.to));
        } else {
          clearSelection();
        }
        return;
      }
      if (matching.some((m) => m.promotion)) {
        setPendingPromotion({ from: selected, to: square });
        return;
      }
      doMove(selected, square, undefined);
      return;
    }
    if (piece && piece.color === humanColor) {
      setSelected(square);
      setLegalTargets(game.moves({ square, verbose: true }).map((m) => m.to));
    }
  }, [isHumanTurn, game, selected, humanColor, doMove]);

  // Status line.
  let statusText = `${turn === 'w' ? 'White' : 'Black'} to move`;
  let statusTone = 'text-slate-400';
  if (resigned) { statusText = 'You resigned.'; statusTone = 'text-rose-300'; }
  else if (game.isCheckmate()) {
    const loser = turn;
    const humanWon = loser !== humanColor;
    statusText = humanWon ? 'Checkmate — you win!' : 'Checkmate — the computer wins.';
    statusTone = humanWon ? 'text-emerald-300' : 'text-rose-300';
  } else if (game.isStalemate()) { statusText = 'Stalemate — draw.'; statusTone = 'text-amber-300'; }
  else if (game.isDraw()) { statusText = 'Draw.'; statusTone = 'text-amber-300'; }
  else if (thinking) { statusText = 'Computer is thinking…'; statusTone = 'text-indigo-300'; }
  else if (game.isCheck()) { statusText = `${turn === 'w' ? 'White' : 'Black'} is in check`; statusTone = 'text-rose-300'; }

  const gameOver = resigned || game.isGameOver();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Modes
        </button>
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
          <Cpu size={13} /> {level.label}
        </span>
      </div>

      {/* Strength slider */}
      <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Computer strength</span>
          <span className="text-sm font-black text-white">{level.label}</span>
        </div>
        <input
          type="range"
          min={AI_LEVELS[0].id}
          max={AI_LEVELS[AI_LEVELS.length - 1].id}
          step={1}
          value={levelId}
          onChange={(e) => setLevelId(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="mt-1 flex justify-between text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
          {AI_LEVELS.map((l) => <span key={l.id}>{l.label}</span>)}
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500">{level.blurb}</p>
      </div>

      <p className={`text-center text-xs font-semibold ${statusTone}`}>{statusText}</p>

      <div className="relative">
        <ChessBoardView
          board={game.board()}
          orientation={humanColor}
          selected={selected}
          legalTargets={legalTargets}
          lastMove={lastMove}
          checkSquare={checkSquare}
          interactive={isHumanTurn}
          onSquareClick={handleSquareClick}
        />

        {pendingPromotion && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Promote to</p>
              <div className="flex gap-2">
                {['q', 'r', 'b', 'n'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      const { from, to } = pendingPromotion;
                      setPendingPromotion(null);
                      doMove(from, to, p);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-3xl leading-none text-white transition-colors hover:border-indigo-400 hover:bg-indigo-600/20"
                  >
                    {PROMO_GLYPH[p]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => newGame(humanColor)}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-600/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 transition-colors hover:bg-emerald-600/20"
        >
          <RotateCcw size={13} /> New game
        </button>
        <button
          type="button"
          onClick={() => newGame(humanColor === 'w' ? 'b' : 'w')}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white"
        >
          Switch sides
        </button>
        {!gameOver && (
          <button
            type="button"
            onClick={() => setResigned(true)}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-rose-300"
          >
            <Flag size={13} /> Resign
          </button>
        )}
      </div>
    </div>
  );
}
