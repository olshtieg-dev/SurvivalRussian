import dolgSet from './dolg.json';
import ideyaSet from './ideya.json';
import istinaSet from './istina.json';
import lyubovSet from './lyubov.json';
import mnenieSet from './mnenie.json';
import myslSet from './mysl.json';
import osnovaSet from './osnova.json';
import osnovanieSet from './osnovanie.json';
import otvetSet from './otvet.json';
import pravdaSet from './pravda.json';
import predlozhenieSet from './predlozhenie.json';
import printsipSet from './printsip.json';
import smyslSet from './smysl.json';
import sostavSet from './sostav.json';
import sposobSet from './sposob.json';
import temaSet from './tema.json';
import voprosSet from './vopros.json';
import vremyaSet from './vremya.json';
import vyvodSet from './vyvod.json';
import zhiznSet from './zhizn.json';
import znachenieSet from './znachenie.json';

export const abstractNounsFolderId = 'nouns-abstract';
const abstractNounsData = [
  ...dolgSet,
  ...ideyaSet,
  ...istinaSet,
  ...lyubovSet,
  ...mnenieSet,
  ...myslSet,
  ...osnovaSet,
  ...osnovanieSet,
  ...otvetSet,
  ...pravdaSet,
  ...predlozhenieSet,
  ...printsipSet,
  ...smyslSet,
  ...sostavSet,
  ...sposobSet,
  ...temaSet,
  ...voprosSet,
  ...vremyaSet,
  ...vyvodSet,
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
