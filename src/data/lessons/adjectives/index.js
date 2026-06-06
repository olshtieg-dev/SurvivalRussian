import { descriptiveAdjLessonSets, descriptiveAdjFolder } from './descriptive';
import { colorsAdjLessonSets, colorsAdjFolder } from './colors';

export const adjectivesFolderId = 'adjectives';

export const adjectivesFolder = {
  id: adjectivesFolderId,
  label: 'Adjectives',
  badge: 'ADJ',
  description: 'Standalone descriptive adjectives and colors (those without a natural antonym pair). Each a 10-sentence agreement card.',
  missionCountLabel: '2 adjective groups',
  isFolder: true,
};

export const adjectivesGroupFolders = [descriptiveAdjFolder, colorsAdjFolder];

export const adjectivesLessonSets = [...descriptiveAdjLessonSets, ...colorsAdjLessonSets];
