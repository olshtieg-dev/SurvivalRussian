import domSet from './dom.json';
import stolSet from './stol.json';
import gorodSet from './gorod.json';
import magazinSet from './magazin.json';
import parkSet from './park.json';

export const mascHardCasesFolderId = 'cases-masc-hard';
const mascHardCasesData = [
  ...domSet,
  ...stolSet,
  ...gorodSet,
  ...magazinSet,
  ...parkSet,
];

export const mascHardCasesFolder = {
  id: mascHardCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Masculine - Hard (inanimate)',
  badge: 'MH',
  description: 'Case-drill cards for masculine - hard (inanimate) nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${mascHardCasesData.length} noun drills`,
  isFolder: true,
};

export const mascHardCasesLessonSets = mascHardCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: mascHardCasesFolderId }));
