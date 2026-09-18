// Morpheme data for the Rolodex module — now a three-reel machine: PREFIX × ROOT
// × SUFFIX. Rather than let learners spin nonsense, each root carries a map of
// *attested* builds keyed `${prefix}|${suffix}`. Spinning lands on real Russian
// words (verb, agent noun, action noun, result noun, adjective…); free-mixing a
// prefix and suffix that don't form a standard word is shown as such, so the
// difference between productive and dead combinations stays visible.
//
// The stored `word` is the real surface form (which often mutates the root:
// пис→пись, да→даж, став→ставл), so the UI shows the real word rather than a
// naive concatenation of the three morphemes.

// Reference glosses for the common verbal prefixes (shown as the prefix reel spins).
export const PREFIX_GLOSSES = {
  'по-': 'a little / do briefly, or perfective',
  'на-': 'onto / accumulate a quantity',
  'за-': 'begin, behind, or drop by',
  'пере-': 're- / across / over again',
  'вы-': 'out, outward',
  'в-': 'in, into',
  'при-': 'arrival / attaching to',
  'у-': 'away, off',
  'про-': 'through / past / miss',
  'раз-': 'apart / un- / intensely',
  'рас-': 'apart / un- (before voiceless)',
  'от-': 'away from / back',
  'под-': 'up to / from below',
  'о-': 'around / all over',
  'об-': 'around, about',
  'с-': 'down, off / together',
  'до-': 'up to a limit / finish',
  'из-': 'out of (bookish)',
  'пред-': 'pre-, before, in front',
};

// Suffix reel labels. 'Ø' marks a zero-suffix noun (derived straight off the
// prefixed stem, e.g. вы+ход = вы́ход). Per-root glosses live on each family so
// the same suffix can be described in context.
export const ZERO_SUFFIX = 'Ø';

const buildKey = (prefix, suffix) => `${prefix}|${suffix}`;
export { buildKey };

