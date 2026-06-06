import bolshinstvoSet from './bolshinstvo.json';
import budushcheeSet from './budushchee.json';
import deistvieSet from './deistvie.json';
import detstvoSet from './detstvo.json';
import dvizhenieSet from './dvizhenie.json';
import khodSet from './khod.json';
import momentSet from './moment.json';
import nachaloSet from './nachalo.json';
import oshibkaSet from './oshibka.json';
import otnoshenieSet from './otnoshenie.json';
import pomoshchSet from './pomoshch.json';
import popytkaSet from './popytka.json';
import prichinaSet from './prichina.json';
import problemaSet from './problema.json';
import protsessSet from './protsess.json';
import razvitieSet from './razvitie.json';
import reshenieSet from './reshenie.json';
import rezultatSet from './rezultat.json';
import situatsiyaSet from './situatsiya.json';
import sledSet from './sled.json';
import sluchaiSet from './sluchai.json';
import smyslSet from './smysl.json';
import sobytieSet from './sobytie.json';
import sudbaSet from './sudba.json';
import svyazSet from './svyaz.json';
import techenieSet from './techenie.json';
import tselSet from './tsel.json';
import vozmozhnostSet from './vozmozhnost.json';
import vstrechaSet from './vstrecha.json';
import vykhodSet from './vykhod.json';

export const abstractEventNounsFolderId = 'nouns-abstract-event';
const abstractEventNounsData = [
  ...bolshinstvoSet,
  ...budushcheeSet,
  ...deistvieSet,
  ...detstvoSet,
  ...dvizhenieSet,
  ...khodSet,
  ...momentSet,
  ...nachaloSet,
  ...oshibkaSet,
  ...otnoshenieSet,
  ...pomoshchSet,
  ...popytkaSet,
  ...prichinaSet,
  ...problemaSet,
  ...protsessSet,
  ...razvitieSet,
  ...reshenieSet,
  ...rezultatSet,
  ...situatsiyaSet,
  ...sledSet,
  ...sluchaiSet,
  ...smyslSet,
  ...sobytieSet,
  ...sudbaSet,
  ...svyazSet,
  ...techenieSet,
  ...tselSet,
  ...vozmozhnostSet,
  ...vstrechaSet,
  ...vykhodSet,
];

export const abstractEventNounsFolder = {
  id: abstractEventNounsFolderId,
  parentId: 'nouns',
  label: 'Events & Concepts',
  badge: 'CONCEPT',
  description: 'Events & Concepts nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${abstractEventNounsData.length} noun cards`,
  isFolder: true,
};

export const abstractEventNounsLessonSets = abstractEventNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: abstractEventNounsFolderId }));
