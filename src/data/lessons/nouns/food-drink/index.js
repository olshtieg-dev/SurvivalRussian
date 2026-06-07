import butylkaSet from './butylka.json';
import chaiSet from './chai.json';
import edaSet from './eda.json';
import golodSet from './golod.json';
import gribSet from './grib.json';
import kartoshkaSet from './kartoshka.json';
import khlebSet from './khleb.json';
import kofeSet from './kofe.json';
import konyakSet from './konyak.json';
import masloSet from './maslo.json';
import molokoSet from './moloko.json';
import myasoSet from './myaso.json';
import obedSet from './obed.json';
import pishchaSet from './pishcha.json';
import pivoSet from './pivo.json';
import produktSet from './produkt.json';
import rybaSet from './ryba.json';
import stakanSet from './stakan.json';
import trubkaSet from './trubka.json';
import uzhinSet from './uzhin.json';
import vinoSet from './vino.json';
import vodaSet from './voda.json';
import vodkaSet from './vodka.json';
import yablokoSet from './yabloko.json';
import yaitsoSet from './yaitso.json';

export const foodDrinkNounsFolderId = 'nouns-food-drink';
const foodDrinkNounsData = [
  ...butylkaSet,
  ...chaiSet,
  ...edaSet,
  ...golodSet,
  ...gribSet,
  ...kartoshkaSet,
  ...khlebSet,
  ...kofeSet,
  ...konyakSet,
  ...masloSet,
  ...molokoSet,
  ...myasoSet,
  ...obedSet,
  ...pishchaSet,
  ...pivoSet,
  ...produktSet,
  ...rybaSet,
  ...stakanSet,
  ...trubkaSet,
  ...uzhinSet,
  ...vinoSet,
  ...vodaSet,
  ...vodkaSet,
  ...yablokoSet,
  ...yaitsoSet,
];

export const foodDrinkNounsFolder = {
  id: foodDrinkNounsFolderId,
  parentId: 'nouns',
  label: 'Food & Drink',
  badge: 'FOOD',
  description: 'Food & Drink nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${foodDrinkNounsData.length} noun cards`,
  isFolder: true,
};

export const foodDrinkNounsLessonSets = foodDrinkNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: foodDrinkNounsFolderId }));
