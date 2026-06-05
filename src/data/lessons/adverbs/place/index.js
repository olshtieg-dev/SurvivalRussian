import nazadSet from './nazad.json';
import pryamoSet from './pryamo.json';
import vokrugSet from './vokrug.json';
import domoiSet from './domoi.json';
import vperyodSet from './vperyod.json';
import vnizSet from './vniz.json';
import vverkhSet from './vverkh.json';
import mimoSet from './mimo.json';
import okoloSet from './okolo.json';
import vperediSet from './vperedi.json';
import obratnoSet from './obratno.json';
import vysheSet from './vyshe.json';
import vonSet from './von.json';
import otsyudaSet from './otsyuda.json';

export const placeAdverbsFolderId = 'adverbs-place';
const placeAdverbsData = [
  ...nazadSet,
  ...pryamoSet,
  ...vokrugSet,
  ...domoiSet,
  ...vperyodSet,
  ...vnizSet,
  ...vverkhSet,
  ...mimoSet,
  ...okoloSet,
  ...vperediSet,
  ...obratnoSet,
  ...vysheSet,
  ...vonSet,
  ...otsyudaSet,
];

export const placeAdverbsFolder = {
  id: placeAdverbsFolderId,
  parentId: 'adverbs',
  label: 'Adverbs of Place',
  badge: 'PLACE',
  description: 'Where and which direction: place and direction adverbs, each a 10-sentence usage card.',
  missionCountLabel: `${placeAdverbsData.length} adverb cards`,
  isFolder: true,
};

export const placeAdverbsLessonSets = placeAdverbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: placeAdverbsFolderId,
}));
