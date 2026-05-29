// Client-side drill builder backing the Phrase Lab (FeatureDock "ai" socket).
// No external API: phrases are composed locally and validated against the
// existing vocabulary deck, then emitted in the standard mission shape so they
// can later be wired straight into the typing surface.

import vocabularyData from './vocabulary.json';

export const CUSTOM_DRILLS_STORAGE_KEY = 'survival-russian-custom-drills-v1';
// Staging area for words a user typed that are not yet in vocabulary.json.
// These resolve in the builder/preview like real entries but stay flagged
// `isTemp` so a later pass can graduate them into the main deck.
export const TEMP_VOCAB_STORAGE_KEY = 'survival-russian-temp-vocab-v1';

// Everything here lives client-side only (localStorage) — nothing is ever sent
// to a server. These caps keep that local store bounded so a runaway paste or
// loop can't bloat the browser's storage quota.
export const LIMITS = {
  sets: 50, // max saved drill sets
  phrasesPerSet: 200, // max sentences in one set
  phraseChars: 300, // max characters per sentence
  nameChars: 60, // max characters in a set name
  tempVocab: 500, // max staged (pending) vocab entries
  fieldChars: 200, // max characters per temp-vocab gloss field
};

function clampText(text, max) {
  return typeof text === 'string' ? text.slice(0, max) : '';
}

// Mirrors page.js normalizeVocabularyKey so token lookups match the live cursor.
export function normalizeToken(text) {
  if (typeof text !== 'string') return '';

  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const vocabularyLookup = new Map(
  Object.keys(vocabularyData).map((wordKey) => [normalizeToken(wordKey), wordKey])
);

// Resolve a token against the main deck first, then the optional temp map.
// Resolved entries carry `isTemp` so the UI can flag staged words.
export function lookupVocabulary(token, tempVocab = null) {
  const normalized = normalizeToken(token);
  const key = vocabularyLookup.get(normalized);
  if (key) return { key, ...vocabularyData[key], isTemp: false };

  if (tempVocab && tempVocab[normalized]) {
    return { ...tempVocab[normalized], isTemp: true };
  }

  return null;
}

// Split a phrase into tokens, each tagged with its vocab entry (or null).
// A null vocab means the live MeaningCard would render empty for that word.
export function tokenizePhrase(phrase, tempVocab = null) {
  if (typeof phrase !== 'string') return [];

  return phrase
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => ({ raw, normalized: normalizeToken(raw), vocab: lookupVocabulary(raw, tempVocab) }));
}

// Search the corpus: Cyrillic queries match by prefix, Latin queries match
// inside the literal/natural gloss. Single-word entries only (drill-friendly).
export function searchVocabulary(query, limit = 24) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  const isCyrillic = /[а-яё]/i.test(q);
  const results = [];

  for (const [key, entry] of Object.entries(vocabularyData)) {
    const cyrillic = (entry.cyrillic || key).trim();
    if (!cyrillic || /\s/.test(cyrillic)) continue;

    const matches = isCyrillic
      ? cyrillic.toLowerCase().startsWith(q)
      : `${entry.literal || ''} ${entry.natural || ''}`.toLowerCase().includes(q);

    if (matches) {
      results.push({ key, ...entry });
      if (results.length >= limit) break;
    }
  }

  return results;
}

// Pull N random single-word entries as a quick starter set.
export function sampleVocabulary(count = 8) {
  const pool = Object.values(vocabularyData)
    .map((entry) => (entry.cyrillic || '').trim())
    .filter((cyrillic) => cyrillic && !/\s/.test(cyrillic));

  const picked = [];
  const used = new Set();
  const max = Math.min(count, pool.length);

  while (picked.length < max) {
    const index = Math.floor(Math.random() * pool.length);
    if (used.has(index)) continue;
    used.add(index);
    picked.push(pool[index]);
  }

  return picked;
}

// Compact, paren-safe per-token tag string for the analysis renderer.
function buildTokenTags(token) {
  if (!token.vocab) return '';

  const source = (token.vocab.analysis || token.vocab.natural || token.vocab.literal || '').trim();
  const firstSentence = source.split('. ')[0] || source;
  let tags = firstSentence
    .replace(/[()|]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\.\s*$/, '')
    .trim();

  if (tags.length > 90) tags = `${tags.slice(0, 88).trim()}…`;
  return tags;
}

function buildTokenChunk(token) {
  const display = token.vocab?.cyrillic?.trim() || token.raw;
  const tags = buildTokenTags(token);
  return tags ? `${display} (${tags})` : display;
}

