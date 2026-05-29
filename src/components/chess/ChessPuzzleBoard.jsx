'use client';

// Chess puzzle controller. Owns session score, the active puzzle, and the solve
// loop. Correctness is judged by the engine (any move that still forces mate is
// accepted); the opponent auto-replies with its most stubborn defense.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import ChessBoardView from './ChessBoardView';
import PuzzleDifficultyPicker from './PuzzleDifficultyPicker';
import PuzzleHUD from './PuzzleHUD';
import PuzzleResultOverlay from './PuzzleResultOverlay';
import {
  DIFFICULTY_CONFIG,
  getRandomPuzzle,
  getRandomPuzzleAnyTier,
} from '../../data/chessPuzzles';
import {
  chooseDefense,
  evaluatePlayerMove,
  hintMove,
  mateDistance,
} from '../../lib/chessPuzzleEngine';

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

export default function ChessPuzzleBoard() {
  const [mode, setMode] = useState(null); // selected tier or 'random'; null = picker
  const [puzzle, setPuzzle] = useState(null);
  const [fen, setFen] = useState(null);
  const [budget, setBudget] = useState(null); // current forced-mate distance for the human
  const [status, setStatus] = useState('menu'); // menu | solving | opponent | done
  const [outcome, setOutcome] = useState(null); // solved | failed | skipped | timeout

  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [hintSquares, setHintSquares] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const [mistakes, setMistakes] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(0);
  const [feedback, setFeedback] = useState({ text: '', tone: 'solving' });
  const [timeLeft, setTimeLeft] = useState(null);

  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);

  const activeDifficulty = puzzle?.difficulty || (mode !== 'random' ? mode : 'easy');
  const config = DIFFICULTY_CONFIG[activeDifficulty] || DIFFICULTY_CONFIG.easy;

  const game = useMemo(() => (fen ? new Chess(fen) : null), [fen]);
  const humanColor = puzzle?.sideToMove || 'w';
  const checkSquare = game ? kingInCheckSquare(game) : null;

  const clearSelection = () => {
    setSelected(null);
    setLegalTargets([]);
  };

  const loadPuzzle = useCallback((nextPuzzle, nextMode) => {
    if (!nextPuzzle) return;
    const cfg = DIFFICULTY_CONFIG[nextPuzzle.difficulty] || DIFFICULTY_CONFIG.easy;
    setPuzzle(nextPuzzle);
    if (nextMode !== undefined) setMode(nextMode);
    setFen(nextPuzzle.fen);
    setBudget(nextPuzzle.mateIn || mateDistance(nextPuzzle.fen, 4) || 1);
    setStatus('solving');
    setOutcome(null);
    setSelected(null);
    setLegalTargets([]);
    setLastMove(null);
    setHintSquares([]);
    setPendingPromotion(null);
    setMistakes(0);
    setUsedHint(false);
    setHintsLeft(cfg.maxHints);
    setTimeLeft(cfg.timerSeconds);
    setPointsEarned(0);
    setFeedback({ text: `Find mate in ${nextPuzzle.mateIn}.`, tone: 'solving' });
  }, []);

  const selectDifficulty = useCallback((tier) => {
    const next = tier === 'random' ? getRandomPuzzleAnyTier() : getRandomPuzzle(tier);
    loadPuzzle(next, tier);
  }, [loadPuzzle]);

  const finishSolved = useCallback(() => {
    const base = config.basePoints;
    let pts = base;
    pts -= mistakes * Math.round(base * 0.25);
    if (usedHint) pts -= Math.round(base * 0.2);
    pts = Math.max(pts, Math.round(base * 0.2));
    if (config.timerSeconds && timeLeft > 0) pts += timeLeft;
    setPointsEarned(pts);
    setScore((s) => s + pts);
    setSolvedCount((c) => c + 1);
    setStatus('done');
    setOutcome('solved');
    setFeedback({ text: 'Checkmate!', tone: 'correct' });
  }, [config, mistakes, usedHint, timeLeft]);

  const applyHumanMove = useCallback((from, to, promotion) => {
    setHintSquares([]);
    const result = evaluatePlayerMove(fen, { from, to, promotion }, budget || 1);
    if (result.illegal) {
      clearSelection();
      return;
    }
    if (!result.correct) {
      setMistakes((m) => m + 1);
      clearSelection();
      setFeedback({
        text: result.stalemate
          ? 'That stalemates — find the mate instead.'
          : 'Not the mating idea. Try another move.',
        tone: 'mistake',
      });
      if (config.hintPolicy === 'auto') {
        const uci = hintMove(fen, 4);
        if (uci) setHintSquares([uci.slice(0, 2), uci.slice(2, 4)]);
      }
      return;
    }
    // Correct move.
    clearSelection();
    setLastMove({ from, to });
    if (result.mate) {
      setFen(result.nextFen);
      finishSolved();
      return;
    }
    setFen(result.nextFen);
    setBudget(result.mateLeft);
    setStatus('opponent');
    setFeedback({ text: 'Good — now finish it.', tone: 'correct' });
  }, [fen, budget, config, finishSolved]);

  // Auto-opponent: play the most stubborn defense after the human's correct move.
  useEffect(() => {
    if (status !== 'opponent' || !fen) return undefined;
    const timer = setTimeout(() => {
      const def = chooseDefense(fen, budget || 1);
      if (!def) {
        setStatus('solving');
        return;
      }
      setFen(def.nextFen);
      setLastMove({ from: def.uci.slice(0, 2), to: def.uci.slice(2, 4) });
      setBudget(def.mateLeft || mateDistance(def.nextFen, 4) || 1);
      setStatus('solving');
    }, 420);
    return () => clearTimeout(timer);
  }, [status, fen, budget]);

  // Expert countdown.
  useEffect(() => {
    if (status !== 'solving' || !config.timerSeconds) return undefined;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
        if (t <= 1) {
          clearInterval(id);
          setStatus('done');
          setOutcome('timeout');
          setFeedback({ text: "Time's up.", tone: 'mistake' });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, config.timerSeconds, puzzle]);

  const handleSquareClick = useCallback((square) => {
    if (status !== 'solving' || !game || game.turn() !== humanColor) return;
    const piece = game.get(square);

    if (selected) {
      if (square === selected) {
        clearSelection();
        return;
      }
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
    if (!fen || hintsLeft <= 0) return;
    const uci = hintMove(fen, 4);
    if (!uci) return;
    setHintSquares([uci.slice(0, 2), uci.slice(2, 4)]);
    setHintsLeft((h) => h - 1);
    setUsedHint(true);
    setFeedback({ text: 'Hint: try the highlighted move.', tone: 'hint' });
  }, [fen, hintsLeft]);

  const goMenu = () => {
    setMode(null);
    setPuzzle(null);
    setStatus('menu');
    setOutcome(null);
  };

  if (status === 'menu' || !puzzle) {
    return (
      <PuzzleDifficultyPicker
        onSelect={selectDifficulty}
        sessionScore={score}
        solvedCount={solvedCount}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <PuzzleHUD
        config={config}
        mateIn={budget}
        toMoveLabel={humanColor === 'w' ? 'White' : 'Black'}
        mistakes={mistakes}
        feedback={feedback.text}
        feedbackTone={feedback.tone}
        score={score}
        hintsLeft={hintsLeft}
        hintEnabled={config.hintPolicy !== 'none'}
        timeLeft={typeof timeLeft === 'number' ? timeLeft : undefined}
        onHint={requestHint}
        onSkip={() => {
          setStatus('done');
          setOutcome('skipped');
        }}
        onRestart={() => loadPuzzle(puzzle)}
      />

      <div className="relative">
        <ChessBoardView
          board={game?.board()}
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
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Promote to
              </p>
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
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-3xl leading-none text-white transition-colors hover:border-blue-400 hover:bg-blue-600/20"
                  >
                    {PROMO_GLYPH[p]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {status === 'done' && outcome && (
          <PuzzleResultOverlay
            outcome={outcome}
            difficulty={activeDifficulty}
            pointsEarned={pointsEarned}
            onSameDifficulty={() => {
              const next = mode === 'random'
                ? getRandomPuzzleAnyTier(puzzle.id)
                : getRandomPuzzle(mode, puzzle.id);
              loadPuzzle(next);
            }}
            onHarder={(tier) => loadPuzzle(getRandomPuzzle(tier), tier)}
            onMenu={goMenu}
          />
        )}
      </div>

      <p className="text-center text-[10px] text-slate-600">{puzzle.theme}</p>
    </div>
  );
}
