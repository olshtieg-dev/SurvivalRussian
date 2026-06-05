import nadoSet from './nado.json';
import nuzhnoSet from './nuzhno.json';
import mozhnoSet from './mozhno.json';
import vidnoSet from './vidno.json';
import ladnoSet from './ladno.json';
import navernoeSet from './navernoe.json';
import vidimoSet from './vidimo.json';
import nevozmozhnoSet from './nevozmozhno.json';
import trudnoSet from './trudno.json';
import ponyatnoSet from './ponyatno.json';

export const predicativeAdverbsFolderId = 'adverbs-predicative';
const predicativeAdverbsData = [
  ...nadoSet,
  ...nuzhnoSet,
  ...mozhnoSet,
  ...vidnoSet,
  ...ladnoSet,
  ...navernoeSet,
  ...vidimoSet,
  ...nevozmozhnoSet,
  ...trudnoSet,
  ...ponyatnoSet,
];

export const predicativeAdverbsFolder = {
  id: predicativeAdverbsFolderId,
  parentId: 'adverbs',
  label: 'Predicatives & Modals',
  badge: 'MODAL',
  description: 'Impersonal predicatives and modal adverbs (надо, можно, etc.), each a 10-sentence usage card.',
  missionCountLabel: `${predicativeAdverbsData.length} adverb cards`,
  isFolder: true,
};

export const predicativeAdverbsLessonSets = predicativeAdverbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: predicativeAdverbsFolderId,
}));