// Build a single mission in the exact shape page.js / the analysis card expect.
// `Per-token:` framing makes it render with the color-coded gloss chips.
export function buildMissionFromPhrase(phrase, index = 0, idPrefix = 'CUSTOM', tempVocab = null) {
  const trimmed = (phrase || '').trim();
  const tokens = tokenizePhrase(trimmed, tempVocab);
  const known = tokens.filter((token) => token.vocab);
  const focus = known[0]?.vocab || null;
  const focusWord = focus?.cyrillic?.trim() || tokens[0]?.raw || '';

  const perToken = tokens.map(buildTokenChunk).join(' | ');
  const literal = known
    .map((token) => token.vocab.natural || token.vocab.literal)
    .filter(Boolean)
    .join(' · ');
  const note = `Custom drill — ${known.length}/${tokens.length} word${tokens.length === 1 ? '' : 's'} matched in the vocabulary deck.`;

  return {
    id: `${idPrefix}-${index + 1}`,
    word: focusWord,
    phrase: trimmed,
    literal,
    fullAnalysis: `Focus word: ${focusWord}. Per-token: ${perToken}. ${note}`,
  };
}

// Turn a saved set's stored phrases into ready-to-play missions.
export function buildMissionsForSet(set, tempVocab = null) {
  const phrases = Array.isArray(set?.phrases) ? set.phrases : [];
  const prefix = (set?.id || 'CUSTOM').toString().toUpperCase().slice(0, 12);

  return phrases
    .map((phrase) => phrase.trim())
    .filter(Boolean)
    .map((phrase, index) => buildMissionFromPhrase(phrase, index, prefix, tempVocab));
}

// Coerce arbitrary input into a bounded, well-formed drill set.
export function sanitizeDrillSet(set) {
  const phrases = (Array.isArray(set?.phrases) ? set.phrases : [])
    .map((phrase) => clampText(phrase, LIMITS.phraseChars).trim())
    .filter(Boolean)
    .slice(0, LIMITS.phrasesPerSet);

  return {
    id: clampText(set?.id, 40) || `set-${phrases.length}`,
    name: clampText(set?.name, LIMITS.nameChars).trim() || 'Untitled set',
    createdAt: typeof set?.createdAt === 'number' ? set.createdAt : 0,
    phrases,
  };
}

export function loadCustomDrillSets() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CUSTOM_DRILLS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, LIMITS.sets).map(sanitizeDrillSet);
  } catch (error) {
    return [];
  }
}

export function saveCustomDrillSets(sets) {
  if (typeof window === 'undefined') return [];

  const bounded = (Array.isArray(sets) ? sets : [])
    .slice(0, LIMITS.sets)
    .map(sanitizeDrillSet);

  try {
    window.localStorage.setItem(CUSTOM_DRILLS_STORAGE_KEY, JSON.stringify(bounded));
  } catch (error) {
    // Ignore storage failures so the builder keeps working in-session.
  }

  return bounded;
}

// --- Temp (pending) vocabulary ------------------------------------------

// Build a staged vocab entry from a quick gloss. Keyed by normalized form so
// it resolves through the same tokenizer the live cursor uses.
export function makeTempVocabEntry({ cyrillic, literal, natural, analysis } = {}) {
  const display = clampText(cyrillic, LIMITS.fieldChars).trim();
  const literalText = clampText(literal, LIMITS.fieldChars).trim();
  const naturalText = clampText(natural, LIMITS.fieldChars).trim();

  return {
    key: display,
    cyrillic: display,
    literal: literalText || display,
    natural: naturalText || literalText || display,
    analysis:
      clampText(analysis, LIMITS.fieldChars).trim() ||
      'Pending entry staged in the Phrase Lab; not yet in the main vocabulary deck.',
    synonym: ' ',
    antonym: ' ',
    isTemp: true,
  };
}

export function loadTempVocabulary() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(TEMP_VOCAB_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

export function saveTempVocabulary(map) {
  if (typeof window === 'undefined') return {};

  const entries = Object.entries(map && typeof map === 'object' ? map : {}).slice(
    0,
    LIMITS.tempVocab
  );
  const bounded = Object.fromEntries(entries);

  try {
    window.localStorage.setItem(TEMP_VOCAB_STORAGE_KEY, JSON.stringify(bounded));
  } catch (error) {
    // Ignore storage failures so staging keeps working in-session.
  }

  return bounded;
}

// Add/replace a staged entry, returning the new map (does not persist).
export function upsertTempVocabulary(map, entry) {
  const safeMap = map && typeof map === 'object' ? map : {};
  const normalized = normalizeToken(entry?.cyrillic);
  if (!normalized) return safeMap;

  return { ...safeMap, [normalized]: makeTempVocabEntry(entry) };
}
