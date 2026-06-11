'use client';

// Render-only JCUKEN keyboard. Cyrillic glyph only (no Latin — deliberate, so
// the learner binds position to the Russian letter, not to a QWERTY crutch).
// Finger-zone coloring + next-key pulse + per-key fade (full -> highlight ->
// hidden) so the scaffold disappears as each key is mastered.

import React from 'react';
import { KEYBOARD_ROWS, KEY_BY_CODE } from '../../data/jcukenKeymap';

const FINGER_TINT = {
  LPinky: 'bg-rose-500/15 border-rose-500/30',
  RPinky: 'bg-rose-500/15 border-rose-500/30',
  LRing: 'bg-amber-500/15 border-amber-500/30',
  RRing: 'bg-amber-500/15 border-amber-500/30',
  LMiddle: 'bg-emerald-500/15 border-emerald-500/30',
  RMiddle: 'bg-emerald-500/15 border-emerald-500/30',
  LIndex: 'bg-sky-500/15 border-sky-500/30',
  RIndex: 'bg-sky-500/15 border-sky-500/30',
};

const HOME_ANCHORS = new Set(['KeyF', 'KeyJ']); // index-finger home pips

// The QWERTY keycap letter for a physical code — a faint corner reference.
const CODE_TO_QWERTY = {
  Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/',
  BracketLeft: '[', BracketRight: ']', Backquote: '`', Minus: '-',
};
function qwertyFor(code) {
  if (code.startsWith('Key')) return code.slice(3).toLowerCase();
  if (code.startsWith('Digit')) return code.slice(5);
  return CODE_TO_QWERTY[code] || '';
}

function KeyCap({ keyDef, fade, isNext, isUnlocked }) {
  const tint = isUnlocked ? FINGER_TINT[keyDef.finger] : 'bg-slate-900/60 border-slate-800';
  const qwerty = qwertyFor(keyDef.code);
  // Mastered keys hide their glyph — but hovering reveals it in red so you can
  // still peek without it being a standing crutch.
  const glyphColor =
    fade === 'full'
      ? 'text-slate-100'
      : fade === 'highlight'
        ? 'text-slate-500'
        : 'text-transparent group-hover:text-red-400';

  return (
    <div
      className={`group relative flex h-11 w-11 items-center justify-center rounded-lg border text-2xl font-mono transition-all duration-150 ${tint} ${
        isNext ? 'ring-2 ring-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.6)] scale-105' : ''
      }`}
    >
      <span
        className={`transition-colors duration-150 ${glyphColor}`}
      >
        {keyDef.cyrillic ? keyDef.cyrillic :' '}
      </span>
      {qwerty ? (
        <span className="pointer-events-none absolute left-1 top-0.5 font-sans text-[8px] leading-none text-slate-500/55">
          {qwerty}
        </span>
      ) : null}
      {HOME_ANCHORS.has(keyDef.code) ? (
        <span className="absolute bottom-1 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-slate-400/60" />
      ) : null}
    </div>
  );
}

export default function JcukenKeyboard({ nextCode, fadeForCode, unlockedCodes }) {
  const unlocked = new Set(unlockedCodes || []);

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5" style={{ paddingLeft: rowIdx * 12 }}>
          {row.map((code) => {
            const keyDef = KEY_BY_CODE[code];
            if (!keyDef) return null;
            return (
              <KeyCap
                key={code}
                keyDef={keyDef}
                fade={fadeForCode ? fadeForCode(code) : 'full'}
                isNext={code === nextCode}
                isUnlocked={unlocked.has(code)}
              />
            );
          })}
        </div>
      ))}
      <div className="mt-1 flex w-2/3 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
        Space
      </div>
    </div>
  );
}
