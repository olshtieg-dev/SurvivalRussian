import korablSet from './korabl.json';
import mashinaSet from './mashina.json';
import poezdSet from './poezd.json';
import samolyotSet from './samolyot.json';

export const transportNounsFolderId = 'nouns-transport';
const transportNounsData = [
  ...korablSet,
  ...mashinaSet,
  ...poezdSet,
  ...samolyotSet,
];

export const transportNounsFolder = {
  id: transportNounsFolderId,
  parentId: 'nouns',
  label: 'Transport',
  badge: 'TRANS',
  description: 'Transport nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${transportNounsData.length} noun cards`,
  isFolder: true,
};

export const transportNounsLessonSets = transportNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: transportNounsFolderId }));
