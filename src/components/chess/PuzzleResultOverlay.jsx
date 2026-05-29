'use client';

// Result card shown after a puzzle is solved, failed, or skipped. Offers the
// "same difficulty" / "harder difficulty" / "back to menu" next actions.

import React from 'react';
import { ArrowUpRight, CheckCircle2, LayoutGrid, RefreshCw, XCircle } from 'lucide-react';
import { DIFFICULTY_CONFIG, DIFFICULTY_ORDER } from '../../data/chessPuzzles';

const OUTCOME = {
  solved: { icon: CheckCircle2, color: 'text-emerald-300', title: 'Solved' },
  failed: { icon: XCircle, color: 'text-rose-300', title: 'Not this time' },
  skipped: { icon: ArrowUpRight, color: 'text-slate-300', title: 'Skipped' },
  timeout: { icon: XCircle, color: 'text-rose-300', title: "Time's up" },
};

export default function PuzzleResultOverlay({
  outcome,
  difficulty,
  pointsEarned = 0,
  onSameDifficulty,
  onHarder,
  onMenu,
}) {
  const meta = OUTCOME[outcome] || OUTCOME.solved;
  const Icon = meta.icon;
  const tierIndex = DIFFICULTY_ORDER.indexOf(difficulty);
  const harder = tierIndex >= 0 && tierIndex < DIFFICULTY_ORDER.length - 1
    ? DIFFICULTY_ORDER[tierIndex + 1]
    : null;
  const solved = outcome === 'solved';

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
        <Icon size={40} className={`mx-auto ${meta.color}`} />
        <h3 className="mt-3 text-base font-black uppercase tracking-[0.25em] text-white">{meta.title}</h3>
        {solved ? (
          <p className="mt-1 text-sm text-emerald-300">+{pointsEarned} points</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">
            {outcome === 'timeout' ? 'The clock ran out.' : 'The forced mate slipped away.'}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onSameDifficulty}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-600/15 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200 transition-colors hover:bg-emerald-600/25"
          >
            <RefreshCw size={14} /> Next {DIFFICULTY_CONFIG[difficulty]?.label || ''} puzzle
          </button>
          {harder && (
            <button
              type="button"
              onClick={() => onHarder(harder)}
              className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-600/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-amber-200 transition-colors hover:bg-amber-600/20"
            >
              <ArrowUpRight size={14} /> Try {DIFFICULTY_CONFIG[harder].label}
            </button>
          )}
          <button
            type="button"
            onClick={onMenu}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white"
          >
            <LayoutGrid size={14} /> Difficulty menu
          </button>
        </div>
      </div>
    </div>
  );
}
