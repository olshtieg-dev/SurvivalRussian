import avtobusSet from './avtobus.json';
import avtomobilSet from './avtomobil.json';
import batareyaSet from './batareya.json';
import kabinaSet from './kabina.json';
import kolesoSet from './koleso.json';
import korablSet from './korabl.json';
import lodkaSet from './lodka.json';
import mashinaSet from './mashina.json';
import motorSet from './motor.json';
import poezdSet from './poezd.json';
import poezdkaSet from './poezdka.json';
import raketaSet from './raketa.json';
import samolyotSet from './samolyot.json';
import tankSet from './tank.json';
import vagonSet from './vagon.json';

export const transportNounsFolderId = 'nouns-transport';
const transportNounsData = [
  ...avtobusSet,
  ...avtomobilSet,
  ...batareyaSet,
  ...kabinaSet,
  ...kolesoSet,
  ...korablSet,
  ...lodkaSet,
  ...mashinaSet,
  ...motorSet,
  ...poezdSet,
  ...poezdkaSet,
  ...raketaSet,
  ...samolyotSet,
  ...tankSet,
  ...vagonSet,
];

export const transportNounsFolder = {
  id: transportNounsFolderId,
  parentId: 'nouns',
  label: 'Transport',
  badge: 'TRANS',
  description: 'Transport nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${transportNounsData.length} noun cards`,
  isFolder: true,
};

export const transportNounsLessonSets = transportNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: transportNounsFolderId }));
