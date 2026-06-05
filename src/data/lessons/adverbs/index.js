import { timeAdverbsLessonSets, timeAdverbsFolder } from './time';
import { placeAdverbsLessonSets, placeAdverbsFolder } from './place';
import { degreeAdverbsLessonSets, degreeAdverbsFolder } from './degree';
import { mannerAdverbsLessonSets, mannerAdverbsFolder } from './manner';
import { quantityAdverbsLessonSets, quantityAdverbsFolder } from './quantity';
import { predicativeAdverbsLessonSets, predicativeAdverbsFolder } from './predicative';

export const adverbsFolderId = 'adverbs';

export const adverbsFolder = {
  id: adverbsFolderId,
  label: 'Adverbs',
  badge: 'ADV',
  description: 'An adverb library organized by semantic type. Each adverb gets its own 10-sentence usage card.',
  missionCountLabel: '6 adverb groups',
  isFolder: true,
};

export const adverbsGroupFolders = [
  timeAdverbsFolder,
  placeAdverbsFolder,
  degreeAdverbsFolder,
  mannerAdverbsFolder,
  quantityAdverbsFolder,
  predicativeAdverbsFolder,
];

export const adverbsLessonSets = [
  ...timeAdverbsLessonSets,
  ...placeAdverbsLessonSets,
  ...degreeAdverbsLessonSets,
  ...mannerAdverbsLessonSets,
  ...quantityAdverbsLessonSets,
  ...predicativeAdverbsLessonSets,
];
