import missionLessons from './mission.json';
import slangLessons from './slang.json';
import casesNounLessons from './cases-noun-conjugation.json';
import groceryLessons from './grocery-shopping.json';
import kitchenLessons from './kitchen-cooking.json';
import householdLessons from './household-items.json';
import vocabularyData from '../vocabulary.json';

export const randomVocabularyLessonSetId = 'random-vocab';
export const randomVocabularyMissionCount = 12;

const vocabularyPool = Object.entries(vocabularyData).filter(([, entry]) => {
  const phrase = entry?.cyrillic;
  return typeof phrase === 'string' && phrase.trim() && !/\s/.test(phrase.trim());
});

function shuffleList(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function generateRandomVocabularyMissions(count = randomVocabularyMissionCount) {
  const selectedWords = shuffleList(vocabularyPool).slice(0, count);
  const phrase = selectedWords
    .map(([, entry]) => entry.cyrillic.trim())
    .join(' ');
  const wordBreakdown = selectedWords
    .map(([, entry]) => {
      const word = entry.cyrillic.trim();
      const literal = entry.literal || word;
      const natural = entry.natural || word;
      return `${word}: ${literal} -> ${natural}`;
    })
    .join(' ');

  return [
    {
      id: `RV-BATCH-${selectedWords.map(([wordKey]) => wordKey).join('-')}`,
      phrase,
      fullAnalysis: `Random vocabulary batch. Type the whole line, then a fresh set rolls in. ${wordBreakdown}`,
    },
  ];
}

export const lessonSets = [
  {
    id: 'mission',
    label: 'Mission Set',
    badge: 'M',
    description: 'Core travel, survival, and utility drills.',
    missions: missionLessons,
  },
  {
    id: 'slang',
    label: 'Street Set',
    badge: 'SL',
    description: 'Casual greetings and everyday conversation.',
    missions: slangLessons,
  },
  {
    id: 'grocery',
    label: 'Grocery Shopping',
    badge: 'GR',
    description: 'Buying essentials, asking prices, and handling checkout.',
    missions: groceryLessons,
  },
  {
    id: 'cases-nouns',
    label: 'Cases & Nouns',
    badge: 'CN',
    description: 'Dense six-case noun drills packed into single passage missions.',
    missions: casesNounLessons,
  },
  {
    id: 'kitchen',
    label: 'Kitchen & Cooking',
    badge: 'KT',
    description: 'Ordering drinks, food, and cooking-adjacent vocabulary.',
    missions: kitchenLessons,
  },
  {
    id: 'household',
    label: 'Household Items',
    badge: 'HH',
    description: 'Daily home objects and small errands around the house.',
    missions: householdLessons,
  },
  {
    id: randomVocabularyLessonSetId,
    label: 'Random Vocab',
    badge: 'RV',
    description: 'One rolling mission made of twelve random vocabulary words. Finish the line and a new set rolls in.',
    missions: [],
    missionCount: 1,
    missionCountLabel: `${randomVocabularyMissionCount}-word batch`,
    isDynamic: true,
  },
];

export const defaultLessonSetId = lessonSets[0]?.id || 'mission';

export function getLessonSet(lessonSetId) {
  return lessonSets.find((lessonSet) => lessonSet.id === lessonSetId) || lessonSets[0];
}
