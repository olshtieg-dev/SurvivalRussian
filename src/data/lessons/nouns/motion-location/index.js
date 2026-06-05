import dorogaSet from './doroga.json';
import putSet from './put.json';
import gorodSet from './gorod.json';
import ulitsaSet from './ulitsa.json';
import domSet from './dom.json';
import mestoSet from './mesto.json';
import mostSet from './most.json';
import ugolSet from './ugol.json';
import ploshchadSet from './ploshchad.json';
import stantsiyaSet from './stantsiya.json';

export const motionLocationNounsFolderId = 'nouns-motion-location';
const motionLocationNounsData = [
  ...dorogaSet,
  ...putSet,
  ...gorodSet,
  ...ulitsaSet,
  ...domSet,
  ...mestoSet,
  ...mostSet,
  ...ugolSet,
  ...ploshchadSet,
  ...stantsiyaSet,
];

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
