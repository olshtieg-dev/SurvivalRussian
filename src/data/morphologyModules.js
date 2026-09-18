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
];

export const defaultMorphologyModuleId = morphologyModules[0]?.id || 'trees';

export function getMorphologyModule(moduleId) {
  return morphologyModules.find((module) => module.id === moduleId) || morphologyModules[0];
}
