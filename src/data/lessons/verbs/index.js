import { firstConjugationVerbSets, firstConjugationVerbFolder } from './first-conjugation';
import { secondConjugationVerbSets, secondConjugationVerbFolder } from './second-conjugation';
import { mixedConjugationVerbSets, mixedConjugationVerbFolder } from './mixed-conjugation';
import { irregularVerbSets, irregularVerbFolder } from './irregular';

export const verbsFolderId = 'verbs';

export const verbsFolder = {
  id: verbsFolderId,
  label: 'Verbs',
  badge: 'VB',
  description: 'Verb families grouped by conjugation pattern. Each verb card is a full conjugation deck: present persons, past genders, future, and imperative.',
  missionCountLabel: '4 verb families',
  isFolder: true,
};

export const verbsGroupFolders = [
  firstConjugationVerbFolder,
  secondConjugationVerbFolder,
  mixedConjugationVerbFolder,
  irregularVerbFolder,
];

export const verbsLessonSets = [
  ...firstConjugationVerbSets,
  ...secondConjugationVerbSets,
  ...mixedConjugationVerbSets,
  ...irregularVerbSets,
];