// Each family: a root + the prefixes and suffixes that appear in its attested
// builds, plus the builds map itself. `prefix: ''` = no prefix.
export const WORD_FAMILIES = [
  {
    id: 'pisa',
    root: 'пис',
    rootGloss: 'write',
    prefixes: ['', 'на', 'за', 'под', 'пере', 'вы', 'с', 'о', 'рас'],
    suffixes: [
      { s: 'ать', gloss: 'verb — infinitive', pos: 'verb' },
      { s: 'атель', gloss: 'agent noun — “-er”', pos: 'noun' },
      { s: 'ание', gloss: 'action noun — “-ing”', pos: 'noun' },
      { s: 'ка', gloss: 'result noun (fem.)', pos: 'noun' },
      { s: 'ь', gloss: 'result noun (soft)', pos: 'noun' },
    ],
    builds: {
      '|ать': { word: 'писать', gloss: 'to write' },
      'на|ать': { word: 'написать', gloss: 'to write (finish) — perfective' },
      'за|ать': { word: 'записать', gloss: 'to write down, jot' },
      'под|ать': { word: 'подписать', gloss: 'to sign (write under)' },
      'пере|ать': { word: 'переписать', gloss: 'to rewrite, copy out' },
      'вы|ать': { word: 'выписать', gloss: 'to write out, discharge' },
      'с|ать': { word: 'списать', gloss: 'to copy off, crib' },
      'о|ать': { word: 'описать', gloss: 'to describe' },
      '|атель': { word: 'писатель', gloss: 'writer' },
      '|ание': { word: 'писание', gloss: 'writing; Scripture' },
      'о|ание': { word: 'описание', gloss: 'description' },
      'рас|ание': { word: 'расписание', gloss: 'timetable, schedule' },
      'за|ка': { word: 'записка', gloss: 'a note' },
      'пере|ка': { word: 'переписка', gloss: 'correspondence' },
      'под|ь': { word: 'подпись', gloss: 'signature' },
      'за|ь': { word: 'запись', gloss: 'a recording; an entry' },
    },
  },
  {
    id: 'hod',
    root: 'ход',
    rootGloss: 'go, move',
    prefixes: ['', 'в', 'вы', 'при', 'у', 'пере', 'про', 'по', 'до', 'рас', 'на'],
    suffixes: [
      { s: 'ить', gloss: 'verb — infinitive', pos: 'verb' },
      { s: 'Ø', gloss: 'zero-suffix noun (masc.)', pos: 'noun' },
      { s: 'ка', gloss: 'result noun (fem.)', pos: 'noun' },
      { s: 'ной', gloss: 'adjective — “-al / -ly”', pos: 'adj' },
    ],
    builds: {
      '|ить': { word: 'ходить', gloss: 'to go on foot, walk' },
      'в|ить': { word: 'входить', gloss: 'to enter, go in' },
      'вы|ить': { word: 'выходить', gloss: 'to exit, go out' },
      'при|ить': { word: 'приходить', gloss: 'to arrive, come' },
      'у|ить': { word: 'уходить', gloss: 'to leave, go away' },
      'пере|ить': { word: 'переходить', gloss: 'to cross, go across' },
      'про|ить': { word: 'проходить', gloss: 'to pass by, go through' },
      'вы|Ø': { word: 'выход', gloss: 'exit, way out' },
      'в|Ø': { word: 'вход', gloss: 'entrance, way in' },
      'по|Ø': { word: 'поход', gloss: 'a hike; a campaign' },
      'пере|Ø': { word: 'переход', gloss: 'crossing; transition' },
      'при|Ø': { word: 'приход', gloss: 'arrival; a parish' },
      'до|Ø': { word: 'доход', gloss: 'income' },
      'рас|Ø': { word: 'расход', gloss: 'expense, outlay' },
      'про|Ø': { word: 'проход', gloss: 'passage, passageway' },
      'на|ка': { word: 'находка', gloss: 'a find, a discovery' },
      'по|ка': { word: 'походка', gloss: 'gait, way of walking' },
      'вы|ной': { word: 'выходной', gloss: 'day off; “output/exit-” adj.' },
    },
  },
  {
    id: 'da',
    root: 'да',
    rootGloss: 'give',
    prefixes: ['', 'от', 'про', 'за', 'пере', 'с', 'раз', 'из'],
    suffixes: [
      { s: 'ть', gloss: 'verb — infinitive', pos: 'verb' },
      { s: 'ча', gloss: 'action/result noun (fem.)', pos: 'noun' },
      { s: 'жа', gloss: 'result noun (fem.)', pos: 'noun' },
      { s: 'ание', gloss: 'action noun — “-ing”', pos: 'noun' },
      { s: 'атель', gloss: 'agent noun — “-er”', pos: 'noun' },
    ],
    builds: {
      '|ть': { word: 'дать', gloss: 'to give' },
      'от|ть': { word: 'отдать', gloss: 'to give back, return' },
      'про|ть': { word: 'продать', gloss: 'to sell' },
      'за|ть': { word: 'задать', gloss: 'to assign, set (a task)' },
      'пере|ть': { word: 'передать', gloss: 'to pass on, transmit' },
      'с|ть': { word: 'сдать', gloss: 'to hand in, pass (an exam)' },
      'раз|ть': { word: 'раздать', gloss: 'to distribute, give out' },
      'из|ть': { word: 'издать', gloss: 'to publish, issue' },
      '|ча': { word: 'дача', gloss: 'a dacha; a giving' },
      'пере|ча': { word: 'передача', gloss: 'transmission, broadcast' },
      'за|ча': { word: 'задача', gloss: 'task, problem' },
      'с|ча': { word: 'сдача', gloss: 'change (money); handing over' },
      'раз|ча': { word: 'раздача', gloss: 'distribution, handout' },
      'про|жа': { word: 'продажа', gloss: 'a sale' },
      'из|ание': { word: 'издание', gloss: 'edition; publishing' },
      'из|атель': { word: 'издатель', gloss: 'publisher' },
    },
  },
  {
    id: 'govor',
    root: 'говор',
    rootGloss: 'speak, talk',
    prefixes: ['', 'по', 'у', 'от', 'за', 'об', 'раз', 'до', 'при', 'пере'],
    suffixes: [
      { s: 'ить', gloss: 'verb — infinitive', pos: 'verb' },
      { s: 'Ø', gloss: 'zero-suffix noun (masc.)', pos: 'noun' },
      { s: 'ка', gloss: 'result noun (fem.)', pos: 'noun' },
      { s: 'ы', gloss: 'plural-only noun', pos: 'noun' },
    ],
    builds: {
      '|ить': { word: 'говорить', gloss: 'to speak, talk' },
      'по|ить': { word: 'поговорить', gloss: 'to have a talk (a while)' },
      'у|ить': { word: 'уговорить', gloss: 'to persuade, talk into' },
      'от|ить': { word: 'отговорить', gloss: 'to talk out of, dissuade' },
      'за|ить': { word: 'заговорить', gloss: 'to start talking; cast a spell' },
      'об|ить': { word: 'обговорить', gloss: 'to talk over, discuss' },
      '|Ø': { word: 'говор', gloss: 'dialect, accent' },
      'раз|Ø': { word: 'разговор', gloss: 'a conversation' },
      'до|Ø': { word: 'договор', gloss: 'a contract, agreement' },
      'за|Ø': { word: 'заговор', gloss: 'a conspiracy; a spell' },
      'у|Ø': { word: 'уговор', gloss: 'an agreement; persuasion' },
      'при|Ø': { word: 'приговор', gloss: 'a verdict, sentence' },
      'по|ка': { word: 'поговорка', gloss: 'a saying, proverb' },
      'пере|ы': { word: 'переговоры', gloss: 'negotiations, talks' },
    },
  },
  {
    id: 'smotr',
    root: 'смотр',
    rootGloss: 'look, watch',
    prefixes: ['', 'по', 'о', 'пере', 'рас', 'вы', 'при', 'про', 'до'],
    suffixes: [
      { s: 'еть', gloss: 'verb — infinitive', pos: 'verb' },
      { s: 'Ø', gloss: 'zero-suffix noun (masc.)', pos: 'noun' },
      { s: 'итель', gloss: 'agent noun — “-er”', pos: 'noun' },
    ],
    builds: {
      '|еть': { word: 'смотреть', gloss: 'to look, watch' },
      'по|еть': { word: 'посмотреть', gloss: 'to take a look — perfective' },
      'о|еть': { word: 'осмотреть', gloss: 'to examine, inspect' },
      'пере|еть': { word: 'пересмотреть', gloss: 'to review, reconsider' },
      'рас|еть': { word: 'рассмотреть', gloss: 'to make out, scrutinise' },
      'вы|еть': { word: 'высмотреть', gloss: 'to spot, spy out' },
      'при|еть': { word: 'присмотреть', gloss: 'to keep an eye on' },
      '|Ø': { word: 'смотр', gloss: 'a review, a parade' },
      'о|Ø': { word: 'осмотр', gloss: 'inspection, examination' },
      'про|Ø': { word: 'просмотр', gloss: 'a viewing, screening' },
      'пере|Ø': { word: 'пересмотр', gloss: 'a review, revision' },
      'до|Ø': { word: 'досмотр', gloss: 'a search (e.g. customs)' },
      '|итель': { word: 'смотритель', gloss: 'warden, keeper' },
    },
  },
  {
    id: 'stav',
    root: 'став',
    rootGloss: 'put, place, stand',
    prefixes: ['', 'по', 'при', 'за', 'до', 'от', 'рас', 'у', 'о', 'пред'],
    suffixes: [
      { s: 'ить', gloss: 'verb — infinitive', pos: 'verb' },
      { s: 'ка', gloss: 'result noun (fem.)', pos: 'noun' },
      { s: 'ление', gloss: 'action noun — “-ment / -ing”', pos: 'noun' },
    ],
    builds: {
      '|ить': { word: 'ставить', gloss: 'to put, place, stand (sth)' },
      'по|ить': { word: 'поставить', gloss: 'to put, place — perfective' },
      'при|ить': { word: 'приставить', gloss: 'to lean against; appoint' },
      'за|ить': { word: 'заставить', gloss: 'to force, make (do)' },
      'до|ить': { word: 'доставить', gloss: 'to deliver' },
      'от|ить': { word: 'отставить', gloss: 'to set aside, move away' },
      'рас|ить': { word: 'расставить', gloss: 'to arrange, place apart' },
      'по|ка': { word: 'поставка', gloss: 'supply, delivery' },
      'у|ка': { word: 'установка', gloss: 'installation, setup' },
      'о|ка': { word: 'остановка', gloss: 'a stop (e.g. bus stop)' },
      'за|ка': { word: 'заставка', gloss: 'a screensaver; an intro' },
      'пред|ление': { word: 'представление', gloss: 'a performance; an idea' },
      'у|ление': { word: 'установление', gloss: 'establishment, setting-up' },
    },
  },
];

export const FAMILY_BY_ID = WORD_FAMILIES.reduce((acc, f) => {
  acc[f.id] = f;
  return acc;
}, {});

// Look up an attested build for a prefix + suffix within a family, or null.
export function lookupBuild(family, prefix, suffix) {
  return family.builds[buildKey(prefix, suffix)] || null;
}

// All attested (prefix, suffix, word, gloss) builds of a family, for the chip list.
export function familyBuilds(family) {
  return Object.entries(family.builds).map(([key, val]) => {
    const [prefix, suffix] = key.split('|');
    return { prefix, suffix, ...val };
  });
}
