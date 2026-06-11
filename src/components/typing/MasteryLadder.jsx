'use client';

// Per-key mastery overview: unlocked keys with mastery bars, the next key to be
// earned, and overall progress. Replaces the old static "Lesson Ladder".

import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { CURRICULUM, KEY_BY_CODE } from '../../data/jcukenKeymap';

function barColor(m) {
  if (m >= 0.82) return 'bg-emerald-500';
  if (m >= 0.45) return 'bg-blue-500';
  if (m > 0) return 'bg-amber-500';
  return 'bg-slate-700';
}

export default function MasteryLadder({ unlockedCodes, nextUnlockCode, masteryForCode }) {
  const unlocked = new Set(unlockedCodes);
  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Keys Earned</p>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
          {unlockedCodes.length} / {CURRICULUM.length}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {CURRICULUM.map((code) => {
          const keyDef = KEY_BY_CODE[code];
          const isUnlocked = unlocked.has(code);
          const isNext = code === nextUnlockCode;
          const m = isUnlocked ? masteryForCode(code) : 0;
          return (
            <div
              key={code}
              className={`rounded-xl border p-2 text-center ${
                isNext
                  ? 'border-blue-500/50 bg-blue-600/10'
                  : isUnlocked
                    ? 'border-slate-800 bg-slate-950/60'
                    : 'border-slate-800/60 bg-slate-950/30 opacity-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1 font-mono text-xl text-slate-200">
                {isUnlocked ? keyDef.cyrillic : <Lock size={12} className="text-slate-600" />}
                {isUnlocked && m >= 0.82 ? <CheckCircle2 size={12} className="text-emerald-400" /> : null}
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full ${barColor(m)}`} style={{ width: `${Math.round(m * 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
