import derevnyaSet from './derevnya.json';
import domSet from './dom.json';
import dorogaSet from './doroga.json';
import dvorSet from './dvor.json';
import etazhSet from './etazh.json';
import gorodSet from './gorod.json';
import granitsaSet from './granitsa.json';
import institutSet from './institut.json';
import kabinetSet from './kabinet.json';
import komnataSet from './komnata.json';
import konetsSet from './konets.json';
import koridorSet from './koridor.json';
import kryshaSet from './krysha.json';
import kukhnyaSet from './kukhnya.json';
import kvartiraSet from './kvartira.json';
import lagerSet from './lager.json';
import lestnitsaSet from './lestnitsa.json';
import magazinSet from './magazin.json';
import mestoSet from './mesto.json';
import mostSet from './most.json';
import oblastSet from './oblast.json';
import ploshchadSet from './ploshchad.json';
import poleSet from './pole.json';
import putSet from './put.json';
import rabotaSet from './rabota.json';
import raionSet from './raion.json';
import sadSet from './sad.json';
import shkolaSet from './shkola.json';
import stantsiyaSet from './stantsiya.json';
import storonaSet from './storona.json';
import stranaSet from './strana.json';
import tsentrSet from './tsentr.json';
import ugolSet from './ugol.json';
import ugol2Set from './ugol2.json';
import ulitsaSet from './ulitsa.json';
import zalSet from './zal.json';
import zavodSet from './zavod.json';

export const motionLocationNounsFolderId = 'nouns-motion-location';
const motionLocationNounsData = [
  ...derevnyaSet,
  ...domSet,
  ...dorogaSet,
  ...dvorSet,
  ...etazhSet,
  ...gorodSet,
  ...granitsaSet,
  ...institutSet,
  ...kabinetSet,
  ...komnataSet,
  ...konetsSet,
  ...koridorSet,
  ...kryshaSet,
  ...kukhnyaSet,
  ...kvartiraSet,
  ...lagerSet,
  ...lestnitsaSet,
  ...magazinSet,
  ...mestoSet,
  ...mostSet,
  ...oblastSet,
  ...ploshchadSet,
  ...poleSet,
  ...putSet,
  ...rabotaSet,
  ...raionSet,
  ...sadSet,
  ...shkolaSet,
  ...stantsiyaSet,
  ...storonaSet,
  ...stranaSet,
  ...tsentrSet,
  ...ugolSet,
  ...ugol2Set,
  ...ulitsaSet,
  ...zalSet,
  ...zavodSet,
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
