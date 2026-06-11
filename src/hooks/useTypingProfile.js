'use client';

// The adaptive engine's persisted brain: per-key mastery, the unlocked key set,
// blind-run gating, stage recommendation, and settings. SSR-safe localStorage
// (load post-mount, save after bootstrap), mirroring the pattern in page.js.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SEED_CODES } from '../data/jcukenKeymap';
import { POST_ONBOARDING_UNLOCKED } from '../lib/typing/onboarding';
import {
  freshRecord,
  updateKeyRecord,
  keyMastery,
  fadeLevel,
  activeSetMastered,
  blindRunPassed,
  nextCodeToUnlock,
  averageMastery,
} from '../lib/typing/mastery';

const STORAGE_KEY = 'survival-russian-typing-v1';
const PROFILE_VERSION = 1;

function defaultProfile() {
  const keys = {};
  for (const code of SEED_CODES) keys[code] = freshRecord(code);
  return {
    version: PROFILE_VERSION,
    phase: 'onboarding', // 'onboarding' | 'adaptive'
    unlockedCodes: [...SEED_CODES],
    keys,
    includePunctuation: false,
    speechMode: 'letters', // silent | letters | words | sentences
    mode: 'structured', // structured | game
    stagePref: 'auto', // 'auto' | 0 | 1 | 2 | 3
    hideMastered: true, // fade mastered keys' glyph to invisible
    blindRun: { active: false },
    totals: { keystrokes: 0, sessions: 0 },
    updatedAt: 0,
  };
}

// Ratchet on the COUNT of keys the learner has actually mastered, not the
// average — otherwise each freshly-unlocked (mastery-0) key drags the average
// down and the higher stages never trigger.
function recommendedStage(unlockedCodes, keys) {
  const mastered = unlockedCodes.filter((c) => keyMastery(keys[c]) >= 0.6).length;
  if (mastered < 4) return 0;
  if (mastered < 8) return 1;
  if (mastered < 14) return 2;
  return 3;
}

export function useTypingProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [bootstrapped, setBootstrapped] = useState(false);
  const justUnlockedRef = useRef(null);

  // Load once, post-mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === PROFILE_VERSION) {
          setProfile({ ...defaultProfile(), ...parsed });
        }
      }
    } catch {
      // corrupt / unavailable — keep defaults
    }
    setBootstrapped(true);
  }, []);

  // Persist after bootstrap.
  useEffect(() => {
    if (!bootstrapped || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore quota / unavailable
    }
  }, [profile, bootstrapped]);

  const recordSample = useCallback((code, sample) => {
    setProfile((prev) => {
      if (!prev.keys[code]) return prev; // ignore keys not in the active set
      const keys = { ...prev.keys, [code]: updateKeyRecord(prev.keys[code], sample) };
      let next = {
        ...prev,
        keys,
        totals: { ...prev.totals, keystrokes: prev.totals.keystrokes + 1 },
        updatedAt: sample.now ?? prev.updatedAt,
      };

      if (next.phase !== 'adaptive') return next;

      const active = next.unlockedCodes;
      if (!next.blindRun.active) {
        // Ready to prove it blind?
        if (activeSetMastered(active, keys)) {
          next = { ...next, blindRun: { active: true } };
        }
      } else if (blindRunPassed(active, keys)) {
        // Graduated — unlock the next key.
        const newCode = nextCodeToUnlock(next.unlockedCodes, next.includePunctuation);
        if (newCode) {
          justUnlockedRef.current = newCode;
          next = {
            ...next,
            unlockedCodes: [...next.unlockedCodes, newCode],
            keys: { ...keys, [newCode]: freshRecord(newCode) },
            blindRun: { active: false },
          };
        } else {
          next = { ...next, blindRun: { active: false } };
        }
      }
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setProfile((prev) => {
      if (prev.phase === 'adaptive') return prev;
      const keys = { ...prev.keys };
      for (const code of POST_ONBOARDING_UNLOCKED) {
        if (!keys[code]) keys[code] = freshRecord(code);
      }
      return {
        ...prev,
        phase: 'adaptive',
        unlockedCodes: [...POST_ONBOARDING_UNLOCKED],
        keys,
      };
    });
  }, []);

  const setSpeechMode = useCallback((speechMode) => setProfile((p) => ({ ...p, speechMode })), []);
  const setMode = useCallback((mode) => setProfile((p) => ({ ...p, mode })), []);
  const setStagePref = useCallback((stagePref) => setProfile((p) => ({ ...p, stagePref })), []);
  const setHideMastered = useCallback((hideMastered) => setProfile((p) => ({ ...p, hideMastered })), []);
  const setIncludePunctuation = useCallback(
    (includePunctuation) => setProfile((p) => ({ ...p, includePunctuation })),
    [],
  );
  const resetProfile = useCallback(() => setProfile(defaultProfile()), []);

  const consumeJustUnlocked = useCallback(() => {
    const v = justUnlockedRef.current;
    justUnlockedRef.current = null;
    return v;
  }, []);

  const derived = useMemo(() => {
    const autoStage = recommendedStage(profile.unlockedCodes, profile.keys);
    const stage = profile.stagePref === 'auto' ? autoStage : Number(profile.stagePref);
    const nextUnlockCode = nextCodeToUnlock(profile.unlockedCodes, profile.includePunctuation);
    const avgMastery = averageMastery(profile.unlockedCodes, profile.keys);
    return { stage, autoStage, nextUnlockCode, avgMastery };
  }, [profile.unlockedCodes, profile.keys, profile.includePunctuation, profile.stagePref]);

  const fadeForCode = useCallback(
    (code) => {
      if (profile.blindRun.active) return 'hidden';
      const f = fadeLevel(profile.keys[code]);
      // When the learner turns off "hide mastered", keep a dim glyph instead of
      // letting it vanish.
      if (!profile.hideMastered && f === 'hidden') return 'highlight';
      return f;
    },
    [profile.blindRun.active, profile.keys, profile.hideMastered],
  );

  const masteryForCode = useCallback((code) => keyMastery(profile.keys[code]), [profile.keys]);

  return {
    bootstrapped,
    profile,
    phase: profile.phase,
    unlockedCodes: profile.unlockedCodes,
    keys: profile.keys,
    speechMode: profile.speechMode,
    mode: profile.mode,
    stagePref: profile.stagePref,
    hideMastered: profile.hideMastered,
    includePunctuation: profile.includePunctuation,
    blindRun: profile.blindRun,
    ...derived,
    recordSample,
    completeOnboarding,
    setSpeechMode,
    setMode,
    setStagePref,
    setHideMastered,
    setIncludePunctuation,
    resetProfile,
    consumeJustUnlocked,
    fadeForCode,
    masteryForCode,
  };
}
