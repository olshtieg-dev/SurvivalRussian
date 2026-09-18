// Verb Government (rection) data for the Morphology Lab exposé.
//
// The star fact: in Russian the VERB decides the case of its object, so swapping
// the verb re-inflects the ending of everything downstream. This module stitches
// the conjugation engine (verb agrees with the subject) and the declension engine
// (object bends to the governed case) into ready-to-render sentences, plus a
// guided three-act walkthrough that reveals the phenomenon.

import { VERB_BANK, VERB_BANK_BY_KEY } from './conjugator';
import { NOUN_BANK_BY_KEY, splitStemEnding } from './decliner';
import { CASE_BY_KEY } from './cases';

export const GOV_SUBJECTS = [
  { person: 'sg1', display: 'Я' },
  { person: 'sg2', display: 'Ты' },
  { person: 'sg3', display: 'Она́' },
  { person: 'pl1', display: 'Мы' },
  { person: 'pl3', display: 'Они́' },
];

const SUBJECT_BY_PERSON = GOV_SUBJECTS.reduce((acc, s) => {
  acc[s.person] = s;
  return acc;
}, {});

// Split a conjugated verb form into { stem, ending } by aligning it against the
// infinitive stem, so the personal ending can be highlighted (agreement act).
export function splitVerbEnding(form, infinitive) {
  if (!form || form.includes(' ')) return { stem: form, ending: '' };
  const strip = (s) => s.replace(/́/g, '');
  const bare = strip(form);
  const infStem = strip(infinitive).replace(/(ться|ть|ти|чь)$/u, '');
  let i = 0;
  while (i < bare.length && i < infStem.length && bare[i] === infStem[i]) i += 1;
  if (i < 2) return { stem: form, ending: '' };
  let bareCount = 0;
  let cut = 0;
  for (; cut < form.length; cut += 1) {
    if (form[cut] === '́') continue;
    if (bareCount === i) break;
    bareCount += 1;
  }
  return { stem: form.slice(0, cut), ending: form.slice(cut) };
}

/**
 * Build one fully-rendered government sentence. Handles one OR two governed
 * objects — a verb's `frame` (ordered slots) drives ditransitives; a single
 * `governs` is normalised into a one-slot frame.
 * @returns { subject, verb (+ split), objects: [{stem, ending, prep, caseInfo, …}] }
 */
export function buildSentence({ person, verb, nouns, number = 'sg' }) {
  const v = VERB_BANK_BY_KEY[verb];
  if (!v) return null;

  const set = v.aspect === 'perf' ? v.forms.future : v.forms.present;
  const verbForm = set ? set[person] : v.infinitive;
  const verbSplit = splitVerbEnding(verbForm, v.infinitive);
  const subject = SUBJECT_BY_PERSON[person];

  const frame = v.frame || (v.governs ? [v.governs] : []);
  const objects = frame
    .map((slot, i) => {
      const n = NOUN_BANK_BY_KEY[nouns[i]];
      if (!n) return null;
      const form = n.paradigm[number][slot.case];
      const split = splitStemEnding(form, n.bareStem);
      return {
        form,
        stem: split.stem,
        ending: split.ending,
        prep: slot.prep || null,
        caseKey: slot.case,
        caseInfo: CASE_BY_KEY[slot.case],
        nounNom: n.paradigm.sg.nom,
        nounGloss: n.gloss,
      };
    })
    .filter(Boolean);

  return {
    person,
    subjectDisplay: subject.display,
    verbForm,
    verbStem: verbSplit.stem,
    verbEnding: verbSplit.ending,
    verbInfinitive: v.infinitive,
    verbGloss: v.gloss,
    objects,
  };
}

