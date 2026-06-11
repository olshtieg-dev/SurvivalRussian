// Pure mastery math for the adaptive JCUKEN engine. No React, no storage.
// Mastery = accuracy + rhythm (latency evenness) + a little speed — NOT raw
// speed — and hint-ON correctness is discounted so reading the on-screen
// keyboard can never earn a key its graduation.

import { CURRICULUM, isPunctCode } from '../../data/jcukenKeymap';

const ALPHA_ACC = 0.15; // EWMA smoothing for accuracy
const ALPHA_LAT = 0.2; // EWMA smoothing for latency
const ALPHA_VAR = 0.2; // EWMA smoothing for latency variance
const HINT_ON_WEIGHT = 0.4; // hint-visible correctness counts ~40% toward accuracy

const TARGET_LAT = 280; // ms per keystroke considered "fluent"
const RHYTHM_TOL = 90; // ms std-dev tolerance for "even" cadence

// Unlock gates
const MASTERY_THRESHOLD = 0.82;
const MIN_SAMPLES = 12;
const BLIND_ACC_GATE = 0.9;
const BLIND_MIN_SAMPLES = 10;
const WARMUP_SAMPLES = 8;

export function freshRecord(code) {
  return {
    code,
    samples: 0,
    accEwma: 0,
    latencyEwma: 0,
    latencyVarEwma: 0,
    blindSamples: 0,
    blindAccEwma: 0,
    lastSeen: 0,
  };
}

const clamp01 = (x) => Math.max(0, Math.min(1, x));

function ewma(prev, x, alpha, priorCount) {
  return priorCount === 0 ? x : prev + alpha * (x - prev);
}

// sample: { correct:boolean, latencyMs:number, blind?:boolean, hintShown?:boolean, now?:number }
export function updateKeyRecord(rec, sample) {
  const n = { ...rec };
  const acc = sample.correct ? 1 : 0;
  const accAlpha = sample.hintShown ? ALPHA_ACC * HINT_ON_WEIGHT : ALPHA_ACC;

  n.accEwma = ewma(rec.accEwma, acc, accAlpha, rec.samples);
  n.latencyEwma = ewma(rec.latencyEwma, sample.latencyMs, ALPHA_LAT, rec.samples);
  const dev = sample.latencyMs - n.latencyEwma;
  n.latencyVarEwma = ewma(rec.latencyVarEwma, dev * dev, ALPHA_VAR, rec.samples);
  n.samples = rec.samples + 1;

  if (sample.blind) {
    n.blindAccEwma = ewma(rec.blindAccEwma, acc, ALPHA_ACC, rec.blindSamples);
    n.blindSamples = rec.blindSamples + 1;
  }
  n.lastSeen = sample.now ?? rec.lastSeen;
  return n;
}

// 0..1 mastery — accuracy dominates, rhythm next, speed least.
export function keyMastery(rec) {
  if (!rec || rec.samples < WARMUP_SAMPLES) return 0;
  const std = Math.sqrt(Math.max(0, rec.latencyVarEwma));
  const rhythm = clamp01(1 - (std - RHYTHM_TOL) / RHYTHM_TOL);
  const speed = clamp01(1 - (rec.latencyEwma - TARGET_LAT) / TARGET_LAT);
  return clamp01(0.55 * rec.accEwma + 0.3 * rhythm + 0.15 * speed);
}

export function isWarmingUp(rec) {
  return !rec || rec.samples < WARMUP_SAMPLES;
}

// 'full' | 'highlight' | 'hidden' — the per-key scaffold fade.
export function fadeLevel(rec) {
  const m = keyMastery(rec);
  if (m < 0.45) return 'full';
  if (m < MASTERY_THRESHOLD) return 'highlight';
  return 'hidden';
}

// Weak keys oversampled, but mastered keys keep a meaningful floor so spaced
// repetition keeps them in rotation instead of letting them drop out entirely.
export function keyWeights(activeCodes, keys) {
  const w = {};
  for (const code of activeCodes) {
    w[code] = 0.35 + (1 - keyMastery(keys[code]));
  }
  return w;
}

// Every active key fluent enough to attempt a blind run?
export function activeSetMastered(activeCodes, keys) {
  return activeCodes.every((code) => {
    const r = keys[code];
    return r && r.samples >= MIN_SAMPLES && keyMastery(r) >= MASTERY_THRESHOLD;
  });
}

// Blind run cleared (proven without the keyboard) — the real unlock gate.
export function blindRunPassed(activeCodes, keys) {
  return activeCodes.every((code) => {
    const r = keys[code];
    return r && r.blindSamples >= BLIND_MIN_SAMPLES && r.blindAccEwma >= BLIND_ACC_GATE;
  });
}

export function nextCodeToUnlock(unlockedCodes, includePunctuation) {
  for (const code of CURRICULUM) {
    if (unlockedCodes.includes(code)) continue;
    if (!includePunctuation && isPunctCode(code)) continue;
    return code;
  }
  return null;
}

// Average mastery across the active set (for stage gating / UI).
export function averageMastery(codes, keys) {
  if (!codes.length) return 0;
  return codes.reduce((s, c) => s + keyMastery(keys[c]), 0) / codes.length;
}

export const MASTERY_CONSTANTS = {
  MASTERY_THRESHOLD,
  MIN_SAMPLES,
  BLIND_ACC_GATE,
  BLIND_MIN_SAMPLES,
  WARMUP_SAMPLES,
};
