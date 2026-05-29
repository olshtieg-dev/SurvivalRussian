'use client';

// Difficulty cards for the chess puzzle mode. Easy / Medium / Hard / Expert plus
// a mixed "Random" mode across all tiers.

import React from 'react';
import { Crown, Dices, Shield, Swords, Target } from 'lucide-react';
import { DIFFICULTY_CONFIG, DIFFICULTY_ORDER, getPuzzlesByDifficulty } from '../../data/chessPuzzles';

const ACCENTS = {
  emerald: 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-600/15 text-emerald-300',
  sky: 'border-sky-500/30 hover:border-sky-400 hover:bg-sky-600/15 text-sky-300',
  amber: 'border-amber-500/30 hover:border-amber-400 hover:bg-amber-600/15 text-amber-300',
  rose: 'border-rose-500/30 hover:border-rose-400 hover:bg-rose-600/15 text-rose-300',
};

const ICONS = { easy: Target, medium: Swords, hard: Shield, expert: Crown };

export default function PuzzleDifficultyPicker({ onSelect, sessionScore = 0, solvedCount = 0 }) {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 text-center">
        <h2 className="text-lg font-black uppercase tracking-[0.3em] text-white">Chess Puzzles</h2>
        <p className="mt-1 text-xs text-slate-400">
          Find the forced mate. Pick a difficulty — any move that still forces mate counts.
        </p>
        {(solvedCount > 0 || sessionScore > 0) && (
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
            Session · {solvedCount} solved · {sessionScore} pts
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DIFFICULTY_ORDER.map((tier) => {
          const config = DIFFICULTY_CONFIG[tier];
          const Icon = ICONS[tier];
          const count = getPuzzlesByDifficulty(tier).length;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onSelect(tier)}
              className={`rounded-2xl border bg-slate-950/60 p-5 text-left transition-all ${ACCENTS[config.accent]}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">{config.label}</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  {config.lengthLabel}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{config.blurb}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>{count} puzzles</span>
                <span>
                  {config.basePoints} pts
                  {config.timerSeconds ? ` · ${config.timerSeconds}s` : ''}
                  {config.hintPolicy === 'none' ? ' · no hints' : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelect('random')}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-sm font-black uppercase tracking-[0.25em] text-slate-300 transition-all hover:border-fuchsia-400/60 hover:bg-fuchsia-600/10 hover:text-fuchsia-200"
      >
        <Dices size={18} /> Random — all tiers
      </button>
    </div>
  );
}
