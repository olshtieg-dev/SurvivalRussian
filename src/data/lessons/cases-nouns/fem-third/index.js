import dverSet from './dver.json';
import nochSet from './noch.json';
import ploshchadSet from './ploshchad.json';
import zhiznSet from './zhizn.json';
import tetradSet from './tetrad.json';

export const femThirdCasesFolderId = 'cases-fem-third';
const femThirdCasesData = [
  ...dverSet,
  ...nochSet,
  ...ploshchadSet,
  ...zhiznSet,
  ...tetradSet,
];

export const femThirdCasesFolder = {
  id: femThirdCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Feminine - 3rd declension (-ь)',
  badge: 'F3',
  description: 'Case-drill cards for feminine - 3rd declension (-ь) nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${femThirdCasesData.length} noun drills`,
  isFolder: true,
};

export const femThirdCasesLessonSets = femThirdCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: femThirdCasesFolderId }));
