import begSet from './beg.json';
import bolshinstvoSet from './bolshinstvo.json';
import budushcheeSet from './budushchee.json';
import deistvieSet from './deistvie.json';
import detstvoSet from './detstvo.json';
import dobroSet from './dobro.json';
import dvizhenieSet from './dvizhenie.json';
import grobSet from './grob.json';
import istochnikSet from './istochnik.json';
import izmenenieSet from './izmenenie.json';
import khodSet from './khod.json';
import lekarstvoSet from './lekarstvo.json';
import momentSet from './moment.json';
import nachaloSet from './nachalo.json';
import oshibkaSet from './oshibka.json';
import otlichieSet from './otlichie.json';
import otnoshenieSet from './otnoshenie.json';
import otsutstvieSet from './otsutstvie.json';
import poiskSet from './poisk.json';
import pomoshchSet from './pomoshch.json';
import popytkaSet from './popytka.json';
import postupokSet from './postupok.json';
import pozharSet from './pozhar.json';
import prichinaSet from './prichina.json';
import priyomSet from './priyom.json';
import problemaSet from './problema.json';
import protsessSet from './protsess.json';
import puteshestvieSet from './puteshestvie.json';
import razvitieSet from './razvitie.json';
import reaktsiyaSet from './reaktsiya.json';
import reshenieSet from './reshenie.json';
import rezultatSet from './rezultat.json';
import rozhdenieSet from './rozhdenie.json';
import situatsiyaSet from './situatsiya.json';
import sledSet from './sled.json';
import sluchaiSet from './sluchai.json';
import smyslSet from './smysl.json';
import sobytieSet from './sobytie.json';
import sozdanieSet from './sozdanie.json';
import sudbaSet from './sudba.json';
import sushchestvovanieSet from './sushchestvovanie.json';
import svyazSet from './svyaz.json';
import techenieSet from './techenie.json';
import tselSet from './tsel.json';
import usilieSet from './usilie.json';
import vliyanieSet from './vliyanie.json';
import vozmozhnostSet from './vozmozhnost.json';
import vstrechaSet from './vstrecha.json';
import vykhodSet from './vykhod.json';
import yavlenieSet from './yavlenie.json';
import zadanieSet from './zadanie.json';
import znakomstvoSet from './znakomstvo.json';

export const abstractEventNounsFolderId = 'nouns-abstract-event';
const abstractEventNounsData = [
  ...begSet,
  ...bolshinstvoSet,
  ...budushcheeSet,
  ...deistvieSet,
  ...detstvoSet,
  ...dobroSet,
  ...dvizhenieSet,
  ...grobSet,
  ...istochnikSet,
  ...izmenenieSet,
  ...khodSet,
  ...lekarstvoSet,
  ...momentSet,
  ...nachaloSet,
  ...oshibkaSet,
  ...otlichieSet,
  ...otnoshenieSet,
  ...otsutstvieSet,
  ...poiskSet,
  ...pomoshchSet,
  ...popytkaSet,
  ...postupokSet,
  ...pozharSet,
  ...prichinaSet,
  ...priyomSet,
  ...problemaSet,
  ...protsessSet,
  ...puteshestvieSet,
  ...razvitieSet,
  ...reaktsiyaSet,
  ...reshenieSet,
  ...rezultatSet,
  ...rozhdenieSet,
  ...situatsiyaSet,
  ...sledSet,
  ...sluchaiSet,
  ...smyslSet,
  ...sobytieSet,
  ...sozdanieSet,
  ...sudbaSet,
  ...sushchestvovanieSet,
  ...svyazSet,
  ...techenieSet,
  ...tselSet,
  ...usilieSet,
  ...vliyanieSet,
  ...vozmozhnostSet,
  ...vstrechaSet,
  ...vykhodSet,
  ...yavlenieSet,
  ...zadanieSet,
  ...znakomstvoSet,
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
