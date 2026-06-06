import dalSet from './dal.json';
import derevnyaSet from './derevnya.json';
import dnoSet from './dno.json';
import domSet from './dom.json';
import dorogaSet from './doroga.json';
import dvorSet from './dvor.json';
import etazhSet from './etazh.json';
import glubinaSet from './glubina.json';
import gorodSet from './gorod.json';
import granitsaSet from './granitsa.json';
import institutSet from './institut.json';
import kabinetSet from './kabinet.json';
import klubSet from './klub.json';
import komnataSet from './komnata.json';
import konetsSet from './konets.json';
import koridorSet from './koridor.json';
import kryshaSet from './krysha.json';
import kukhnyaSet from './kukhnya.json';
import kvartiraSet from './kvartira.json';
import lagerSet from './lager.json';
import lestnitsaSet from './lestnitsa.json';
import liniyaSet from './liniya.json';
import magazinSet from './magazin.json';
import mestoSet from './mesto.json';
import mostSet from './most.json';
import napravlenieSet from './napravlenie.json';
import oblastSet from './oblast.json';
import otdelSet from './otdel.json';
import ploshchadSet from './ploshchad.json';
import poleSet from './pole.json';
import prostranstvoSet from './prostranstvo.json';
import putSet from './put.json';
import rabotaSet from './rabota.json';
import raionSet from './raion.json';
import rynokSet from './rynok.json';
import sadSet from './sad.json';
import shkolaSet from './shkola.json';
import shtabSet from './shtab.json';
import stantsiyaSet from './stantsiya.json';
import stolitsaSet from './stolitsa.json';
import storonaSet from './storona.json';
import stranaSet from './strana.json';
import stsenaSet from './stsena.json';
import teatrSet from './teatr.json';
import tsentrSet from './tsentr.json';
import ugolSet from './ugol.json';
import ugol2Set from './ugol2.json';
import ulitsaSet from './ulitsa.json';
import vysotaSet from './vysota.json';
import zalSet from './zal.json';
import zamokSet from './zamok.json';
import zapadSet from './zapad.json';
import zavodSet from './zavod.json';
import zdanieSet from './zdanie.json';

export const motionLocationNounsFolderId = 'nouns-motion-location';
const motionLocationNounsData = [
  ...dalSet,
  ...derevnyaSet,
  ...dnoSet,
  ...domSet,
  ...dorogaSet,
  ...dvorSet,
  ...etazhSet,
  ...glubinaSet,
  ...gorodSet,
  ...granitsaSet,
  ...institutSet,
  ...kabinetSet,
  ...klubSet,
  ...komnataSet,
  ...konetsSet,
  ...koridorSet,
  ...kryshaSet,
  ...kukhnyaSet,
  ...kvartiraSet,
  ...lagerSet,
  ...lestnitsaSet,
  ...liniyaSet,
  ...magazinSet,
  ...mestoSet,
  ...mostSet,
  ...napravlenieSet,
  ...oblastSet,
  ...otdelSet,
  ...ploshchadSet,
  ...poleSet,
  ...prostranstvoSet,
  ...putSet,
  ...rabotaSet,
  ...raionSet,
  ...rynokSet,
  ...sadSet,
  ...shkolaSet,
  ...shtabSet,
  ...stantsiyaSet,
  ...stolitsaSet,
  ...storonaSet,
  ...stranaSet,
  ...stsenaSet,
  ...teatrSet,
  ...tsentrSet,
  ...ugolSet,
  ...ugol2Set,
  ...ulitsaSet,
  ...vysotaSet,
  ...zalSet,
  ...zamokSet,
  ...zapadSet,
  ...zavodSet,
  ...zdanieSet,
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

export const motionLocationNounsLessonSets = motionLocationNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: motionLocationNounsFolderId }));
