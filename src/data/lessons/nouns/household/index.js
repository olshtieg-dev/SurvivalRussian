import stolSet from './stol.json';
import oknoSet from './okno.json';
import dverSet from './dver.json';
import stulSet from './stul.json';
import krovatSet from './krovat.json';
import stenaSet from './stena.json';
import polSet from './pol.json';
import lampaSet from './lampa.json';
import shkafSet from './shkaf.json';
import klyuchSet from './klyuch.json';

export const householdNounsFolderId = 'nouns-household';
const householdNounsData = [
  ...stolSet,
  ...oknoSet,
  ...dverSet,
  ...stulSet,
  ...krovatSet,
  ...stenaSet,
  ...polSet,
  ...lampaSet,
  ...shkafSet,
  ...klyuchSet,
];

export const householdNounsFolder = {
  id: householdNounsFolderId,
  parentId: 'nouns',
  label: 'Household Nouns',
  badge: 'HOME',
  description: 'Furniture, room objects, and everyday house vocabulary.',
  missionCountLabel: `${householdNounsData.length} noun cards`,
  isFolder: true,
};

export const householdNounsLessonSets = householdNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: householdNounsFolderId,
}));