// The guided three-act exposé. `vary: 'verb'` scenes hold subject + object fixed
// and change the verb (the reveal); `vary: 'subject'` holds verb + object fixed
// and changes the subject (agreement, the contrast act).
export const GOV_SCENES = [
  {
    id: 'brother',
    title: 'The verb picks the case',
    vary: 'verb',
    fixedSubject: 'sg1',
    object: 'брат',
    lede:
      'Keep the subject «я» and the object «брат» fixed. Change only the verb — and the ending of брат walks through four different cases. The verb, not the noun, is in charge.',
    steps: [
      { verb: 'видеть', beat: 'A plain transitive verb takes the ACCUSATIVE — the thing the action lands on. (брат is animate, so its accusative borrows the genitive form: бра́та.)' },
      { verb: 'помогать', beat: 'помогать forces the DATIVE — you give help TO someone. The ending flips to -у: бра́ту.' },
      { verb: 'гордиться', beat: 'гордиться (reflexive) demands the INSTRUMENTAL — proud BY / WITH someone: бра́том.' },
      { verb: 'думать', beat: 'думать о … puts the object in the PREPOSITIONAL, which never stands without its preposition: о бра́те.' },
    ],
  },
  {
    id: 'water',
    title: 'Accusative vs. genitive, one noun',
    vary: 'verb',
    fixedSubject: 'sg1',
    object: 'вода',
    lede:
      'Now the object is «вода». Watch the same noun land in three different cases — and the stress even jump — purely because of the verb in front of it.',
    steps: [
      { verb: 'видеть', beat: 'видеть → ACCUSATIVE: во́ду. The stress retracts to the stem in the accusative singular.' },
      { verb: 'бояться', beat: 'бояться → GENITIVE: afraid OF the water, воды́ — ending stressed.' },
      { verb: 'думать', beat: 'думать о → PREPOSITIONAL: о воде́.' },
    ],
  },
  {
    id: 'two-objects',
    title: 'Two objects at once',
    vary: 'verb',
    fixedSubject: 'sg1',
    nouns: ['брат', 'книга'],
    lede:
      'Now the verb steers TWO words. Keep «брат» and «книга» in the sentence and change only the verb — each verb imposes its own frame, and the endings of both objects rearrange to obey it.',
    steps: [
      { verb: 'давать', beat: 'дать / давать → a DATIVE recipient plus an ACCUSATIVE thing: даю́ бра́ту кни́гу. One verb, two cases at the same time.' },
      { verb: 'рассказывать', beat: 'рассказывать → still a DATIVE listener (бра́ту), but the thing becomes a PREPOSITIONAL topic: расска́зываю бра́ту о кни́ге. кни́гу just became о кни́ге.' },
      { verb: 'спрашивать', beat: 'спрашивать → the person flips to ACCUSATIVE (бра́та) while the topic stays PREPOSITIONAL: спра́шиваю бра́та о кни́ге. Now брат changed too — one new verb rewrote both endings.' },
    ],
  },
  {
    id: 'agreement',
    title: 'Agreement is a separate force',
    vary: 'subject',
    verb: 'помогать',
    object: 'брат',
    lede:
      'Freeze the verb (помогать) and the object (dative бра́ту). Now change only the SUBJECT. The verb ending shifts to agree with the subject — but the object stays locked in the dative. Government and agreement pull on different words.',
    steps: [
      { person: 'sg1', beat: 'я → помога́ю. First-person singular ending -ю.' },
      { person: 'sg2', beat: 'ты → помога́ешь. The object бра́ту has not moved.' },
      { person: 'sg3', beat: 'она́ → помога́ет. Still бра́ту.' },
      { person: 'pl1', beat: 'мы → помога́ем. Government held the object fixed the whole time.' },
      { person: 'pl3', beat: 'они́ → помога́ют. Only the verb agrees; the case never budged.' },
    ],
  },
];

// Every verb in the bank that governs a case — the menu for free-build mode.
// Each carries its normalised frame (1 or 2 slots) so the picker knows how many
// object slots to offer and which case each will force.
export const GOV_VERBS = VERB_BANK
  .filter((v) => v.frame || v.governs)
  .map((v) => {
    const frame = v.frame || [v.governs];
    return {
      key: v.key,
      infinitive: v.infinitive,
      gloss: v.gloss,
      frame,
      slots: frame.length,
      cases: frame.map((s) => s.case),
    };
  });

// Flatten the scenes into resolved sentences for easy rendering + a global index.
export function resolveScene(scene) {
  const nouns = scene.nouns || [scene.object];
  return scene.steps.map((step) => {
    const person = scene.vary === 'subject' ? step.person : scene.fixedSubject;
    const verb = scene.vary === 'subject' ? scene.verb : step.verb;
    return { ...step, sentence: buildSentence({ person, verb, nouns }) };
  });
}
