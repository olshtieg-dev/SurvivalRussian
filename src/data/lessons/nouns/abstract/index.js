import dolgSet from './dolg.json';
import dolyaSet from './dolya.json';
import dostoinstvoSet from './dostoinstvo.json';
import druzhbaSet from './druzhba.json';
import funktsiyaSet from './funktsiya.json';
import ideyaSet from './ideya.json';
import isklyuchenieSet from './isklyuchenie.json';
import istinaSet from './istina.json';
import lyubovSet from './lyubov.json';
import mnenieSet from './mnenie.json';
import myslSet from './mysl.json';
import normaSet from './norma.json';
import osnovaSet from './osnova.json';
import osnovanieSet from './osnovanie.json';
import osobennostSet from './osobennost.json';
import otvetSet from './otvet.json';
import polzaSet from './polza.json';
import pravdaSet from './pravda.json';
import predlozhenieSet from './predlozhenie.json';
import printsipSet from './printsip.json';
import sekretSet from './sekret.json';
import sferaSet from './sfera.json';
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
  ...dolyaSet,
  ...dostoinstvoSet,
  ...druzhbaSet,
  ...funktsiyaSet,
  ...ideyaSet,
  ...isklyuchenieSet,
  ...istinaSet,
  ...lyubovSet,
  ...mnenieSet,
  ...myslSet,
  ...normaSet,
  ...osnovaSet,
  ...osnovanieSet,
  ...osobennostSet,
  ...otvetSet,
  ...polzaSet,
  ...pravdaSet,
  ...predlozhenieSet,
  ...printsipSet,
  ...sekretSet,
  ...sferaSet,
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
