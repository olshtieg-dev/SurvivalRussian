export const morphologyModules = [
  {
    id: 'trees',
    label: 'Case Declension',
    shortLabel: 'Cases',
    badge: 'Cases',
    accent: 'emerald',
    description:
      'Pick any noun and watch it decline across all six cases in both numbers, with the ending highlighted, the stress marked, and each case’s job spelled out.',
    focusAreas: ['Six cases', 'Endings', 'Stress shifts'],
    prototype:
      'An interactive decliner: choose a curated noun or type your own, then read off the full singular / plural paradigm.',
    example: 'дом → до́ма → до́му',
    futureIdeas: [
      'Adjective agreement layered onto the noun.',
      'Preposition pressure shown per case.',
      'Irregular forms flagged against the pattern.',
    ],
  },
  {
    id: 'rolodex',
    label: 'Morpheme Rolodex',
    shortLabel: 'Rolodex',
    badge: 'Build',
    accent: 'amber',
    description:
      'Spin prefixes around a root like a slot machine and feel how each one bends the meaning — every stop is a real word with a prefix / root / suffix breakdown.',
    focusAreas: ['Prefix rollers', 'Word families', 'Meaning shifts'],
    prototype:
      'A morpheme reel: pin the root and rotate prefixes, or pin a prefix and swap roots.',
    example: 'на · пис · ать',
    futureIdeas: [
      'Add derivational suffix reels (noun ↔ verb ↔ adjective).',
      'Save favourite builds into a personal bank.',
      'Show aspect pairs side by side.',
    ],
  },
  {
    id: 'wildcard',
    label: 'Declension Drill',
    shortLabel: 'Drill',
    badge: 'Practice',
    accent: 'blue',
    description:
      'A quick-fire game on the same engine: a noun is thrown at you in a random case and number — pick the right form from four look-alikes and build a streak.',
    focusAreas: ['Case recognition', 'Four-choice drill', 'Streak scoring'],
    prototype:
      'Randomised case questions with distractors drawn from the same noun’s own paradigm.',
    example: 'дом → Gen. pl.?',
    futureIdeas: [
      'Type-the-form mode as well as multiple choice.',
      'Difficulty tiers by stress pattern.',
      'Spaced repetition on the cases you miss.',
    ],
  },
  {
    id: 'conjugation',
    label: 'Verb Conjugation',
    shortLabel: 'Verbs',
    badge: 'Verbs',
    accent: 'rose',
    description:
      'Pick a verb and watch it conjugate across all six persons, the gendered past, the future, and the imperative — stem mutations and mobile stress marked, aspect partners cross-linked.',
    focusAreas: ['Six persons', 'Aspect pairs', 'Stress & mutation'],
    prototype:
      'A rule engine plus a hand-verified verb bank: choose a curated verb and read off its full present / past / future / imperative paradigm.',
    example: 'писа́ть → пишу́ · пи́шешь · писа́л',
    futureIdeas: [
      'Free-input conjugation of any typed verb.',
      'A conjugation drill on the same engine.',
      'Participles and gerunds layered on.',
    ],
  },
  {
    id: 'cases-meaning',
    label: 'Case Meanings',
    shortLabel: 'Case Sense',
    badge: 'Meaning',
    accent: 'violet',
    description:
      'Learn what each case actually does — the job of the instrumental, prepositional, and the rest — with worked examples, then quiz yourself on matching a case to its meaning.',
    focusAreas: ['Case roles', 'Trigger words', 'Meaning quiz'],
    prototype:
      'A Learn view with a card per case (role, triggers, example) plus a recognition quiz on the meaning rather than the ending.',
    example: 'кем? чем? → Instrumental',
    futureIdeas: [
      'Scenario prompts (“the tool of an action → ?”).',
      'Mixed case-in-a-sentence spotting.',
      'Per-case mastery tracking.',
    ],
  },
  {
    id: 'government',
    label: 'Verb Government',
    shortLabel: 'Rection',
    badge: 'Rection',
    accent: 'sky',
    description:
      'A guided exposé of how one verb controls the whole sentence: swap the verb and the object’s ending moves through case after case — the verb decides, the noun obeys.',
    focusAreas: ['Verb → object case', 'Case ladder', 'Government vs. agreement'],
    prototype:
      'A three-act walkthrough that holds the subject and object fixed, changes the verb, and highlights the object ending shifting case.',
    example: 'ви́жу бра́та → помога́ю бра́ту → горжу́сь бра́том',
    futureIdeas: [
      'Free build: choose any subject, verb, and object.',
      'Two-object verbs (dative recipient + accusative thing).',
      'A government drill on the same sentences.',
    ],
  },
];

export const defaultMorphologyModuleId = morphologyModules[0]?.id || 'trees';

export function getMorphologyModule(moduleId) {
  return morphologyModules.find((module) => module.id === moduleId) || morphologyModules[0];
}
