import babkaSet from './babka.json';
import babushkaSet from './babushka.json';
import bratSet from './brat.json';
import dedSet from './ded.json';
import dedushkaSet from './dedushka.json';
import dochSet from './doch.json';
import dochkaSet from './dochka.json';
import dyadyaSet from './dyadya.json';
import mamaSet from './mama.json';
import matSet from './mat.json';
import muzhSet from './muzh.json';
import otetsSet from './otets.json';
import papaSet from './papa.json';
import podrugaSet from './podruga.json';
import rebyonokSet from './rebyonok.json';
import rodSet from './rod.json';
import roditelSet from './roditel.json';
import rodstvennikSet from './rodstvennik.json';
import semyaSet from './semya.json';
import sestraSet from './sestra.json';
import starukhaSet from './starukha.json';
import synSet from './syn.json';
import tyotyaSet from './tyotya.json';
import zhenaSet from './zhena.json';

export const familyNounsFolderId = 'nouns-family';
const familyNounsData = [
  ...babkaSet,
  ...babushkaSet,
  ...bratSet,
  ...dedSet,
  ...dedushkaSet,
  ...dochSet,
  ...dochkaSet,
  ...dyadyaSet,
  ...mamaSet,
  ...matSet,
  ...muzhSet,
  ...otetsSet,
  ...papaSet,
  ...podrugaSet,
  ...rebyonokSet,
  ...rodSet,
  ...roditelSet,
  ...rodstvennikSet,
  ...semyaSet,
  ...sestraSet,
  ...starukhaSet,
  ...synSet,
  ...tyotyaSet,
  ...zhenaSet,
];

export const familyNounsFolder = {
  id: familyNounsFolderId,
  parentId: 'nouns',
  label: 'Family',
  badge: 'KIN',
  description: 'Family nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${familyNounsData.length} noun cards`,
  isFolder: true,
};

export const familyNounsLessonSets = familyNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: familyNounsFolderId }));
