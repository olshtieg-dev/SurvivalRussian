// Real-word pool: frequency-ranked Russian words filtered to those fully
// spellable with the learner's currently unlocked keys, with weak-key boosting
// and meaning chips pulled from vocabulary.json.

import frequencyData from '../../data/russian-frequency-1-1000.json';
import vocabulary from '../../data/vocabulary.json';
import { KEY_BY_CODE } from '../../data/jcukenKeymap';

const RANKED_WORDS = (frequencyData.words || []).filter((w) => /^[\p{Script=Cyrillic}ё-]+$/u.test(w));

function unlockedGlyphSet(unlockedCodes) {
  const set = new Set();
  for (const code of unlockedCodes) {
    const g = KEY_BY_CODE[code]?.cyrillic;
    if (g) set.add(g);
  }
  return set;
}

export function spellable(word, glyphSet) {
  for (const ch of word) {
    if (ch === '-') continue; // hyphenated compounds: the hyphen has a home key
    if (!glyphSet.has(ch)) return false;
  }
  return true;
}

function meaningFor(word) {
  const entry = vocabulary[word];
  if (!entry) return null;
  const m = entry.literal && entry.literal.trim() !== '' ? entry.literal : entry.natural;
  return m && m.trim() ? m.trim() : null;
}

// Returns up to `limit` words, frequency-weighted, boosted when they exercise a
// weak key. weakGlyphs is a Set of currently-weak Cyrillic letters.
export function buildWordPool(unlockedCodes, { weakGlyphs = new Set(), limit = 120 } = {}) {
  const glyphSet = unlockedGlyphSet(unlockedCodes);
  const pool = [];
  for (let rank = 0; rank < RANKED_WORDS.length; rank++) {
    const word = RANKED_WORDS[rank];
    if (word.length < 2) continue;
    if (!spellable(word, glyphSet)) continue;
    const weakHits = [...word].filter((ch) => weakGlyphs.has(ch)).length;
    pool.push({
      cyrillic: word,
      meaning: meaningFor(word),
      rank,
      weakHits,
      // lower rank (more frequent) and more weak-key coverage => higher weight
      weight: 1 / Math.log(rank + 3) + weakHits * 0.6,
    });
    if (pool.length >= limit) break;
  }
  return pool;
}

export function hasSpellableWords(unlockedCodes, minCount = 6) {
  const glyphSet = unlockedGlyphSet(unlockedCodes);
  let n = 0;
  for (const word of RANKED_WORDS) {
    if (word.length >= 2 && spellable(word, glyphSet)) {
      n += 1;
      if (n >= minCount) return true;
    }
  }
  return false;
}
