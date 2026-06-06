import sluchaiSet from './sluchai.json';
import nachaloSet from './nachalo.json';
import otnoshenieSet from './otnoshenie.json';
import dvizhenieSet from './dvizhenie.json';
import momentSet from './moment.json';
import pomoshchSet from './pomoshch.json';
import smyslSet from './smysl.json';
import vozmozhnostSet from './vozmozhnost.json';
import deistvieSet from './deistvie.json';
import khodSet from './khod.json';
import sudbaSet from './sudba.json';
import prichinaSet from './prichina.json';
import problemaSet from './problema.json';
import svyazSet from './svyaz.json';
import tselSet from './tsel.json';
import rezultatSet from './rezultat.json';
import sledSet from './sled.json';
import protsessSet from './protsess.json';
import budushcheeSet from './budushchee.json';
import razvitieSet from './razvitie.json';
import vstrechaSet from './vstrecha.json';
import techenieSet from './techenie.json';
import situatsiyaSet from './situatsiya.json';
import vykhodSet from './vykhod.json';
import sobytieSet from './sobytie.json';
import detstvoSet from './detstvo.json';
import bolshinstvoSet from './bolshinstvo.json';
import reshenieSet from './reshenie.json';

export const abstractEventNounsFolderId = 'nouns-abstract-event';
const abstractEventNounsData = [
  ...sluchaiSet,
  ...nachaloSet,
  ...otnoshenieSet,
  ...dvizhenieSet,
  ...momentSet,
  ...pomoshchSet,
  ...smyslSet,
  ...vozmozhnostSet,
  ...deistvieSet,
  ...khodSet,
  ...sudbaSet,
  ...prichinaSet,
  ...problemaSet,
  ...svyazSet,
  ...tselSet,
  ...rezultatSet,
  ...sledSet,
  ...protsessSet,
  ...budushcheeSet,
  ...razvitieSet,
  ...vstrechaSet,
  ...techenieSet,
  ...situatsiyaSet,
  ...vykhodSet,
  ...sobytieSet,
  ...detstvoSet,
  ...bolshinstvoSet,
  ...reshenieSet,
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
