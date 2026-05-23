import delatSet from './delat.json';

export const firstConjugationVerbFolderId = 'verbs-first-conjugation';
const firstConjugationVerbData = [...delatSet];

export const firstConjugationVerbFolder = {
  id: firstConjugationVerbFolderId,
  parentId: 'verbs',
  label: 'First Conjugation',
  badge: '1C',
  description: 'Verbs that follow the first-conjugation pattern. Start here for the standard -у/-ю family.',
  missionCountLabel: `${firstConjugationVerbData.length} verb cards`,
  isFolder: true,
};

export const firstConjugationVerbSets = firstConjugationVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: firstConjugationVerbFolderId,
}));
