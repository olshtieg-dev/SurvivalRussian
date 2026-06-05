import ideyaSet from './ideya.json';
import mnenieSet from './mnenie.json';
import vremyaSet from './vremya.json';
import zhiznSet from './zhizn.json';
import pravdaSet from './pravda.json';
import myslSet from './mysl.json';
import voprosSet from './vopros.json';
import otvetSet from './otvet.json';
import lyubovSet from './lyubov.json';
import smyslSet from './smysl.json';

export const abstractNounsFolderId = 'nouns-abstract';
const abstractNounsData = [
  ...ideyaSet,
  ...mnenieSet,
  ...vremyaSet,
  ...zhiznSet,
  ...pravdaSet,
  ...myslSet,
  ...voprosSet,
  ...otvetSet,
  ...lyubovSet,
  ...smyslSet,
];

export const abstractNounsFolder = {
  id: abstractNounsFolderId,
  parentId: 'nouns',
  label: 'Abstract Nouns',
  badge: 'IDEA',
  description: 'Ideas, opinions, reasons, and debate-friendly semantic nouns.',
  missionCountLabel: `${abstractNounsData.length} noun cards`,
  isFolder: true,
};

export const abstractNounsLessonSets = abstractNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: abstractNounsFolderId,
}));
