// Rule-based Russian noun declension engine for the Morphology Lab.
//
// This is a genuine (if pragmatic) decliner: it knows the twelve productive
// stem patterns, the spelling rules (и/ы, я/а, о/е after hushers), animacy in
// the accusative, and four common stress patterns. Stress is rendered with a
// combining acute (U+0301) in the DISPLAY forms only — the bare form (marks
// stripped) is what a learner would type.
//
// Two entry points:
//   • declineSpec(spec)          — decline a fully-specified curated noun
//   • declineCitation(word, opts)— best-effort decline of any typed noun
//
// Curated nouns (NOUN_BANK) are hand-checked and cover every pattern + the most
// common irregulars. Free typed input runs the same engine with the pattern and
// stress guessed from the ending, and is flagged `auto: true` so the UI can say
// "auto-generated, may miss irregular stress or fleeting vowels."

const ACUTE = '́';
const VOWELS = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';
const HUSHERS = 'жшщч';
const VELARS = 'кгх';

const isVowel = (ch) => VOWELS.includes(ch);
const stripAcute = (s) => s.replace(/́/g, '');
const countVowels = (s) => [...stripAcute(s)].filter(isVowel).length;
const lastChar = (s) => stripAcute(s).slice(-1);

function markLastVowel(stem) {
  const s = stripAcute(stem);
  for (let i = s.length - 1; i >= 0; i -= 1) {
    if (isVowel(s[i])) return `${s.slice(0, i + 1)}${ACUTE}${s.slice(i + 1)}`;
  }
  return s;
}

function markFirstVowel(ending) {
  for (let i = 0; i < ending.length; i += 1) {
    // ё is already inherently stressed — never add a mark to it.
    if (ending[i] === 'ё' || ending[i] === 'Ё') return ending;
    if (isVowel(ending[i])) return `${ending.slice(0, i + 1)}${ACUTE}${ending.slice(i + 1)}`;
  }
  return ending;
}

// Russian orthography never marks stress on a monosyllable — drop the acute if
// the assembled form has fewer than two vowels.
const demoteMonosyllable = (form) => (countVowels(form) < 2 ? stripAcute(form) : form);

