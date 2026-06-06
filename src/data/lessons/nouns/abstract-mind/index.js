import chuvstvoSet from './chuvstvo.json';
import dukhSet from './dukh.json';
import dushaSet from './dusha.json';
import interesSet from './interes.json';
import kharakterSet from './kharakter.json';
import nadezhdaSet from './nadezhda.json';
import pamyatSet from './pamyat.json';
import soznanieSet from './soznanie.json';
import umSet from './um.json';
import veraSet from './vera.json';
import vnimanieSet from './vnimanie.json';
import volyaSet from './volya.json';
import vyrazhenieSet from './vyrazhenie.json';
import vzglyadSet from './vzglyad.json';
import zhelanieSet from './zhelanie.json';

export const abstractMindNounsFolderId = 'nouns-abstract-mind';
const abstractMindNounsData = [
  ...chuvstvoSet,
  ...dukhSet,
  ...dushaSet,
  ...interesSet,
  ...kharakterSet,
  ...nadezhdaSet,
  ...pamyatSet,
  ...soznanieSet,
  ...umSet,
  ...veraSet,
  ...vnimanieSet,
  ...volyaSet,
  ...vyrazhenieSet,
  ...vzglyadSet,
  ...zhelanieSet,
];

export const abstractMindNounsFolder = {
  id: abstractMindNounsFolderId,
  parentId: 'nouns',
  label: 'Mind & Perception',
  badge: 'MIND',
  description: 'Mind & Perception nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${abstractMindNounsData.length} noun cards`,
  isFolder: true,
};

export const abstractMindNounsLessonSets = abstractMindNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: abstractMindNounsFolderId }));
