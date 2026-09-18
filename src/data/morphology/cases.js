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
    sentence: 'Студе́нт чита́ет кни́гу.',
    sentenceEn: 'The student is reading a book.',
    sentenceFocus: 'Студе́нт',
    usage: 'The naming case. It is the dictionary form and marks the doer of the verb — the one performing the action. It never follows a preposition.',
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
    sentence: 'У меня́ нет вре́мени.',
    sentenceEn: 'I have no time.',
    sentenceFocus: 'вре́мени',
    usage: 'The “of / not-any” case. It shows possession (кни́га бра́та — the brother’s book), absence after нет, quantities, and follows у, из, от, до, без, для.',
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
    sentence: 'Я иду́ к врачу́.',
    sentenceEn: 'I am going to the doctor.',
    sentenceFocus: 'врачу́',
    usage: 'The “to / for” case. It marks the recipient of giving, telling, or helping (даю́ дру́гу), the target of movement after к, and age/feeling statements (мне хо́лодно).',
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
    sentence: 'Я ви́жу ма́му.',
    sentenceEn: 'I see mom.',
    sentenceFocus: 'ма́му',
    usage: 'The direct-object case — what the verb acts on (чита́ю кни́гу). It also marks motion-into after в / на (иду́ в шко́лу) and duration.',
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
    sentence: 'Я пишу́ ру́чкой.',
    sentenceEn: 'I write with a pen.',
    sentenceFocus: 'ру́чкой',
    usage: 'The “by means of” case — the tool or manner of an action (е́ду по́ездом). It also marks accompaniment after с (с дру́гом) and follows под, над, за, ме́жду.',
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
    sentence: 'Мы говори́м о кни́ге.',
    sentenceEn: 'We are talking about the book.',
    sentenceFocus: 'кни́ге',
    usage: 'The only case that never stands alone. It marks static location after в / на (в шко́ле) and the topic of speech or thought after о (ду́маю о тебе́).',
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
