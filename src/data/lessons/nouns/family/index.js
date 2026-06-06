import babushkaSet from './babushka.json';
import bratSet from './brat.json';
import dedSet from './ded.json';
import dochSet from './doch.json';
import dyadyaSet from './dyadya.json';
import mamaSet from './mama.json';
import matSet from './mat.json';
import muzhSet from './muzh.json';
import otetsSet from './otets.json';
import papaSet from './papa.json';
import rebyonokSet from './rebyonok.json';
import rodSet from './rod.json';
import roditelSet from './roditel.json';
import semyaSet from './semya.json';
import sestraSet from './sestra.json';
import synSet from './syn.json';
import zhenaSet from './zhena.json';

export const familyNounsFolderId = 'nouns-family';
const familyNounsData = [
  ...babushkaSet,
  ...bratSet,
  ...dedSet,
  ...dochSet,
  ...dyadyaSet,
  ...mamaSet,
  ...matSet,
  ...muzhSet,
  ...otetsSet,
  ...papaSet,
  ...rebyonokSet,
  ...rodSet,
  ...roditelSet,
  ...semyaSet,
  ...sestraSet,
  ...synSet,
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
