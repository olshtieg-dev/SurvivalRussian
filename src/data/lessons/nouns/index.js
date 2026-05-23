import { householdNounsLessonSets, householdNounsFolder } from './household';
import { bodyPersonNounsLessonSets, bodyPersonNounsFolder } from './body-person';
import { motionLocationNounsLessonSets, motionLocationNounsFolder } from './motion-location';
import { abstractNounsLessonSets, abstractNounsFolder } from './abstract';

export const nounsFolderId = 'nouns';

export const nounsFolder = {
  id: nounsFolderId,
  label: 'Nouns',
  badge: 'NN',
  description: 'A noun library organized into semantic families. Each noun gets its own 10-sentence usage card.',
  missionCountLabel: '4 noun groups',
  isFolder: true,
};

export const nounsGroupFolders = [
  householdNounsFolder,
  bodyPersonNounsFolder,
  motionLocationNounsFolder,
  abstractNounsFolder,
];

export const nounsLessonSets = [
  ...householdNounsLessonSets,
  ...bodyPersonNounsLessonSets,
  ...motionLocationNounsLessonSets,
  ...abstractNounsLessonSets,
];
