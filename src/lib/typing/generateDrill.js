// Staged, weak-key-weighted drill generator. Returns a descriptor the session
// renders and scores:
//   { text, tokens:[{cyrillic, meaning}], stage, focusCodes }
//
// Stage 0 rudiments -> Stage 1 pseudo-words -> Stage 2 real words ->
// Stage 3 short phrases. Weak keys are oversampled at every stage. If a higher
// stage has no material yet (e.g. no spellable real words), it falls back so the
// learner never sees a blank drill.

import { KEY_BY_CODE } from '../../data/jcukenKeymap';
import { keyWeights } from './mastery';
import { generatePseudoWordSet, weightsByGlyph } from './pseudoWords';
import { buildWordPool, hasSpellableWords } from './wordPool';

function weightedSample(items, weightOf, n, rng) {
  const out = [];
  if (!items.length) return out;
  for (let i = 0; i < n; i++) {
    const weights = items.map((it) => Math.max(0.05, weightOf(it)));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rng() * total;
    let chosen = items[items.length - 1];
    for (let j = 0; j < items.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        chosen = items[j];
        break;
      }
    }
    out.push(chosen);
  }
  return out;
}

// Stage 0: single-key reps + active-set bigrams, weak-key weighted.
function rudiments(activeCodes, codeWeights, rng) {
  const glyphs = activeCodes.map((c) => KEY_BY_CODE[c]?.cyrillic).filter(Boolean);
  const gW = weightsByGlyph(codeWeights);
  const wOf = (g) => gW[g] ?? 1;
  const chunks = [];
  // reps
  for (const g of weightedSample(glyphs, wOf, 3, rng)) chunks.push(g + g);
  // bigrams
  for (let i = 0; i < 5; i++) {
    const [a, b] = weightedSample(glyphs, wOf, 2, rng);
    chunks.push(a + b);
  }
  const tokens = chunks.map((c) => ({ cyrillic: c, meaning: null }));
  return { text: chunks.join(' '), tokens };
}

// The weakest active key codes, for UI focus hints.
function weakestCodes(activeCodes, codeWeights, k = 3) {
  return [...activeCodes].sort((a, b) => (codeWeights[b] ?? 0) - (codeWeights[a] ?? 0)).slice(0, k);
}

export function generateDrill({
  activeCodes,
  unlockedCodes,
  keys,
  stage,
  rng = Math.random,
}) {
  const codeWeights = keyWeights(activeCodes, keys);
  const focusCodes = weakestCodes(activeCodes, codeWeights);
  const weakGlyphs = new Set(focusCodes.map((c) => KEY_BY_CODE[c]?.cyrillic).filter(Boolean));

  // Resolve the effective stage with graceful fallback.
  let effective = stage;
  if (effective >= 2 && !hasSpellableWords(unlockedCodes, 6)) effective = 1;

  if (effective <= 0) {
    return { ...rudiments(activeCodes, codeWeights, rng), stage: 0, focusCodes };
  }

  if (effective === 1) {
    const words = generatePseudoWordSet(activeCodes, weightsByGlyph(codeWeights), 8, rng);
    if (!words.length) {
      return { ...rudiments(activeCodes, codeWeights, rng), stage: 0, focusCodes };
    }
    return {
      text: words.join(' '),
      tokens: words.map((w) => ({ cyrillic: w, meaning: null })),
      stage: 1,
      focusCodes,
    };
  }

  // Stage 2 / 3: real words (stage 3 strings several into a short phrase).
  const pool = buildWordPool(unlockedCodes, { weakGlyphs, limit: 120 });
  if (!pool.length) {
    const words = generatePseudoWordSet(activeCodes, weightsByGlyph(codeWeights), 8, rng);
    return {
      text: words.join(' '),
      tokens: words.map((w) => ({ cyrillic: w, meaning: null })),
      stage: 1,
      focusCodes,
    };
  }
  const count = effective >= 3 ? 5 : 7;
  const picked = weightedSample(pool, (it) => it.weight, count, rng);
  const tokens = picked.map((p) => ({ cyrillic: p.cyrillic, meaning: p.meaning }));
  return {
    text: tokens.map((t) => t.cyrillic).join(' '),
    tokens,
    stage: effective,
    focusCodes,
  };
}