// The twelve productive ending tables. Empty string = bare stem (null ending).
// Accusative for masc/neuter is computed from animacy, so it is omitted here;
// feminine accusative is spelled out because it has its own ending.
const ENDINGS = {
  'hard-m': {
    sg: { nom: '', gen: 'а', dat: 'у', ins: 'ом', pre: 'е' },
    pl: { nom: 'ы', gen: 'ов', dat: 'ам', ins: 'ами', pre: 'ах' },
  },
  'soft-m': {
    sg: { nom: 'ь', gen: 'я', dat: 'ю', ins: 'ем', pre: 'е' },
    pl: { nom: 'и', gen: 'ей', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'j-m': {
    sg: { nom: 'й', gen: 'я', dat: 'ю', ins: 'ем', pre: 'е' },
    pl: { nom: 'и', gen: 'ев', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'ij-m': {
    sg: { nom: 'й', gen: 'я', dat: 'ю', ins: 'ем', pre: 'и' },
    pl: { nom: 'и', gen: 'ев', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'hard-n': {
    sg: { nom: 'о', gen: 'а', dat: 'у', ins: 'ом', pre: 'е' },
    pl: { nom: 'а', gen: '', dat: 'ам', ins: 'ами', pre: 'ах' },
  },
  'soft-n': {
    sg: { nom: 'е', gen: 'я', dat: 'ю', ins: 'ем', pre: 'е' },
    pl: { nom: 'я', gen: 'ей', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'ije-n': {
    sg: { nom: 'е', gen: 'я', dat: 'ю', ins: 'ем', pre: 'и' },
    pl: { nom: 'я', gen: 'й', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'hard-f': {
    sg: { nom: 'а', gen: 'ы', dat: 'е', acc: 'у', ins: 'ой', pre: 'е' },
    pl: { nom: 'ы', gen: '', dat: 'ам', ins: 'ами', pre: 'ах' },
  },
  'soft-f': {
    sg: { nom: 'я', gen: 'и', dat: 'е', acc: 'ю', ins: 'ей', pre: 'е' },
    pl: { nom: 'и', gen: 'ь', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'ija-f': {
    sg: { nom: 'я', gen: 'и', dat: 'и', acc: 'ю', ins: 'ей', pre: 'и' },
    pl: { nom: 'и', gen: 'й', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  'third-f': {
    sg: { nom: 'ь', gen: 'и', dat: 'и', acc: 'ь', ins: 'ью', pre: 'и' },
    pl: { nom: 'и', gen: 'ей', dat: 'ям', ins: 'ями', pre: 'ях' },
  },
  // -мя neuters (имя, время). Oblique forms insert -ен-; handled specially.
  'mja-n': {
    sg: { nom: 'я', gen: 'ени', dat: 'ени', ins: 'енем', pre: 'ени' },
    pl: { nom: 'ена', gen: 'ён', dat: 'енам', ins: 'енами', pre: 'енах' },
  },
};

// Spelling rules applied to a bare ending given the stem's final consonant and
// whether the ending carries the stress. Returns the (possibly) adjusted ending.
function applySpelling(stem, ending, endingStressed) {
  if (!ending) return ending;
  const c = lastChar(stem);
  let out = ending;
  const first = out[0];

  // Rule 1 — ы becomes и after velars (к г х) and hushers (ж ш щ ч).
  if (first === 'ы' && (VELARS.includes(c) || HUSHERS.includes(c))) {
    out = `и${out.slice(1)}`;
  }
  // Rule 2 — я/ю become а/у after hushers (and ц).
  if (HUSHERS.includes(c) || c === 'ц') {
    if (out[0] === 'я') out = `а${out.slice(1)}`;
    else if (out[0] === 'ю') out = `у${out.slice(1)}`;
  }
  // Rule 3 — unstressed о becomes е after hushers and ц (мужем, дачей).
  if ((HUSHERS.includes(c) || c === 'ц') && out[0] === 'о' && !endingStressed) {
    out = `е${out.slice(1)}`;
  }
  return out;
}

// Assemble one case form from stem + ending, honoring the stress pattern.
// `stemMarked` already carries the acute on the stem-stressed vowel.
function assemble(stemMarked, ending, stemStressed) {
  const bareStem = stripAcute(stemMarked);
  const endingStressed = !stemStressed && countVowels(ending) > 0;
  const spelled = applySpelling(bareStem, ending, endingStressed);

  let form;
  if (stemStressed) {
    form = `${stemMarked}${spelled}`;
  } else if (countVowels(spelled) > 0) {
    form = `${bareStem}${markFirstVowel(spelled)}`;
  } else {
    // Null ending (e.g. masc nom sg) but the ending is stressed → the stress
    // lands on the last stem vowel.
    form = `${markLastVowel(bareStem)}${spelled}`;
  }
  return demoteMonosyllable(form);
}

const PL_OBLIQUE = ['gen', 'dat', 'ins', 'pre'];

// Is the stem stressed for this case under the given stress pattern?
//   a = stem always · b = ending always · c = stem in sg / ending in pl
//   f = ending in sg / stem in pl
//   e = stem everywhere except the plural oblique cases (typical of дверь, ночь)
function stemStressedFor(stress, number, caseKey) {
  switch (stress) {
    case 'a':
      return true;
    case 'b':
      return false;
    case 'c':
      return number === 'sg';
    case 'f':
      return number === 'pl';
    case 'e':
      return !(number === 'pl' && PL_OBLIQUE.includes(caseKey));
    default:
      return true;
  }
}

/**
 * Decline a fully specified noun.
 * spec = {
 *   stem,            // stem WITH acute on its stem-stressed vowel, e.g. 'до́м'
 *   pattern,         // one of ENDINGS keys
 *   gender,          // 'm' | 'f' | 'n'
 *   animate,         // boolean
 *   stress,          // 'a' | 'b' | 'c' | 'f'
 *   overrides,       // optional { sg:{...}, pl:{...} } fully-formed display forms
 * }
 */
export function declineSpec(spec) {
  const { stem, pattern, gender, animate = false, stress = 'a', overrides = {} } = spec;
  const table = ENDINGS[pattern];
  if (!table) return null;

  const build = (number) => {
    const row = {};
    ['nom', 'gen', 'dat', 'ins', 'pre'].forEach((k) => {
      const ending = table[number][k];
      row[k] = assemble(stem, ending, stemStressedFor(stress, number, k));
    });

    // Accusative: feminine singular has its own ending; everything else follows
    // the animacy rule (animate → genitive, inanimate → nominative).
    if (number === 'sg' && table.sg.acc !== undefined) {
      row.acc = assemble(stem, table.sg.acc, stemStressedFor(stress, number, 'acc'));
    } else {
      row.acc = animate ? row.gen : row.nom;
    }

    // Apply any per-form overrides (irregular plurals, fleeting-vowel genitives).
    const ov = overrides[number] || {};
    Object.keys(ov).forEach((k) => {
      row[k] = ov[k];
    });
    // Re-derive accusative if nom/gen were overridden and acc isn't animacy-fixed.
    if (!(number === 'sg' && table.sg.acc !== undefined) && !ov.acc) {
      row.acc = animate ? row.gen : row.nom;
    }
    return row;
  };

  return { sg: build('sg'), pl: build('pl') };
}

// --- Pattern / gender guessing for free typed input -------------------------

function guessSpec(word) {
  const w = stripAcute(word.trim().toLowerCase());
  if (!w) return null;
  const end = w.slice(-1);
  const end2 = w.slice(-2);

  // Feminine / masc -а, -я
  if (end === 'а') {
    return { stem: w.slice(0, -1), pattern: 'hard-f', gender: 'f' };
  }
  if (end2 === 'ия') {
    return { stem: w.slice(0, -1), pattern: 'ija-f', gender: 'f' };
  }
  if (end === 'я') {
    if (end2 === 'мя') return { stem: w.slice(0, -1), pattern: 'mja-n', gender: 'n' };
    return { stem: w.slice(0, -1), pattern: 'soft-f', gender: 'f' };
  }
  // Neuter -о, -е
  if (end === 'о') return { stem: w.slice(0, -1), pattern: 'hard-n', gender: 'n' };
  if (end2 === 'ие') return { stem: w.slice(0, -1), pattern: 'ije-n', gender: 'n' };
  if (end === 'е' || end === 'ё') return { stem: w.slice(0, -1), pattern: 'soft-n', gender: 'n' };
  // Masc -й / -ий
  if (end2 === 'ий') return { stem: w.slice(0, -1), pattern: 'ij-m', gender: 'm' };
  if (end === 'й') return { stem: w.slice(0, -1), pattern: 'j-m', gender: 'm' };
  // -ь is ambiguous (soft-m vs third-f). Default to third-f (statistically more
  // common) — the UI lets the learner flip gender.
  if (end === 'ь') return { stem: w.slice(0, -1), pattern: 'third-f', gender: 'f' };
  // Bare consonant → hard masculine.
  return { stem: w, pattern: 'hard-m', gender: 'm' };
}

/**
 * Best-effort decline of any typed noun. Guesses the pattern from the ending;
 * assumes fixed stem stress (the safest default). Result is flagged auto:true.
 * `genderHint` ('m'|'f') resolves the -ь ambiguity; `animate` toggles accusative.
 */
export function declineCitation(word, { genderHint, animate = false } = {}) {
  const guess = guessSpec(word);
  if (!guess) return null;

  let { stem, pattern, gender } = guess;
  if (genderHint && stem !== undefined) {
    if (genderHint === 'm' && pattern === 'third-f') {
      pattern = 'soft-m';
      gender = 'm';
    } else if (genderHint === 'f' && pattern === 'soft-m') {
      pattern = 'third-f';
      gender = 'f';
    }
  }

  // Keep the citation's own stress if the user typed one; else stress the last
  // stem vowel so at least the stem forms read naturally.
  const markedStem = word.includes(ACUTE) ? stripAcute(word).slice(0, stem.length) : stem;
  const stemForEngine = word.includes(ACUTE)
    ? reattachStress(word, stem)
    : markLastVowel(stem);

  const paradigm = declineSpec({
    stem: stemForEngine,
    pattern,
    gender,
    animate,
    stress: 'a',
  });
  if (!paradigm) return null;

  return {
    key: stripAcute(word).toLowerCase(),
    gloss: '',
    gender,
    animate,
    pattern,
    stress: 'a',
    bareStem: stripAcute(stemForEngine),
    auto: true,
    paradigm,
  };
}

// Move the user's typed stress mark onto the stem (best effort).
function reattachStress(word, stem) {
  const marked = word.trim().toLowerCase();
  const bare = stripAcute(marked);
  // Find the acute's position in the bare string.
  const idx = marked.indexOf(ACUTE);
  if (idx < 1) return markLastVowel(stem);
  const vowelPos = idx - 1; // index in bare of the stressed vowel
  if (vowelPos < stem.length) {
    return `${stem.slice(0, vowelPos + 1)}${ACUTE}${stem.slice(vowelPos + 1)}`;
  }
  return markLastVowel(stem);
}

// --- Curated noun bank -------------------------------------------------------
// Each entry: { key, gloss, gender, animate, pattern, stress, stem, overrides?, note }
// `stem` carries the acute on its stem-stressed vowel. Grouped for the UI.

const RAW_BANK = [
  // Hard masculine
  { key: 'дом', gloss: 'house, home', gender: 'm', animate: false, pattern: 'hard-m', stress: 'c', stem: 'до́м', overrides: { pl: { nom: 'дома́' } }, group: 'Masculine', note: 'Irregular nom. pl. дома́ (stressed -а); stress shifts to the ending throughout the plural.' },
  { key: 'стол', gloss: 'table', gender: 'm', animate: false, pattern: 'hard-m', stress: 'b', stem: 'стол', group: 'Masculine', note: 'Fixed ending stress — every oblique form pulls the accent onto the ending (стола́, столо́м).' },
  { key: 'город', gloss: 'city', gender: 'm', animate: false, pattern: 'hard-m', stress: 'c', stem: 'го́род', overrides: { pl: { nom: 'города́' } }, group: 'Masculine', note: 'Nom. pl. города́ takes the stressed -а ending, like дома́.' },
  { key: 'брат', gloss: 'brother', gender: 'm', animate: true, pattern: 'hard-m', stress: 'a', stem: 'бра́т', overrides: { pl: { nom: 'бра́тья', gen: 'бра́тьев', dat: 'бра́тьям', acc: 'бра́тьев', ins: 'бра́тьями', pre: 'бра́тьях' } }, group: 'Masculine', note: 'Animate: accusative copies the genitive (вижу бра́та). Collective -ья plural (бра́тья).' },
  { key: 'студент', gloss: 'student', gender: 'm', animate: true, pattern: 'hard-m', stress: 'a', stem: 'студе́нт', group: 'Masculine', note: 'Animate masculine: acc. = gen. in both numbers (студе́нта, студе́нтов).' },

  // Soft / -й masculine
  { key: 'конь', gloss: 'horse, steed', gender: 'm', animate: true, pattern: 'soft-m', stress: 'b', stem: 'кон', overrides: { pl: { nom: 'ко́ни', gen: 'коне́й', acc: 'коне́й' } }, group: 'Masculine', note: 'Soft-sign masculine: oblique endings are soft (коня́, конём). Animate → acc. = gen.' },
  { key: 'музей', gloss: 'museum', gender: 'm', animate: false, pattern: 'j-m', stress: 'a', stem: 'музе́', group: 'Masculine', note: '-й masculine: the й gives way to soft endings (музе́я, музе́ем, в музе́е).' },

  // Hard feminine -а
  { key: 'книга', gloss: 'book', gender: 'f', animate: false, pattern: 'hard-f', stress: 'a', stem: 'кни́г', group: 'Feminine', note: 'Velar stem: nom. pl. is кни́ги (ы→и after г). Fixed stem stress.' },
  { key: 'вода', gloss: 'water', gender: 'f', animate: false, pattern: 'hard-f', stress: 'f', stem: 'во́д', overrides: { sg: { acc: 'во́ду' } }, group: 'Feminine', note: 'Mobile stress: endings stressed in the singular (вода́, воды́) but the accusative pulls back to во́ду, and the plural is stem-stressed (во́ды).' },
  { key: 'рука', gloss: 'hand, arm', gender: 'f', animate: false, pattern: 'hard-f', stress: 'f', stem: 'ру́к', overrides: { sg: { acc: 'ру́ку' } }, group: 'Feminine', note: 'Velar stem (нет руки́) plus mobile stress: acc. sg. ру́ку and the whole plural are stem-stressed.' },
  { key: 'женщина', gloss: 'woman', gender: 'f', animate: true, pattern: 'hard-f', stress: 'a', stem: 'же́нщин', group: 'Feminine', note: 'Animate feminine: acc. sg. же́нщину, but acc. pl. = gen. pl. же́нщин.' },

  // Soft feminine -я / -ия
  { key: 'неделя', gloss: 'week', gender: 'f', animate: false, pattern: 'soft-f', stress: 'a', stem: 'неде́л', overrides: { pl: { gen: 'неде́ль' } }, group: 'Feminine', note: 'Soft feminine: gen. pl. takes a soft sign (неде́ль).' },
  { key: 'станция', gloss: 'station', gender: 'f', animate: false, pattern: 'ija-f', stress: 'a', stem: 'ста́нци', group: 'Feminine', note: '-ия feminine: dat./prep. sg. end in -и (на ста́нции), gen. pl. in -ий (ста́нций).' },

  // Third declension feminine -ь
  { key: 'дверь', gloss: 'door', gender: 'f', animate: false, pattern: 'third-f', stress: 'e', stem: 'две́р', group: 'Feminine', note: 'Third declension: soft sign throughout the singular (две́ри, две́рью). Plural obliques stress the ending (двере́й, дверя́м).' },
  { key: 'ночь', gloss: 'night', gender: 'f', animate: false, pattern: 'third-f', stress: 'e', stem: 'но́ч', group: 'Feminine', note: 'Husher stem: plural obliques spell -ам/-ами/-ах (ноча́м), not -ям, by the я→а rule.' },

  // Hard neuter -о
  { key: 'окно', gloss: 'window', gender: 'n', animate: false, pattern: 'hard-n', stress: 'f', stem: 'о́кн', overrides: { pl: { gen: 'о́кон' } }, group: 'Neuter', note: 'Singular is ending-stressed (окно́, окна́); the plural jumps to the stem (о́кна) with a fleeting-vowel genitive о́кон.' },
  { key: 'слово', gloss: 'word', gender: 'n', animate: false, pattern: 'hard-n', stress: 'c', stem: 'сло́в', overrides: { pl: { nom: 'слова́', gen: 'слов' } }, group: 'Neuter', note: 'Stem-stressed singular, ending-stressed plural (слова́, слова́ми); bare genitive plural слов.' },
  { key: 'место', gloss: 'place, spot', gender: 'n', animate: false, pattern: 'hard-n', stress: 'c', stem: 'ме́ст', overrides: { pl: { nom: 'места́', gen: 'мест' } }, group: 'Neuter', note: 'Like слово: the plural stresses the ending (места́), genitive is bare мест.' },

  // Soft neuter -е / -ие / -мя
  { key: 'море', gloss: 'sea', gender: 'n', animate: false, pattern: 'soft-n', stress: 'a', stem: 'мо́р', overrides: { pl: { nom: 'моря́', gen: 'море́й', dat: 'моря́м', acc: 'моря́', ins: 'моря́ми', pre: 'моря́х' } }, group: 'Neuter', note: 'Soft neuter: singular stem-stressed (мо́ре), plural pulls to the ending (моря́, море́й).' },
  { key: 'здание', gloss: 'building', gender: 'n', animate: false, pattern: 'ije-n', stress: 'a', stem: 'зда́ни', group: 'Neuter', note: '-ие neuter: prep. sg. ends in -и (в зда́нии), gen. pl. in -ий (зда́ний).' },
  { key: 'имя', gloss: 'name', gender: 'n', animate: false, pattern: 'mja-n', stress: 'a', stem: 'и́м', overrides: { pl: { nom: 'имена́', gen: 'имён', dat: 'имена́м', acc: 'имена́', ins: 'имена́ми', pre: 'имена́х' } }, group: 'Neuter', note: '-мя neuter: singular inserts a stem-stressed -ен- (и́мени, и́менем); the plural shifts to the ending (имена́, имён).' },
];

// Attach the computed paradigm to every curated noun once, at module load.
export const NOUN_BANK = RAW_BANK.map((entry) => ({
  ...entry,
  bareStem: stripAcute(entry.stem),
  paradigm: declineSpec(entry),
  auto: false,
}));

export const NOUN_BANK_BY_KEY = NOUN_BANK.reduce((acc, n) => {
  acc[n.key] = n;
  return acc;
}, {});

export const NOUN_GROUPS = ['Masculine', 'Feminine', 'Neuter'];

export const PATTERN_LABELS = {
  'hard-m': 'hard masculine',
  'soft-m': 'soft (-ь) masculine',
  'j-m': '-й masculine',
  'ij-m': '-ий masculine',
  'hard-n': 'hard (-о) neuter',
  'soft-n': 'soft (-е) neuter',
  'ije-n': '-ие neuter',
  'mja-n': '-мя neuter',
  'hard-f': 'hard (-а) feminine',
  'soft-f': 'soft (-я) feminine',
  'ija-f': '-ия feminine',
  'third-f': 'third-declension (-ь) feminine',
};

export const STRESS_LABELS = {
  a: 'fixed stem stress',
  b: 'fixed ending stress',
  c: 'stem stress (sg) → ending stress (pl)',
  f: 'ending stress (sg) → stem stress (pl)',
};

// Split a display form into { stem, ending } for the ending-highlight UI, by
// aligning the bare form against the bare nominative-singular stem.
export function splitStemEnding(displayForm, bareStem) {
  const bare = stripAcute(displayForm);
  const stem = stripAcute(bareStem);
  // Longest common prefix between the form and the citation stem.
  let i = 0;
  while (i < bare.length && i < stem.length && bare[i] === stem[i]) i += 1;
  // Walk the acute-bearing string to the same bare index.
  let bareCount = 0;
  let cut = 0;
  for (; cut < displayForm.length; cut += 1) {
    if (displayForm[cut] === ACUTE) continue;
    if (bareCount === i) break;
    bareCount += 1;
  }
  return { stem: displayForm.slice(0, cut), ending: displayForm.slice(cut) };
}

export { stripAcute };
