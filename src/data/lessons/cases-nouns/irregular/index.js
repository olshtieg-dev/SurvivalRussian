import matSet from './mat.json';
import dochSet from './doch.json';
import vremyaSet from './vremya.json';
import imyaSet from './imya.json';
import otetsSet from './otets.json';
import denSet from './den.json';
import putSet from './put.json';
import rebyonokSet from './rebyonok.json';

export const irregularCasesFolderId = 'cases-irregular';
const irregularCasesData = [
  ...matSet,
  ...dochSet,
  ...vremyaSet,
  ...imyaSet,
  ...otetsSet,
  ...denSet,
  ...putSet,
  ...rebyonokSet,
];

export const irregularCasesFolder = {
  id: irregularCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Irregular and Fleeting-vowel',
  badge: 'IR',
  description: 'Case-drill cards for irregular and fleeting-vowel nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${irregularCasesData.length} noun drills`,
  isFolder: true,
};

export const irregularCasesLessonSets = irregularCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: irregularCasesFolderId }));
