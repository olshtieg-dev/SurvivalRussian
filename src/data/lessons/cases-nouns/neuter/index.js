import oknoSet from './okno.json';
import mestoSet from './mesto.json';
import slovoSet from './slovo.json';
import moreSet from './more.json';
import zdanieSet from './zdanie.json';

export const neuterCasesFolderId = 'cases-neuter';
const neuterCasesData = [
  ...oknoSet,
  ...mestoSet,
  ...slovoSet,
  ...moreSet,
  ...zdanieSet,
];

export const neuterCasesFolder = {
  id: neuterCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Neuter (-о, -е, -ие)',
  badge: 'NT',
  description: 'Case-drill cards for neuter (-о, -е, -ие) nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${neuterCasesData.length} noun drills`,
  isFolder: true,
};

export const neuterCasesLessonSets = neuterCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: neuterCasesFolderId }));
