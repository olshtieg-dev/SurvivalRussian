import ideyaSet from './ideya.json';
import lyubovSet from './lyubov.json';
import mnenieSet from './mnenie.json';
import myslSet from './mysl.json';
import otvetSet from './otvet.json';
import pravdaSet from './pravda.json';
import printsipSet from './printsip.json';
import smyslSet from './smysl.json';
import sostavSet from './sostav.json';
import sposobSet from './sposob.json';
import temaSet from './tema.json';
import voprosSet from './vopros.json';
import vremyaSet from './vremya.json';
import zhiznSet from './zhizn.json';
import znachenieSet from './znachenie.json';

export const abstractNounsFolderId = 'nouns-abstract';
const abstractNounsData = [
  ...ideyaSet,
  ...lyubovSet,
  ...mnenieSet,
  ...myslSet,
  ...otvetSet,
  ...pravdaSet,
  ...printsipSet,
  ...smyslSet,
  ...sostavSet,
  ...sposobSet,
  ...temaSet,
  ...voprosSet,
  ...vremyaSet,
  ...zhiznSet,
  ...znachenieSet,
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

export const abstractNounsLessonSets = abstractNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: abstractNounsFolderId }));
