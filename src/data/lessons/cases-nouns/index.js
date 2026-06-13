import { mascHardCasesLessonSets, mascHardCasesFolder } from './masc-hard';
import { mascAnimateCasesLessonSets, mascAnimateCasesFolder } from './masc-animate';
import { mascSoftCasesLessonSets, mascSoftCasesFolder } from './masc-soft';
import { femHardCasesLessonSets, femHardCasesFolder } from './fem-hard';
import { femSoftCasesLessonSets, femSoftCasesFolder } from './fem-soft';
import { femThirdCasesLessonSets, femThirdCasesFolder } from './fem-third';
import { neuterCasesLessonSets, neuterCasesFolder } from './neuter';
import { irregularCasesLessonSets, irregularCasesFolder } from './irregular';

export const casesNounsFolderId = 'cases-nouns';

const casesNounsData = [
  ...mascHardCasesLessonSets,
  ...mascAnimateCasesLessonSets,
  ...mascSoftCasesLessonSets,
  ...femHardCasesLessonSets,
  ...femSoftCasesLessonSets,
  ...femThirdCasesLessonSets,
  ...neuterCasesLessonSets,
  ...irregularCasesLessonSets,
];

export const casesNounsFolder = {
  id: casesNounsFolderId,
  label: 'Cases & Nouns',
  badge: 'CN',
  description: 'Master the six Russian cases. Each noun is a twelve-mission drill — one sentence per case in singular and plural — grouped by declension pattern.',
  missionCountLabel: '8 declension groups',
  isFolder: true,
};

export const casesNounsGroupFolders = [
  mascHardCasesFolder,
  mascAnimateCasesFolder,
  mascSoftCasesFolder,
  femHardCasesFolder,
  femSoftCasesFolder,
  femThirdCasesFolder,
  neuterCasesFolder,
  irregularCasesFolder,
];

export const casesNounsLessonSets = casesNounsData;

export default casesNounsLessonSets;
