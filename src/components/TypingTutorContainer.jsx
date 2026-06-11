'use client';

// Top-level orchestrator for the adaptive JCUKEN tutor. Owns the mastery profile
// and drives two phases — a short scripted home-row onboarding, then the adaptive
// engine — across two skins (structured drill + falling-words game). Replaces the
// old TypingTutorPanel; this is what FeatureDock mounts.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Gamepad2, RotateCcw, EyeOff, Eye } from 'lucide-react';
import { KEY_BY_CODE, CODE_BY_CYR } from '../data/jcukenKeymap';
import { useTypingProfile } from '../hooks/useTypingProfile';
import { useTypingSession } from '../hooks/useTypingSession';
import { generateDrill } from '../lib/typing/generateDrill';
import { generatePseudoWord, weightsByGlyph } from '../lib/typing/pseudoWords';
import { keyWeights } from '../lib/typing/mastery';
import { ONBOARDING_DRILLS } from '../lib/typing/onboarding';
import { speak } from '../lib/typing/speech';
import JcukenKeyboard from './typing/JcukenKeyboard';
import DrillView from './typing/DrillView';
import FallingWordsGame from './typing/FallingWordsGame';
import MasteryLadder from './typing/MasteryLadder';
import SpeechControls from './typing/SpeechControls';

