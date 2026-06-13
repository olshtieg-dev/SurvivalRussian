import missionLessons from './mission.json';
import slangLessons from './slang.json';
import slangReceptiveLessons from './slang-receptive.json';
import groceryLessons from './grocery-shopping.json';
import kitchenLessons from './kitchen-cooking.json';
import householdLessons from './household-items.json';
import { conversationLessonSets, conversationFolder } from './conversation';
import { lexicalLessonSets, lexicalSetFolder } from './lexical-sets';
import { nounsLessonSets, nounsFolder, nounsGroupFolders } from './nouns';
import { verbsLessonSets, verbsFolder, verbsGroupFolders } from './verbs';
import { proFormsLessonSets, proFormsFolder, proFormsGroupFolders } from './pro-forms';
import { spatialMotionLessonSets, spatialMotionFolder } from './spatial-motion';
import { comparisonsLessonSets, comparisonsFolder } from './comparisons';
import { binaryAdjectivesLessonSets, binaryAdjectivesFolder } from './binary-adjectives';
import { adverbsLessonSets, adverbsFolder, adverbsGroupFolders } from './adverbs';
import { adjectivesLessonSets, adjectivesFolder, adjectivesGroupFolders } from './adjectives';
import { casesNounsLessonSets, casesNounsFolder, casesNounsGroupFolders } from './cases-nouns';
import { participlesLessonSets, participlesFolder, participlesGroupFolders } from './participles';
import { gerundsLessonSets, gerundsFolder, gerundsGroupFolders } from './gerunds';
import { conditionalLessonSets, conditionalFolder, conditionalGroupFolders } from './conditional';
import { motionVerbsLessonSets, motionVerbsFolder } from './motion-verbs';
import { diminutivesLessonSets, diminutivesFolder } from './diminutives';
import { numeralsLessonSets, numeralsFolder, numeralsGroupFolders } from './numerals';
import { possessivesLessonSets, possessivesFolder } from './possessives';
import { passiveVoiceLessonSets, passiveVoiceFolder } from './passive-voice';
import frequencyGulagLessons from './frequency-gulag.json';
import vocabularyData from '../vocabulary.json';

export const randomVocabularyLessonSetId = 'random-vocab';
export const randomVocabularyMissionCount = 12;
export const frequencyGulagLessonSetId = 'frequency-gulag';
export const frequencyGulagMissionCount = frequencyGulagLessons.missions.length;

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

export function generateFrequencyGulagMissions() {
  return shuffleList(frequencyGulagLessons.missions);
}

export const lessonSets = [
  {
    id: 'essentials',
    label: 'Essentials',
    badge: 'M',
    description: 'Core travel, survival, and utility drills.',
    missions: missionLessons,
  },
  {
    id: 'slang',
    label: 'Street Russian',
    badge: 'SL',
    description: 'Casual greetings and everyday conversation.',
    missions: slangLessons,
  },
  {
    // band: 'receptive' — recognition-only set. Each mission also carries
    // band:'receptive'. The flag is forward-looking metadata: the typing engine
    // does not yet enforce read-only, so these are still typeable for now. When
    // a read-only mode is wired, gate production on this flag (set or mission level).
    id: 'slang-receptive',
    label: 'Slang (Recognition)',
    badge: 'SR',
    band: 'receptive',
    description: "Street slang to recognize, not produce — what it means when you hear it. Clean only, no мат.",
    missions: slangReceptiveLessons,
  },
  {
    id: 'grocery',
    label: 'Grocery Shopping',
    badge: 'GR',
    description: 'Buying essentials, asking prices, and handling checkout.',
    missions: groceryLessons,
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
  ...conversationLessonSets,
  {
    id: randomVocabularyLessonSetId,
    label: 'Random Vocab',
    badge: 'RV',
    description: 'One rolling lesson made of twelve random vocabulary words. Finish the line and a new set rolls in.',
    missions: [],
    missionCount: 1,
    missionCountLabel: `${randomVocabularyMissionCount}-word batch`,
    isDynamic: true,
    generateMissions: generateRandomVocabularyMissions,
  },
  {
    id: frequencyGulagLessonSetId,
    label: '1000 Word Gulag',
    badge: '1K',
    description: 'One sentence per high-frequency word. The full deck shuffles every time, and nothing repeats until the run is done.',
    missions: [],
    missionCount: frequencyGulagMissionCount,
    missionCountLabel: `${frequencyGulagMissionCount.toLocaleString('en-US')} sentences`,
    isDynamic: true,
    generateMissions: generateFrequencyGulagMissions,
  },
  ...lexicalLessonSets,
  ...nounsLessonSets,
  ...verbsLessonSets,
  ...proFormsLessonSets,
  ...spatialMotionLessonSets,
  ...comparisonsLessonSets,
  ...binaryAdjectivesLessonSets,
  ...adverbsLessonSets,
  ...adjectivesLessonSets,
  ...casesNounsLessonSets,
  ...participlesLessonSets,
  ...gerundsLessonSets,
  ...conditionalLessonSets,
  ...motionVerbsLessonSets,
  ...diminutivesLessonSets,
  ...numeralsLessonSets,
  ...possessivesLessonSets,
  ...passiveVoiceLessonSets,
];

export const defaultLessonSetId = lessonSets[0]?.id || 'essentials';

export const lessonFolders = [
  lexicalSetFolder,
  conversationFolder,
  nounsFolder,
  ...nounsGroupFolders,
  verbsFolder,
  ...verbsGroupFolders,
  proFormsFolder,
  ...proFormsGroupFolders,
  spatialMotionFolder,
  comparisonsFolder,
  binaryAdjectivesFolder,
  adverbsFolder,
  ...adverbsGroupFolders,
  adjectivesFolder,
  ...adjectivesGroupFolders,
  casesNounsFolder,
  ...casesNounsGroupFolders,
  participlesFolder,
  ...participlesGroupFolders,
  gerundsFolder,
  ...gerundsGroupFolders,
  conditionalFolder,
  ...conditionalGroupFolders,
  motionVerbsFolder,
  diminutivesFolder,
  numeralsFolder,
  ...numeralsGroupFolders,
  possessivesFolder,
  passiveVoiceFolder,
];

export function getLessonSet(lessonSetId) {
  return lessonSets.find((lessonSet) => lessonSet.id === lessonSetId) || lessonSets[0];
}
