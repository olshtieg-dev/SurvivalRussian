import krasnyiSet from './krasnyi.json';
import zelyonyiSet from './zelyonyi.json';
import siniiSet from './sinii.json';
import zhyoltyiSet from './zhyoltyi.json';
import seryiSet from './seryi.json';
import goluboiSet from './goluboi.json';
import zolotoiSet from './zolotoi.json';

export const colorsAdjFolderId = 'adjectives-colors';
const colorsAdjData = [
  ...krasnyiSet,
  ...zelyonyiSet,
  ...siniiSet,
  ...zhyoltyiSet,
  ...seryiSet,
  ...goluboiSet,
  ...zolotoiSet,
];

export const colorsAdjFolder = {
  id: colorsAdjFolderId,
  parentId: 'adjectives',
  label: 'Colors',
  badge: 'COLOR',
  description: 'Colors — standalone adjectives, each a 10-sentence agreement card.',
  missionCountLabel: `${colorsAdjData.length} adjective cards`,
  isFolder: true,
};

export const colorsAdjLessonSets = colorsAdjData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: colorsAdjFolderId }));
