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
  return shuffleList(vocabularyPool)
    .slice(0, count)
    .map(([wordKey, entry], index) => ({
      id: `RV-${index + 1}-${wordKey}`,
      phrase: entry.cyrillic.trim(),
      fullAnalysis: entry.analysis
        ? `Random vocabulary drill. ${entry.analysis}`
        : `Random vocabulary drill. Literal: ${entry.literal || entry.cyrillic}. Natural: ${entry.natural || entry.cyrillic}.`,
    }));
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
    description: 'Twelve fresh one-word drills pulled from the vocabulary bank. Finish the batch and a new one rolls in.',
    missions: [],
    missionCount: randomVocabularyMissionCount,
    isDynamic: true,
  },
];

export const defaultLessonSetId = lessonSets[0]?.id || 'mission';

export function getLessonSet(lessonSetId) {
  return lessonSets.find((lessonSet) => lessonSet.id === lessonSetId) || lessonSets[0];
}
