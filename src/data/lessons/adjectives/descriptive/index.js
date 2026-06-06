import glavnyiSet from './glavnyi.json';
import russkiiSet from './russkii.json';
import obshchiiSet from './obshchii.json';
import izvestnyiSet from './izvestnyi.json';
import tselyiSet from './tselyi.json';
import velikiiSet from './velikii.json';
import nuzhnyiSet from './nuzhnyi.json';
import gotovyiSet from './gotovyi.json';
import vozmozhnyiSet from './vozmozhnyi.json';
import neobkhodimyiSet from './neobkhodimyi.json';

export const descriptiveAdjFolderId = 'adjectives-descriptive';
const descriptiveAdjData = [
  ...glavnyiSet,
  ...russkiiSet,
  ...obshchiiSet,
  ...izvestnyiSet,
  ...tselyiSet,
  ...velikiiSet,
  ...nuzhnyiSet,
  ...gotovyiSet,
  ...vozmozhnyiSet,
  ...neobkhodimyiSet,
];

export const descriptiveAdjFolder = {
  id: descriptiveAdjFolderId,
  parentId: 'adjectives',
  label: 'Describing Words',
  badge: 'DESC',
  description: 'Describing Words — standalone adjectives, each a 10-sentence agreement card.',
  missionCountLabel: `${descriptiveAdjData.length} adjective cards`,
  isFolder: true,
};

export const descriptiveAdjLessonSets = descriptiveAdjData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: descriptiveAdjFolderId }));
