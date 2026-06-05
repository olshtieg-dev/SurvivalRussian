import ochenSet from './ochen.json';
import dazheSet from './dazhe.json';
import boleeSet from './bolee.json';
import sovsemSet from './sovsem.json';
import pochtiSet from './pochti.json';
import chutSet from './chut.json';
import imennoSet from './imenno.json';
import osobennoSet from './osobenno.json';
import slishkomSet from './slishkom.json';
import vpolneSet from './vpolne.json';
import edvaSet from './edva.json';
import dovolnoSet from './dovolno.json';
import sovershennoSet from './sovershenno.json';
import meneeSet from './menee.json';
import vesmaSet from './vesma.json';
import stolSet from './stol.json';
import slegkaSet from './slegka.json';
import vovseSet from './vovse.json';
import silnoSet from './silno.json';
import tolkoSet from './tolko.json';
import lishSet from './lish.json';

export const degreeAdverbsFolderId = 'adverbs-degree';
const degreeAdverbsData = [
  ...ochenSet,
  ...dazheSet,
  ...boleeSet,
  ...sovsemSet,
  ...pochtiSet,
  ...chutSet,
  ...imennoSet,
  ...osobennoSet,
  ...slishkomSet,
  ...vpolneSet,
  ...edvaSet,
  ...dovolnoSet,
  ...sovershennoSet,
  ...meneeSet,
  ...vesmaSet,
  ...stolSet,
  ...slegkaSet,
  ...vovseSet,
  ...silnoSet,
  ...tolkoSet,
  ...lishSet,
];

export const degreeAdverbsFolder = {
  id: degreeAdverbsFolderId,
  parentId: 'adverbs',
  label: 'Degree & Intensity',
  badge: 'DEG',
  description: 'How much: degree, intensity, and restrictive adverbs, each a 10-sentence usage card.',
  missionCountLabel: `${degreeAdverbsData.length} adverb cards`,
  isFolder: true,
};

export const degreeAdverbsLessonSets = degreeAdverbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: degreeAdverbsFolderId,
}));
