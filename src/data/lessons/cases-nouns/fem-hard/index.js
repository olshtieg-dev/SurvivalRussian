import knigaSet from './kniga.json';
import mashinaSet from './mashina.json';
import shkolaSet from './shkola.json';
import sestraSet from './sestra.json';
import rabotaSet from './rabota.json';

export const femHardCasesFolderId = 'cases-fem-hard';
const femHardCasesData = [
  ...knigaSet,
  ...mashinaSet,
  ...shkolaSet,
  ...sestraSet,
  ...rabotaSet,
];

export const femHardCasesFolder = {
  id: femHardCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Feminine - Hard (-а)',
  badge: 'FH',
  description: 'Case-drill cards for feminine - hard (-а) nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${femHardCasesData.length} noun drills`,
  isFolder: true,
};

export const femHardCasesLessonSets = femHardCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: femHardCasesFolderId }));
