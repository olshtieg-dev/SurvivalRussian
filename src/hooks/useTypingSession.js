'use client';

// Transient per-run typing state shared by both front-ends (structured drill +
// falling-words game): caret, error tracking, per-keystroke latency, and sample
// emission into the mastery profile. Positional input via event.code, matching
// the app-wide convention in useKeyboard.js (Cyrillic-only, no event.key fallback).

import { useCallback, useEffect, useRef, useState } from 'react';
import { KEY_BY_CODE, CODE_BY_CYR } from '../data/jcukenKeymap';

const DEFAULT_LATENCY = 280; // used for the first keystroke / after gaps
const MAX_LATENCY = 4000; // cap so an idle pause doesn't wreck the EWMA

export function useTypingSession({ text, fadeForCode, blind = false, onSample, onComplete, enabled = true }) {
  const [typed, setTyped] = useState('');
  const [errorIndex, setErrorIndex] = useState(null);
  const lastTimeRef = useRef(null);
  const completedRef = useRef(false);

  const reset = useCallback(() => {
    setTyped('');
    setErrorIndex(null);
    lastTimeRef.current = null;
    completedRef.current = false;
  }, []);

  // New drill text => reset.
  useEffect(() => {
    reset();
  }, [text, reset]);

  useEffect(() => {
    if (!enabled || !text) return undefined;

    const handleKeyDown = (event) => {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const expectedChar = text[typed.length];
      if (expectedChar === undefined) return;

      if (event.code === 'Backspace') {
        event.preventDefault();
        setTyped((p) => p.slice(0, -1));
        setErrorIndex(null);
        lastTimeRef.current = null;
        return;
      }

      // Space token.
      if (expectedChar === ' ') {
        if (event.code === 'Space') {
          event.preventDefault();
          setTyped((p) => p + ' ');
          setErrorIndex(null);
          lastTimeRef.current = null;
        } else if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') {
          setErrorIndex(typed.length);
        }
        return;
      }

      // Resolve the physical key the learner pressed and the one they should have.
      const pressed = KEY_BY_CODE[event.code];
      const expectedCode = CODE_BY_CYR[expectedChar.toLowerCase()];
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') return;
      if (!pressed && !expectedCode) return;
      event.preventDefault();

      const now = performance.now();
      let latencyMs = lastTimeRef.current == null ? DEFAULT_LATENCY : now - lastTimeRef.current;
      latencyMs = Math.min(latencyMs, MAX_LATENCY);

      const correct = pressed && pressed.cyrillic === expectedChar.toLowerCase();
      const hintShown = !blind && fadeForCode && expectedCode ? fadeForCode(expectedCode) !== 'hidden' : false;

      if (expectedCode) {
        onSample?.(expectedCode, { correct, latencyMs, hintShown, blind, now: Date.now() });
      }
      lastTimeRef.current = now;

      if (correct) {
        const nextTyped = typed + expectedChar;
        setTyped(nextTyped);
        setErrorIndex(null);
        if (nextTyped.length === text.length && !completedRef.current) {
          completedRef.current = true;
          onComplete?.(nextTyped);
        }
      } else {
        setErrorIndex(typed.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, text, typed, blind, fadeForCode, onSample, onComplete]);

  return { typed, errorIndex, caretIndex: typed.length, reset };
}
