import govoritSet from './govorit.json';

export const secondConjugationVerbFolderId = 'verbs-second-conjugation';
const secondConjugationVerbData = [...govoritSet];

export const secondConjugationVerbFolder = {
  id: secondConjugationVerbFolderId,
  parentId: 'verbs',
  label: 'Second Conjugation',
  badge: '2C',
  description: 'Verbs that follow the second-conjugation pattern. This is the -ить family scaffold.',
  missionCountLabel: `${secondConjugationVerbData.length} verb cards`,
  isFolder: true,
};

export const secondConjugationVerbSets = secondConjugationVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: secondConjugationVerbFolderId,
}));
