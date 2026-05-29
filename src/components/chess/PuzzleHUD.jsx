'use client';

// Heads-up display for an active puzzle: tier, side to move, remaining mate
// distance, mistakes, hint/skip controls, score, and (expert) a countdown.

import React from 'react';
import { Lightbulb, RotateCcw, SkipForward, Timer } from 'lucide-react';

const FEEDBACK_STYLES = {
  solving: 'text-slate-400',
  correct: 'text-emerald-300',
  mistake: 'text-rose-300',
  hint: 'text-amber-300',
};

// Static so Tailwind's JIT keeps them (no dynamic class interpolation).
const TIER_BADGE = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
};

export default function PuzzleHUD({
  config,
  mateIn,
  toMoveLabel,
  mistakes,
  feedback,
  feedbackTone = 'solving',
  score,
  hintsLeft,
  hintEnabled,
  timeLeft,
  onHint,
  onSkip,
  onRestart,
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${TIER_BADGE[config.accent] || TIER_BADGE.emerald}`}
          >
            {config.label}
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            Mate in {mateIn ?? '?'}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {toMoveLabel} to move
          </span>
        </div>

        {typeof timeLeft === 'number' && (
          <span
            className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-black tabular-nums ${
              timeLeft <= 10
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-slate-700 text-slate-300'
            }`}
          >
            <Timer size={12} /> {timeLeft}s
          </span>
        )}
      </div>

      <div className="flex min-h-[1.25rem] items-center justify-between gap-3">
        <p className={`text-xs font-semibold ${FEEDBACK_STYLES[feedbackTone]}`}>{feedback}</p>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'} · {score} pts
        </span>
      </div>

      <div className="flex items-center gap-2">
        {hintEnabled && (
          <button
            type="button"
            onClick={onHint}
            disabled={hintsLeft <= 0}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-600/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200 transition-colors hover:bg-amber-600/20 disabled:opacity-30"
          >
            <Lightbulb size={13} /> Hint{hintsLeft > 0 ? ` (${hintsLeft})` : ''}
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white"
        >
          <RotateCcw size={13} /> Restart
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white"
        >
          <SkipForward size={13} /> Skip
        </button>
      </div>
    </div>
  );
}
