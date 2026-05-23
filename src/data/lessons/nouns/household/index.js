import stolSet from './stol.json';
import oknoSet from './okno.json';

export const householdNounsFolderId = 'nouns-household';
const householdNounsData = [...stolSet, ...oknoSet];

export const householdNounsFolder = {
  id: householdNounsFolderId,
  parentId: 'nouns',
  label: 'Household Nouns',
  badge: 'HOME',
  description: 'Furniture, room objects, and everyday house vocabulary.',
  missionCountLabel: `${householdNounsData.length} noun cards`,
  isFolder: true,
};

export const householdNounsLessonSets = householdNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: householdNounsFolderId,
}));
