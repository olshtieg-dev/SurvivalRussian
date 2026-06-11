'use client';

// ZType-style skin over the SAME mastery engine: words fall, you type to destroy
// them, every keystroke still feeds the profile. Score is cosmetic — the real
// progression is the shared mastery state.
//
// All game state flows through `wordsRef` so the keydown handler and the rAF
// loop read/write it directly; React state (`words`) is only mirrored for
// render. This keeps every setState call OUT of an updater function — calling
// onSample (a parent setState) inside a setWords updater is what triggered
// "Cannot update a component while rendering a different component".

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Rocket } from 'lucide-react';
import { KEY_BY_CODE, CODE_BY_CYR } from '../../data/jcukenKeymap';

const MAX_ON_SCREEN = 4;
const SPAWN_MS = 1800;
// Falling speed (% of the play area per second) starts gentle and ramps up
// steadily as the round goes on.
const BASE_SPEED = 10;
const SPEED_RAMP = 0.09; // added per second elapsed
const MAX_SPEED = 30;

export default function FallingWordsGame({ nextWord, onSample }) {
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);

  const wordsRef = useRef([]);
  const lockedRef = useRef(null); // id of the word being typed
  const lastTimeRef = useRef(null);
  const idRef = useRef(0);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const startRef = useRef(null);

  const nextWordRef = useRef(nextWord);
  nextWordRef.current = nextWord;

  // Single committer: keep the ref authoritative and mirror to state for render.
  const commit = useCallback((next) => {
    wordsRef.current = next;
    setWords(next);
  }, []);

  // Falling animation + spawning — all computed outside any setState updater.
  useEffect(() => {
    const step = (t) => {
      if (lastFrameRef.current == null) lastFrameRef.current = t;
      if (startRef.current == null) startRef.current = t;
      const dt = (t - lastFrameRef.current) / 1000;
      lastFrameRef.current = t;
      const elapsedSec = (t - startRef.current) / 1000;
      const speed = Math.min(MAX_SPEED, BASE_SPEED + SPEED_RAMP * elapsedSec);

      let arr = wordsRef.current;

      // spawn
      if (t - lastSpawnRef.current > SPAWN_MS && arr.length < MAX_ON_SCREEN) {
        lastSpawnRef.current = t;
        const text = nextWordRef.current?.();
        if (text) {
          idRef.current += 1;
          arr = [
            ...arr,
            { id: idRef.current, text, typedLen: 0, x: 8 + Math.floor((idRef.current * 37) % 78), y: 0, error: false },
          ];
        }
      }

      // fall
      let missedThisFrame = 0;
      const next = [];
      for (const w of arr) {
        const y = w.y + speed * dt;
        if (y >= 100) {
          if (lockedRef.current === w.id) lockedRef.current = null;
          missedThisFrame += 1;
          continue;
        }
        next.push({ ...w, y });
      }

      commit(next);
      if (missedThisFrame) setMissed((m) => m + missedThisFrame);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [commit]);

  // Typing — everything happens in the handler scope, no setState inside updaters.
  useEffect(() => {
    const handle = (event) => {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') return;
      const pressed = KEY_BY_CODE[event.code];
      if (!pressed || !pressed.cyrillic) return;
      event.preventDefault();
      const ch = pressed.cyrillic;

      const arr = wordsRef.current;
      let locked = arr.find((w) => w.id === lockedRef.current);
      if (!locked) {
        const candidates = arr.filter((w) => w.text[w.typedLen] === ch).sort((a, b) => b.y - a.y);
        locked = candidates[0];
        if (locked) lockedRef.current = locked.id;
      }
      if (!locked) return; // free miss, unattributed

      const expectedChar = locked.text[locked.typedLen];
      const expectedCode = CODE_BY_CYR[expectedChar];
      const now = performance.now();
      let latencyMs = lastTimeRef.current == null ? 280 : now - lastTimeRef.current;
      latencyMs = Math.min(latencyMs, 4000);
      lastTimeRef.current = now;
      const correct = ch === expectedChar;

      if (expectedCode) {
        onSample?.(expectedCode, { correct, latencyMs, hintShown: false, blind: false, now: Date.now() });
      }

      if (!correct) {
        commit(arr.map((w) => (w.id === locked.id ? { ...w, error: true } : w)));
        return;
      }

      const completes = locked.typedLen + 1 >= locked.text.length;
      if (completes) {
        lockedRef.current = null;
        commit(arr.filter((w) => w.id !== locked.id));
        setScore((s) => s + locked.text.length);
      } else {
        commit(arr.map((w) => (w.id === locked.id ? { ...w, typedLen: w.typedLen + 1, error: false } : w)));
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [commit, onSample]);

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-4">
      <div className="flex items-center justify-between px-1 pb-2 text-[10px] font-black uppercase tracking-[0.28em]">
        <span className="text-emerald-400">Score {score}</span>
        <span className="text-slate-500">Type the lowest word first</span>
        <span className="text-rose-400">Missed {missed}</span>
      </div>
      <div className="relative h-[26rem] overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
        {words.map((w) => (
          <div key={w.id} className="absolute -translate-x-1/2 font-mono text-2xl" style={{ left: `${w.x}%`, top: `${w.y}%` }}>
            <span className={w.error ? 'text-rose-400' : ''}>
              <span className="text-emerald-400">{w.text.slice(0, w.typedLen)}</span>
              <span className={lockedRef.current === w.id ? 'text-blue-300' : 'text-slate-400'}>{w.text.slice(w.typedLen)}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center">
        <a
          href="/games/typer-space/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 transition-all hover:border-blue-500/40 hover:text-blue-300"
        >
          <Rocket size={12} /> Play TyperSpace in the arcade
        </a>
      </div>
    </div>
  );
}
