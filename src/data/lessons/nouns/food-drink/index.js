import butylkaSet from './butylka.json';
import chaiSet from './chai.json';
import khlebSet from './khleb.json';
import rybaSet from './ryba.json';
import stakanSet from './stakan.json';
import trubkaSet from './trubka.json';
import vinoSet from './vino.json';
import vodaSet from './voda.json';
import vodkaSet from './vodka.json';

export const foodDrinkNounsFolderId = 'nouns-food-drink';
const foodDrinkNounsData = [
  ...butylkaSet,
  ...chaiSet,
  ...khlebSet,
  ...rybaSet,
  ...stakanSet,
  ...trubkaSet,
  ...vinoSet,
  ...vodaSet,
  ...vodkaSet,
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
