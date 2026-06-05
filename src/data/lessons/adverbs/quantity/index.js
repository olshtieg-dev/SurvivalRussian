import mnogoSet from './mnogo.json';
import maloSet from './malo.json';
import nemnogoSet from './nemnogo.json';
import stolkoSet from './stolko.json';
import skolkoSet from './skolko.json';

export const quantityAdverbsFolderId = 'adverbs-quantity';
const quantityAdverbsData = [
  ...mnogoSet,
  ...maloSet,
  ...nemnogoSet,
  ...stolkoSet,
  ...skolkoSet,
];

export const quantityAdverbsFolder = {
  id: quantityAdverbsFolderId,
  parentId: 'adverbs',
  label: 'Quantity Adverbs',
  badge: 'QTY',
  description: 'How many or how much: quantity adverbs, each a 10-sentence usage card.',
  missionCountLabel: `${quantityAdverbsData.length} adverb cards`,
  isFolder: true,
};

export const quantityAdverbsLessonSets = quantityAdverbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: quantityAdverbsFolderId,
}));
