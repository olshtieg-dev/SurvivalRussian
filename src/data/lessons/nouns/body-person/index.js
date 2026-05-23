import golovaSet from './golova.json';
import chelovekSet from './chelovek.json';

export const bodyPersonNounsFolderId = 'nouns-body-person';
const bodyPersonNounsData = [...golovaSet, ...chelovekSet];

export const bodyPersonNounsFolder = {
  id: bodyPersonNounsFolderId,
  parentId: 'nouns',
  label: 'Body & Person Nouns',
  badge: 'BODY',
  description: 'Human bodies, people, and everyday person-reference nouns.',
  missionCountLabel: `${bodyPersonNounsData.length} noun cards`,
  isFolder: true,
};

export const bodyPersonNounsLessonSets = bodyPersonNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: bodyPersonNounsFolderId,
}));
