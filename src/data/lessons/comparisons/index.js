import esliSet from './esli.json';
import iSet from './i.json';
import iliSet from './ili.json';
import noSet from './no.json';
import aSet from './a.json';
import chtoSet from './chto.json';
import potomuChtoSet from './potomu-chto.json';
import poetomuSet from './poetomu.json';
import chtobySet from './chtoby.json';
import tozheSet from './tozhe.json';

export const comparisonsFolderId = 'comparisons';
const comparisonsSetData = [
  ...esliSet,
  ...iSet,
  ...iliSet,
  ...noSet,
  ...aSet,
  ...chtoSet,
  ...potomuChtoSet,
  ...poetomuSet,
  ...chtobySet,
  ...tozheSet,
];

export const comparisonsFolder = {
  id: comparisonsFolderId,
  label: 'Comparisons & Logic',
  badge: 'CL',
  description: 'Conditionals, conjunctions, and contrast patterns that control sentence logic.',
  missionCountLabel: `${comparisonsSetData.length} logic sets`,
  isFolder: true,
};

export const comparisonsLessonSets = comparisonsSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: comparisonsFolderId,
}));