export default function TypingTutorContainer() {
  const profile = useTypingProfile();
  const {
    bootstrapped, phase, unlockedCodes, keys, speechMode, mode, blindRun, stage,
    stagePref, autoStage, hideMastered, nextUnlockCode, recordSample, completeOnboarding,
    setSpeechMode, setMode, setStagePref, setHideMastered, resetProfile, fadeForCode, masteryForCode,
  } = profile;

  const [drill, setDrill] = useState(null);
  const [drillId, setDrillId] = useState(0);
  const [obIndex, setObIndex] = useState(0);
  const prevUnlockCount = useRef(unlockedCodes.length);
  const lastSpokenWords = useRef(0);

  const speechModeRef = useRef(speechMode);
  speechModeRef.current = speechMode;

  // --- Adaptive drill generation ---
  const generateNext = useCallback(() => {
    setDrill(
      generateDrill({
        activeCodes: unlockedCodes,
        unlockedCodes,
        keys,
        stage,
        rng: Math.random,
      }),
    );
    lastSpokenWords.current = 0;
  }, [unlockedCodes, keys, stage]);

  useEffect(() => {
    if (phase === 'adaptive') generateNext();
    // regenerate on phase entry, new drill, a freshly unlocked key, or a manual
    // level change (stagePref). Auto-stage drift mid-drill does NOT regenerate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, drillId, unlockedCodes.length, stagePref]);

  // Announce a newly unlocked key.
  useEffect(() => {
    if (unlockedCodes.length > prevUnlockCount.current) {
      const code = unlockedCodes[unlockedCodes.length - 1];
      const g = KEY_BY_CODE[code]?.cyrillic;
      if (g && speechModeRef.current !== 'silent') speak(g, { rate: 0.7 });
    }
    prevUnlockCount.current = unlockedCodes.length;
  }, [unlockedCodes]);

  // --- Sample handler (shared) with letter TTS ---
  const onSample = useCallback(
    (code, sample) => {
      recordSample(code, sample);
      if (sample.correct && speechModeRef.current === 'letters') {
        const phon = KEY_BY_CODE[code]?.phonetic;
        if (phon) speak(phon, { rate: 0.72 });
      }
    },
    [recordSample],
  );

  // --- Adaptive structured session ---
  const adaptiveEnabled = phase === 'adaptive' && mode === 'structured';
  const adaptive = useTypingSession({
    text: adaptiveEnabled ? drill?.text ?? '' : '',
    fadeForCode,
    blind: blindRun.active,
    onSample,
    onComplete: useCallback(
      (finalText) => {
        if (speechModeRef.current === 'sentences') speak(finalText, { rate: 0.85 });
        setDrillId((n) => n + 1);
      },
      [],
    ),
    enabled: adaptiveEnabled,
  });

  // Word-level TTS: speak each word as it completes (words mode).
  useEffect(() => {
    if (!adaptiveEnabled || speechMode !== 'words') return;
    const typed = adaptive.typed;
    const words = typed.split(' ').filter(Boolean);
    const completed = typed.endsWith(' ') ? words.length : words.length - 1;
    if (completed > lastSpokenWords.current) {
      const w = words[completed - 1];
      if (w) speak(w, { rate: 0.84 });
      lastSpokenWords.current = completed;
    }
  }, [adaptive.typed, adaptiveEnabled, speechMode]);

  // --- Onboarding session ---
  const onboardingEnabled = phase === 'onboarding';
  const obDrill = ONBOARDING_DRILLS[obIndex];
  const onboarding = useTypingSession({
    text: onboardingEnabled ? obDrill?.text ?? '' : '',
    fadeForCode,
    blind: false,
    onSample,
    onComplete: useCallback(() => {
      if (obIndex >= ONBOARDING_DRILLS.length - 1) {
        completeOnboarding();
      } else {
        setObIndex((i) => i + 1);
      }
    }, [obIndex, completeOnboarding]),
    enabled: onboardingEnabled,
  });

  // Falling-words supply.
  const nextWord = useCallback(() => {
    const cw = keyWeights(unlockedCodes, keys);
    return generatePseudoWord(unlockedCodes, weightsByGlyph(cw), Math.random) || 'аоао';
  }, [unlockedCodes, keys]);

  if (!bootstrapped) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading your profile…</div>;
  }

  // The physical key the learner should press next (structured mode only).
  let nextCode = null;
  if (phase === 'adaptive' && mode === 'structured') {
    const c = drill?.text?.[adaptive.typed.length];
    if (c && c !== ' ') nextCode = CODE_BY_CYR[c.toLowerCase()] ?? null;
  } else if (phase === 'onboarding') {
    const c = obDrill?.text?.[onboarding.typed.length];
    if (c && c !== ' ') nextCode = CODE_BY_CYR[c.toLowerCase()] ?? null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">
              Learn to Touch-Type Russian (ЙЦУКЕН)
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              No Russian keycaps required — and that is the point. You will learn positions by feel,
              one key at a time. The on-screen keyboard fades as you master each key, and you unlock
              the next only after proving it blind.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 p-1">
              {[
                ['auto', 'Auto'],
                [0, 'Rudiments'],
                [1, 'Syllables'],
                [2, 'Words'],
                [3, 'Phrases'],
              ].map(([val, label]) => {
                const active = phase === 'adaptive' && stagePref === val;
                const isAutoTarget = phase === 'adaptive' && stagePref === 'auto' && val === autoStage;
                // During the warm-up, picking a level skips straight into adaptive at that level.
                const pick = () => {
                  if (phase !== 'adaptive') completeOnboarding();
                  setStagePref(val);
                };
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={pick}
                    title={val === 'auto' ? 'Advance automatically with mastery' : `Drill ${label.toLowerCase()}`}
                    className={`rounded-full px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
                      active
                        ? 'bg-blue-600 text-white'
                        : isAutoTarget
                          ? 'text-blue-300 hover:text-white'
                          : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {phase === 'adaptive' ? (
              <button
                type="button"
                onClick={() => setHideMastered(!hideMastered)}
                title={hideMastered ? 'Mastered keys are hidden — click to reveal them' : 'Mastered keys are shown — click to hide them'}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  hideMastered
                    ? 'border-slate-700 bg-slate-950/70 text-slate-400 hover:text-white'
                    : 'border-blue-500/40 bg-blue-600/15 text-blue-300'
                }`}
              >
                {hideMastered ? <EyeOff size={12} /> : <Eye size={12} />}
                {hideMastered ? 'Hide mastered' : 'Show mastered'}
              </button>
            ) : null}
            <SpeechControls value={speechMode} onChange={setSpeechMode} />
            <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 p-1">
              <button
                type="button"
                onClick={() => setMode('structured')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] ${mode === 'structured' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Keyboard size={12} /> Drill
              </button>
              <button
                type="button"
                onClick={() => setMode('game')}
                disabled={phase === 'onboarding'}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] disabled:opacity-40 ${mode === 'game' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Gamepad2 size={12} /> Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding */}
      {phase === 'onboarding' ? (
        <>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            <span className="font-black uppercase tracking-[0.24em]">Warm-up {obIndex + 1}/{ONBOARDING_DRILLS.length}:</span>{' '}
            {obDrill?.coach}
          </div>
          <DrillView text={obDrill?.text ?? ''} typed={onboarding.typed} errorIndex={onboarding.errorIndex} stage={0} />
        </>
      ) : (
        <>
          {/* Blind-run banner */}
          {blindRun.active ? (
            <div className="flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm text-violet-200">
              <EyeOff size={16} />
              <span>
                <span className="font-black uppercase tracking-[0.24em]">Blind run.</span>{' '}
                Keyboard hidden — prove this set from memory to unlock the next key.
              </span>
            </div>
          ) : null}

          {mode === 'structured' ? (
            <DrillView
              text={drill?.text ?? ''}
              typed={adaptive.typed}
              errorIndex={adaptive.errorIndex}
              tokens={drill?.tokens ?? []}
              stage={drill?.stage ?? stage}
            />
          ) : (
            <FallingWordsGame nextWord={nextWord} onSample={onSample} />
          )}
        </>
      )}

      {/* Keyboard — hidden during a blind run */}
      {blindRun.active ? null : (
        <JcukenKeyboard nextCode={nextCode} fadeForCode={fadeForCode} unlockedCodes={unlockedCodes} />
      )}

      {phase === 'adaptive' ? (
        <MasteryLadder
          unlockedCodes={unlockedCodes}
          nextUnlockCode={nextUnlockCode}
          masteryForCode={masteryForCode}
        />
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.confirm('Reset all typing progress?')) {
              resetProfile();
              setObIndex(0);
            }
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 transition-all hover:border-rose-500/40 hover:text-rose-300"
        >
          <RotateCcw size={12} /> Reset progress
        </button>
      </div>
    </div>
  );
}
