import dorogaSet from './doroga.json';
import putSet from './put.json';

export const motionLocationNounsFolderId = 'nouns-motion-location';
const motionLocationNounsData = [...dorogaSet, ...putSet];

export const motionLocationNounsFolder = {
  id: motionLocationNounsFolderId,
  parentId: 'nouns',
  label: 'Motion / Location Nouns',
  badge: 'MOVE',
  description: 'Roads, paths, and place nouns that pair with movement or placement.',
  missionCountLabel: `${motionLocationNounsData.length} noun cards`,
  isFolder: true,
};

export const motionLocationNounsLessonSets = motionLocationNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: motionLocationNounsFolderId,
}));
