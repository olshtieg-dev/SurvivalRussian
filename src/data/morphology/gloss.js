// Interlinear-gloss helper for the Morphology Lab. Reuses the app's single source
// of truth — vocabulary.json — so the lab's per-word glosses match the rest of
// the app (and benefit from its 0-missing-token coverage). Same key normaliser
// as page.js: NFC + lowercase + strip punctuation/symbols (combining stress marks
// are NOT stripped, but vocabulary keys are bare, and so is natural sentence text).

import vocabularyData from '../vocabulary.json';

export function normalizeVocabularyKey(text) {
  if (typeof text !== 'string') return '';
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/\p{M}+/gu, '') // drop combining stress marks — vocab keys are bare
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build the normalized → original-key index once at module load.
const NORMALIZED_INDEX = new Map();
for (const key of Object.keys(vocabularyData)) {
  const norm = normalizeVocabularyKey(key);
  if (norm && !NORMALIZED_INDEX.has(norm)) NORMALIZED_INDEX.set(norm, key);
}

// Short English gloss for one token, or '' if the word has no entry. Trims a
// multi-sense `literal` to its first sense so the interlinear line stays subtle.
export function glossFor(token) {
  const norm = normalizeVocabularyKey(token);
  if (!norm) return '';
  const key = NORMALIZED_INDEX.get(norm);
  if (!key) return '';
  const entry = vocabularyData[key];
  const literal = entry && typeof entry.literal === 'string' ? entry.literal.trim() : '';
  if (!literal) return '';
  return literal.split(/[;/]/)[0].trim();
}

// Tokenise a sentence into display chunks with attached glosses. Whitespace is
// dropped (the renderer lays words out with flex-wrap); punctuation stays glued
// to its word for display but is stripped for the lookup by normalizeVocabularyKey.
export function glossSentence(sentence) {
  if (typeof sentence !== 'string') return [];
  return sentence
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, gloss: glossFor(word), key: normalizeVocabularyKey(word) }));
}
