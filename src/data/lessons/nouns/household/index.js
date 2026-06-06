import dverSet from './dver.json';
import formaSet from './forma.json';
import karmanSet from './karman.json';
import klyuchSet from './klyuch.json';
import kresloSet from './kreslo.json';
import krovatSet from './krovat.json';
import krugSet from './krug.json';
import lampaSet from './lampa.json';
import meshokSet from './meshok.json';
import oknoSet from './okno.json';
import oruzhieSet from './oruzhie.json';
import polSet from './pol.json';
import sapogSet from './sapog.json';
import shkafSet from './shkaf.json';
import stekloSet from './steklo.json';
import stenaSet from './stena.json';
import stolSet from './stol.json';
import stulSet from './stul.json';
import tochkaSet from './tochka.json';
import vorotSet from './vorot.json';
import yashchikSet from './yashchik.json';

export const householdNounsFolderId = 'nouns-household';
const householdNounsData = [
  ...dverSet,
  ...formaSet,
  ...karmanSet,
  ...klyuchSet,
  ...kresloSet,
  ...krovatSet,
  ...krugSet,
  ...lampaSet,
  ...meshokSet,
  ...oknoSet,
  ...oruzhieSet,
  ...polSet,
  ...sapogSet,
  ...shkafSet,
  ...stekloSet,
  ...stenaSet,
  ...stolSet,
  ...stulSet,
  ...tochkaSet,
  ...vorotSet,
  ...yashchikSet,
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

export const householdNounsLessonSets = householdNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: householdNounsFolderId }));
