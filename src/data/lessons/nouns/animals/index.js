import loshadSet from './loshad.json';
import ptitsaSet from './ptitsa.json';
import sobakaSet from './sobaka.json';

export const animalsNounsFolderId = 'nouns-animals';
const animalsNounsData = [
  ...loshadSet,
  ...ptitsaSet,
  ...sobakaSet,
];

export const animalsNounsFolder = {
  id: animalsNounsFolderId,
  parentId: 'nouns',
  label: 'Animals',
  badge: 'ANIMAL',
  description: 'Animals nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${animalsNounsData.length} noun cards`,
  isFolder: true,
};

export const animalsNounsLessonSets = animalsNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: animalsNounsFolderId }));
