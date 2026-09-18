'use client';

// Top-level chess menu: pick one of three modes. Loaded by GameOverlay.
//  • Mate Puzzles — the curated forced-mate set (ChessPuzzleBoard).
//  • Rated Tactics — Lichess-sourced puzzles with an ELO slider (RatedPuzzleBoard).
//  • Play Computer — full game vs the minimax engine (PlayVsComputer).

import React, { useState } from 'react';
import { ArrowLeft, Cpu, Crown, Sparkles } from 'lucide-react';
import ChessPuzzleBoard from './ChessPuzzleBoard';
import RatedPuzzleBoard from './RatedPuzzleBoard';
import PlayVsComputer from './PlayVsComputer';

const MODES = [
  {
    id: 'rated',
    icon: Sparkles,
    label: 'Rated Tactics',
    blurb: 'Real puzzles from 600 to 2200 — slide to your level.',
    accent: 'border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-600/15 text-indigo-300',
  },
  {
    id: 'mate',
    icon: Crown,
    label: 'Mate Puzzles',
    blurb: 'Forced-mate drills, easy to expert.',
    accent: 'border-amber-500/30 hover:border-amber-400 hover:bg-amber-600/15 text-amber-300',
  },
  {
    id: 'play',
    icon: Cpu,
    label: 'Play Computer',
    blurb: 'A full game vs the engine — pick its strength.',
    accent: 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-600/15 text-emerald-300',
  },
];

export default function ChessHub() {
  const [mode, setMode] = useState(null);
  const exit = () => setMode(null);

  if (mode === 'rated') return <RatedPuzzleBoard onExit={exit} />;
  if (mode === 'play') return <PlayVsComputer onExit={exit} />;
  if (mode === 'mate') {
    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={exit}
          className="mx-auto mt-4 flex w-full max-w-md items-center gap-1.5 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Modes
        </button>
        <ChessPuzzleBoard />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 text-center">
        <h2 className="text-lg font-black uppercase tracking-[0.3em] text-white">Chess</h2>
        <p className="mt-1 text-xs text-slate-400">Pick a mode.</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`rounded-2xl border bg-slate-950/60 p-5 text-left transition-all ${m.accent}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={20} />
                <span className="text-sm font-black uppercase tracking-[0.2em]">{m.label}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{m.blurb}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
