'use client';

// Presentational structured-drill surface: the target string with caret /
// typed (emerald) / error (red) styling, a progress bar, and meaning chips for
// real-word tokens. State comes from the container's useTypingSession.

import React, { useEffect, useRef } from 'react';

export default function DrillView({ text, typed, errorIndex, tokens = [], stage }) {
  const viewportRef = useRef(null);
  const currentRef = useRef(null);
  const ratio = text ? typed.length / text.length : 0;

  useEffect(() => {
    const viewport = viewportRef.current;
    const cur = currentRef.current;
    if (!viewport || !cur) return;
    const top = cur.offsetTop;
    if (top < viewport.scrollTop + 18 || top > viewport.scrollTop + viewport.clientHeight - 40) {
      viewport.scrollTo({ top: Math.max(0, top - 40), behavior: 'smooth' });
    }
  }, [typed, text]);

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-500">
          {stage === 0
            ? 'Rudiments'
            : stage === 1
              ? 'Syllables'
              : stage === 2
                ? 'Words'
                : 'Phrases'}
        </p>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
          {Math.round(ratio * 100)}%
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full bg-blue-500 transition-all duration-150" style={{ width: `${ratio * 100}%` }} />
      </div>

      <div ref={viewportRef} className="mt-6 max-h-[8.5rem] overflow-y-auto pr-2 custom-scrollbar">
        <div className="break-words font-mono text-4xl leading-relaxed tracking-[0.18em]">
          {Array.from(text || '').map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length;
            const isError = index === errorIndex;
            return (
              <span key={index} ref={isCurrent ? currentRef : null} className="relative inline-block">
                <span
                  className={`transition-all duration-100 ${
                    isTyped
                      ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                      : isError
                        ? 'rounded bg-red-500/10 text-red-400'
                        : 'text-slate-500'
                  }`}
                >
                  {char === ' ' ? ' ' : char}
                </span>
                {isCurrent ? (
                  <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-blue-500 animate-pulse" />
                ) : null}
              </span>
            );
          })}
        </div>
      </div>

      {tokens.some((t) => t.meaning) ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tokens
            .filter((t) => t.meaning)
            .map((t, i) => (
              <span key={`${t.cyrillic}-${i}`} className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-400">
                <span className="font-mono text-blue-300">{t.cyrillic}</span>
                <span className="mx-1.5 text-slate-600">·</span>
                {t.meaning}
              </span>
            ))}
        </div>
      ) : null}
    </div>
  );
}
