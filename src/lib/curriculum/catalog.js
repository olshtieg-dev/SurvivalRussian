// Curriculum catalog — the ordered stages a learner is sequenced through.
// Each "lessons" stage resolves (in the planner, against the live lessonSets) into an
// ordered list of concrete lessonSet ids. Which stage a learner STARTS in, and whether
// the typing stage is included at all, is decided from the onboarding questionnaire.
//
// `ids` reference top-level lessonSets; `groups` reference family folder ids (groupId on
// the hidden family lesson sets). Keep these ids in sync with src/data/lessons/index.js.

export const STAGES = [
  {
    id: 'typing-foundations',
    label: 'Keyboard Foundations',
    blurb: 'Learn to touch-type the Russian (JCUKEN) layout before drilling whole words.',
    kind: 'typing', // routed to the structured typing tutor, not a lessonSet
  },
  {
    id: 'core-lexical',
    label: 'Core Words & Survival Phrases',
    blurb: 'The essential everyday vocabulary you reach for first.',
    kind: 'lessons',
    ids: ['essentials', 'grocery', 'household', 'kitchen'],
  },
  {
    id: 'everyday-conversation',
    label: 'Everyday Conversation',
    blurb: 'Greetings, small talk, and the phrases that keep a conversation moving.',
    kind: 'lessons',
    groups: ['conversation', 'lexical-sets', 'pro-forms'],
    ids: ['slang'],
  },
  {
    id: 'building-blocks',
    label: 'Building Blocks',
    blurb: 'Core nouns, verbs, adjectives, and adverbs — plus the case system.',
    kind: 'lessons',
    groups: ['nouns', 'verbs', 'adjectives', 'binary-adjectives', 'adverbs', 'cases-nouns'],
  },
  {
    id: 'grammar-depth',
    label: 'Grammar in Depth',
    blurb: 'Participles, gerunds, the conditional, motion verbs, passive, numerals, and more.',
    kind: 'lessons',
    groups: [
      'participles', 'gerunds', 'conditional', 'motion-verbs', 'passive-voice',
      'numerals', 'possessives', 'comparisons', 'spatial-motion', 'diminutives',
    ],
  },
  {
    id: 'free-review',
    label: 'Free Play & Review',
    blurb: 'Shuffle the whole corpus and revisit what needs reinforcing.',
    kind: 'lessons',
    ids: ['random-vocab', 'frequency-gulag'],
  },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s]));
