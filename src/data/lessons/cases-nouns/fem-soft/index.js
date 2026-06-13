import nedelyaSet from './nedelya.json';
import zemlyaSet from './zemlya.json';
import stantsiyaSet from './stantsiya.json';
import semyaSet from './semya.json';
import tyotyaSet from './tyotya.json';

export const femSoftCasesFolderId = 'cases-fem-soft';
const femSoftCasesData = [
  ...nedelyaSet,
  ...zemlyaSet,
  ...stantsiyaSet,
  ...semyaSet,
  ...tyotyaSet,
];

export const femSoftCasesFolder = {
  id: femSoftCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Feminine - Soft (-я, -ия)',
  badge: 'FS',
  description: 'Case-drill cards for feminine - soft (-я, -ия) nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${femSoftCasesData.length} noun drills`,
  isFolder: true,
};

export const femSoftCasesLessonSets = femSoftCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: femSoftCasesFolderId }));
