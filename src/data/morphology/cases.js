// Case metadata for the Morphology Lab. Each case carries its grammatical
// question, plain-English role, common trigger words (prepositions / verbs that
// demand it), and a Tailwind color family used to tint the UI consistently.

export const CASES = [
  {
    key: 'nom',
    label: 'Nominative',
    abbr: 'Nom',
    question: 'кто? что?',
    role: 'The subject — who or what is doing the action.',
    triggers: [],
    triggerHint: 'dictionary form',
    color: 'sky',
  },
  {
    key: 'gen',
    label: 'Genitive',
    abbr: 'Gen',
    question: 'кого? чего?',
    role: 'Possession, absence, and “of” — belongs-to, none-of, part-of.',
    triggers: ['у', 'нет', 'от', 'до', 'из', 'без', 'для', 'около'],
    triggerHint: 'у меня нет …',
    color: 'emerald',
  },
  {
    key: 'dat',
    label: 'Dative',
    abbr: 'Dat',
    question: 'кому? чему?',
    role: 'The recipient — to whom or for whom something is given.',
    triggers: ['к', 'по'],
    triggerHint: 'иду к …',
    color: 'amber',
  },
  {
    key: 'acc',
    label: 'Accusative',
    abbr: 'Acc',
    question: 'кого? что?',
    role: 'The direct object — the thing the action lands on.',
    triggers: ['в', 'на', 'через', 'про'],
    triggerHint: 'я вижу …',
    color: 'rose',
  },
  {
    key: 'ins',
    label: 'Instrumental',
    abbr: 'Ins',
    question: 'кем? чем?',
    role: 'The means — with, by, or using something.',
    triggers: ['с', 'за', 'под', 'над', 'перед', 'между'],
    triggerHint: 'с …',
    color: 'violet',
  },
  {
    key: 'pre',
    label: 'Prepositional',
    abbr: 'Pre',
    question: 'о ком? о чём?',
    role: 'Location or topic — only ever appears after a preposition.',
    triggers: ['в', 'на', 'о', 'при'],
    triggerHint: 'в …',
    color: 'blue',
  },
];

export const CASE_KEYS = CASES.map((c) => c.key);

export const CASE_BY_KEY = CASES.reduce((acc, c) => {
  acc[c.key] = c;
  return acc;
}, {});

// Tailwind class bundles per color family. Kept as full literals so Tailwind's
// content scanner sees them (no dynamic class construction).
export const CASE_COLOR_CLASSES = {
  sky: {
    text: 'text-sky-300',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    chip: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
    ending: 'text-sky-300',
  },
  emerald: {
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    ending: 'text-emerald-300',
  },
  amber: {
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    chip: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    ending: 'text-amber-300',
  },
  rose: {
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    chip: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
    ending: 'text-rose-300',
  },
  violet: {
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    chip: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    ending: 'text-violet-300',
  },
  blue: {
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    chip: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
    ending: 'text-blue-300',
  },
};
