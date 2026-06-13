import nemoglibySet from './nemogliby.json';
import khotelbySet from './khotelby.json';
import khotelosbySet from './khotelosby.json';
import luchshebySet from './luchsheby.json';

export const requestConditionalsFolderId = "conditional-requests";

const requestConditionalsData = [
  ...nemoglibySet,
  ...khotelbySet,
  ...khotelosbySet,
  ...luchshebySet,
];

export const requestConditionalsFolder = {
  id: requestConditionalsFolderId,
  parentId: 'conditional',
  label: "Polite Requests & Wishes",
  badge: "COULD YOU",
  description: "Softening with бы: polite requests and wishes. бы makes a demand or want tentative and courteous. 10 sentences each.",
  missionCountLabel: `${requestConditionalsData.length} construction cards`,
  isFolder: true,
};

export const requestConditionalsLessonSets = requestConditionalsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: requestConditionalsFolderId,
}));
