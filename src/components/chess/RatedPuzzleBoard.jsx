'use client';

// ELO-rated tactics mode. An ELO slider picks a rating bucket (600–2200); each
// puzzle is solved by playing the stored Lichess solution line, with the opponent
// auto-replying from that line. Reuses ChessBoardView + the promotion picker.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, CheckCircle2, Lightbulb, RotateCcw, SkipForward, XCircle } from 'lucide-react';
import ChessBoardView from './ChessBoardView';
import {
  ELO_MIN,
  ELO_MAX,
  ELO_STEP,
  bucketFor,
  getRandomRatedPuzzle,
} from '../../data/ratedPuzzles';
import { applyLineMove, evaluateTacticMove, uciSquares } from '../../lib/tacticsEngine';

const PROMO_GLYPH = { q: '♛', r: '♜', b: '♝', n: '♞' };

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

export default function RatedPuzzleBoard({ onExit }) {
  const [elo, setElo] = useState(1000);
  const [puzzle, setPuzzle] = useState(null);
  const [fen, setFen] = useState(null);
  const [ply, setPly] = useState(0); // index into puzzle.solution — next human move
  const [status, setStatus] = useState('solving'); // solving | opponent | done
  const [outcome, setOutcome] = useState(null); // solved | failed | skipped

  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [hintSquares, setHintSquares] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const [mistakes, setMistakes] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', tone: 'solving' });
  const [solvedCount, setSolvedCount] = useState(0);

  const game = useMemo(() => (fen ? new Chess(fen) : null), [fen]);
  const humanColor = puzzle?.sideToMove || 'w';
  const checkSquare = game ? kingInCheckSquare(game) : null;

  const clearSelection = () => {
    setSelected(null);
    setLegalTargets([]);
  };

  const loadPuzzle = useCallback((nextElo, excludeId) => {
    const next = getRandomRatedPuzzle(nextElo, excludeId);
    if (!next) return;
    setPuzzle(next);
    setFen(next.fen);
    setPly(0);
    setStatus('solving');
    setOutcome(null);
    setSelected(null);
    setLegalTargets([]);
    setLastMove(next.setupMove ? { from: next.setupMove.slice(0, 2), to: next.setupMove.slice(2, 4) } : null);
    setHintSquares([]);
    setPendingPromotion(null);
    setMistakes(0);
    setUsedHint(false);
    setFeedback({ text: `${next.sideToMove === 'w' ? 'White' : 'Black'} to play — find the best move.`, tone: 'solving' });
  }, []);

  // Reset the current puzzle back to its start (Restart button).
  const restartPuzzle = useCallback(() => {
    if (!puzzle) return;
    setFen(puzzle.fen);
    setPly(0);
    setStatus('solving');
    setOutcome(null);
    clearSelection();
    setLastMove(puzzle.setupMove ? { from: puzzle.setupMove.slice(0, 2), to: puzzle.setupMove.slice(2, 4) } : null);
    setHintSquares([]);
    setPendingPromotion(null);
    setMistakes(0);
    setUsedHint(false);
    setFeedback({ text: `${humanColor === 'w' ? 'White' : 'Black'} to play — find the best move.`, tone: 'solving' });
  }, [puzzle, humanColor]);

  // Load the first puzzle on mount.
  useEffect(() => {
    loadPuzzle(1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishSolved = useCallback(() => {
    setSolvedCount((c) => c + 1);
    setStatus('done');
    setOutcome('solved');
    setFeedback({ text: 'Solved!', tone: 'correct' });
  }, []);

  const applyHumanMove = useCallback((from, to, promotion) => {
    setHintSquares([]);
    const expected = puzzle.solution[ply];
    const result = evaluateTacticMove(fen, { from, to, promotion }, expected);
    if (result.illegal) {
      clearSelection();
      return;
    }
    if (!result.correct) {
      setMistakes((m) => m + 1);
      clearSelection();
      setFeedback({ text: "Not the best move — that's not the solution.", tone: 'mistake' });
      return;
    }
    // Correct.
    clearSelection();
    setLastMove({ from, to });
    setFen(result.nextFen);
    if (result.mate || ply + 1 >= puzzle.solution.length) {
      finishSolved();
      return;
    }
    setPly((p) => p + 1);
    setStatus('opponent');
    setFeedback({ text: 'Good — keep going.', tone: 'correct' });
  }, [fen, ply, puzzle, finishSolved]);

  // Auto-opponent: play the scripted reply from the solution line.
  useEffect(() => {
    if (status !== 'opponent' || !fen || !puzzle) return undefined;
    const replyUci = puzzle.solution[ply];
    if (!replyUci) { setStatus('solving'); return undefined; }
    const timer = setTimeout(() => {
      const reply = applyLineMove(fen, replyUci);
      if (!reply) { setStatus('solving'); return; }
      setFen(reply.nextFen);
      setLastMove({ from: reply.from, to: reply.to });
      setPly((p) => p + 1);
      setStatus('solving');
      setFeedback({ text: 'Your move.', tone: 'solving' });
    }, 380);
    return () => clearTimeout(timer);
  }, [status, fen, ply, puzzle]);

  const handleSquareClick = useCallback((square) => {
    if (status !== 'solving' || !game || game.turn() !== humanColor) return;
    const piece = game.get(square);

    if (selected) {
      if (square === selected) { clearSelection(); return; }
      const moves = game.moves({ square: selected, verbose: true });
      const matching = moves.filter((m) => m.to === square);
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
      applyHumanMove(selected, square, undefined);
      return;
    }

    if (piece && piece.color === humanColor) {
      setSelected(square);
      setLegalTargets(game.moves({ square, verbose: true }).map((m) => m.to));
    }
  }, [status, game, humanColor, selected, applyHumanMove]);

  const requestHint = useCallback(() => {
    if (status !== 'solving' || !puzzle) return;
    const [from] = uciSquares(puzzle.solution[ply]);
    setHintSquares([from]);
    setUsedHint(true);
    setFeedback({ text: 'Hint: move the highlighted piece.', tone: 'hint' });
  }, [status, puzzle, ply]);

  const bucket = bucketFor(elo);
  const FEEDBACK_STYLES = {
    solving: 'text-slate-400',
    correct: 'text-emerald-300',
    mistake: 'text-rose-300',
    hint: 'text-amber-300',
  };

  if (!puzzle || !game) {
    return <div className="p-8 text-center text-sm text-slate-400">Loading puzzles…</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      {/* Header: back + ELO slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white"
          >
            <ArrowLeft size={14} /> Modes
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {solvedCount} solved
          </span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Rating</span>
            <span className="text-sm font-black tabular-nums text-white">{bucket}–{bucket + 99}</span>
          </div>
          <input
            type="range"
            min={ELO_MIN}
            max={ELO_MAX}
            step={ELO_STEP}
            value={elo}
            onChange={(e) => setElo(Number(e.target.value))}
            onMouseUp={() => loadPuzzle(elo)}
            onTouchEnd={() => loadPuzzle(elo)}
            className="w-full accent-indigo-500"
          />
          <div className="mt-1 flex justify-between text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
            <span>{ELO_MIN} easy</span>
            <span>{ELO_MAX} hard</span>
          </div>
        </div>
      </div>

      {/* Feedback + controls */}
      <div className="flex items-center justify-between gap-3">
        <p className={`text-xs font-semibold ${FEEDBACK_STYLES[feedback.tone]}`}>{feedback.text}</p>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {mistakes} {mistakes === 1 ? 'miss' : 'misses'}
        </span>
      </div>

      <div className="relative">
        <ChessBoardView
          board={game.board()}
          orientation={humanColor}
          selected={selected}
          legalTargets={legalTargets}
          lastMove={lastMove}
          checkSquare={checkSquare}
          hintSquares={hintSquares}
          interactive={status === 'solving'}
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
                      applyHumanMove(from, to, p);
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

        {status === 'done' && outcome && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm">
            <div className="w-full max-w-xs rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
              {outcome === 'solved' ? (
                <CheckCircle2 size={40} className="mx-auto text-emerald-300" />
              ) : (
                <XCircle size={40} className="mx-auto text-slate-300" />
              )}
              <h3 className="mt-3 text-base font-black uppercase tracking-[0.25em] text-white">
                {outcome === 'solved' ? 'Solved' : 'Skipped'}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Rated {puzzle.rating}
                {usedHint ? ' · used a hint' : ''}
                {mistakes ? ` · ${mistakes} ${mistakes === 1 ? 'miss' : 'misses'}` : ''}
              </p>
              <button
                type="button"
                onClick={() => loadPuzzle(elo, puzzle.id)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-600/15 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-200 transition-colors hover:bg-indigo-600/25"
              >
                Next puzzle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={requestHint}
          disabled={status !== 'solving'}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-600/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200 transition-colors hover:bg-amber-600/20 disabled:opacity-30"
        >
          <Lightbulb size={13} /> Hint
        </button>
        <button
          type="button"
          onClick={restartPuzzle}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white"
        >
          <RotateCcw size={13} /> Restart
        </button>
        <button
          type="button"
          onClick={() => { setStatus('done'); setOutcome('skipped'); }}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white"
        >
          <SkipForward size={13} /> Skip
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-600">
        {puzzle.themes.slice(0, 3).join(' · ') || 'tactics'}
      </p>
    </div>
  );
}
