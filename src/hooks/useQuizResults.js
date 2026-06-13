'use client';

// Quiz results — per-chunk scores, persisted client-side (same sync-ready pattern as the
// curriculum record). Powers the review section and retention tracking.

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'survival-russian-quizzes-v1';
const VERSION = 1;

function freshState() {
  // results[chunkId] = { attempts, bestScore, lastScore, total, lastTaken }
  return { version: VERSION, results: {}, updatedAt: 0 };
}

export function useQuizResults() {
  const [state, setState] = useState(freshState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === VERSION) setState({ ...freshState(), ...parsed });
      }
    } catch {
      // corrupt / unavailable — keep defaults
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / unavailable
    }
  }, [state, ready]);

  const recordResult = useCallback((chunkId, score, total) => {
    if (!chunkId) return;
    setState((prev) => {
      const prior = prev.results[chunkId] || { attempts: 0, bestScore: 0, lastScore: 0, total, lastTaken: 0 };
      return {
        ...prev,
        results: {
          ...prev.results,
          [chunkId]: {
            attempts: prior.attempts + 1,
            bestScore: Math.max(prior.bestScore, score),
            lastScore: score,
            total,
            lastTaken: Date.now(),
          },
        },
        updatedAt: Date.now(),
      };
    });
  }, []);

  return { ready, results: state.results, recordResult };
}
