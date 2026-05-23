import { interrogativesLessonSets, interrogativesFolder } from './interrogatives';
import { demonstrativesLessonSets, demonstrativesFolder } from './demonstratives';
import { indefinitesLessonSets, indefinitesFolder } from './indefinites';
import { relativeLinkingLessonSets, relativeLinkingFolder } from './relative-linking';

export const proFormsFolderId = 'pro-forms';

export const proFormsFolder = {
  id: proFormsFolderId,
  label: 'Pro-Forms',
  badge: 'PF',
  description: 'Interrogative, demonstrative, indefinite, and relative-linking forms that act as the structural joints of Russian.',
  missionCountLabel: '4 form families',
  isFolder: true,
};

export const proFormsGroupFolders = [
  interrogativesFolder,
  demonstrativesFolder,
  indefinitesFolder,
  relativeLinkingFolder,
];

export const proFormsLessonSets = [
  ...interrogativesLessonSets,
  ...demonstrativesLessonSets,
  ...indefinitesLessonSets,
  ...relativeLinkingLessonSets,
];
