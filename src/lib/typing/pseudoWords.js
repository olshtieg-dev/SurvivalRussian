// Pronounceable Russian-ish pseudo-words built ONLY from the active key set.
// Syllable-template (CV / CVC) rather than a bigram Markov model: with a 4-key
// seed there is no corpus to train a Markov chain on, and templates guarantee
// speakable output (ru-RU TTS) that degrades gracefully as keys unlock.

import { VOWELS, SIGNS, KEY_BY_CODE } from '../../data/jcukenKeymap';

function activeGlyphs(activeCodes) {
  return activeCodes.map((c) => KEY_BY_CODE[c]?.cyrillic).filter(Boolean);
}

// Weighted pick: weakWeights bias selection toward weak keys when provided.
function pick(glyphs, weightFor) {
  if (!glyphs.length) return null;
  const weights = glyphs.map((g) => Math.max(0.05, weightFor ? weightFor(g) : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  // deterministic-ish but varied: caller passes rng
  return (rng) => {
    let r = rng() * total;
    for (let i = 0; i < glyphs.length; i++) {
      r -= weights[i];
      if (r <= 0) return glyphs[i];
    }
    return glyphs[glyphs.length - 1];
  };
}

// Build one pseudo-word from the active glyph set.
function makeWord(vowels, consonants, signs, pickVowel, pickCons, pickSign, rng) {
  if (!vowels.length) {
    // No vowel available yet (very early seed): fall back to consonant reps.
    if (!consonants.length) return '';
    const c = pickCons(rng);
    return c + c;
  }
  const syllables = 1 + Math.floor(rng() * 2.5); // 1..3
  let word = '';
  for (let s = 0; s < syllables; s++) {
    // optional onset consonant
    if (consonants.length && rng() < 0.85) word += pickCons(rng);
    // nucleus vowel (required)
    word += pickVowel(rng);
    // optional coda: a soft/hard sign or a consonant, but not at word start,
    // and avoid stacking >1 trailing consonant.
    if (s === syllables - 1 && signs.length && word.length > 1 && rng() < 0.18) {
      word += pickSign(rng);
    } else if (consonants.length && rng() < 0.3) {
      word += pickCons(rng);
    }
  }
  return word;
}

export function generatePseudoWord(activeCodes, weakWeights, rng = Math.random) {
  const glyphs = activeGlyphs(activeCodes);
  const vowels = glyphs.filter((g) => VOWELS.has(g));
  const signs = glyphs.filter((g) => SIGNS.has(g));
  const consonants = glyphs.filter((g) => !VOWELS.has(g) && !SIGNS.has(g));

  const weightFor = weakWeights ? (g) => weakWeights[g] ?? 1 : null;
  const pickVowel = pick(vowels, weightFor) || (() => '');
  const pickCons = pick(consonants, weightFor) || (() => '');
  const pickSign = pick(signs, weightFor) || (() => '');

  return makeWord(vowels, consonants, signs, pickVowel, pickCons, pickSign, rng);
}

export function generatePseudoWordSet(activeCodes, weakWeights, count = 8, rng = Math.random) {
  const out = [];
  let guard = 0;
  while (out.length < count && guard < count * 8) {
    guard += 1;
    const w = generatePseudoWord(activeCodes, weakWeights, rng);
    if (w && w.length >= 2) out.push(w);
  }
  return out;
}

// Map a per-CODE weight map (from mastery.keyWeights) onto a per-GLYPH map,
// which is what the generator consumes.
export function weightsByGlyph(codeWeights) {
  const out = {};
  for (const [code, w] of Object.entries(codeWeights)) {
    const g = KEY_BY_CODE[code]?.cyrillic;
    if (g) out[g] = w;
  }
  return out;
}
