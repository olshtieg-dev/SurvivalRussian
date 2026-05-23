import khotetSet from './khotet.json';

export const mixedConjugationVerbFolderId = 'verbs-mixed-conjugation';
const mixedConjugationVerbData = [...khotetSet];

export const mixedConjugationVerbFolder = {
  id: mixedConjugationVerbFolderId,
  parentId: 'verbs',
  label: 'Mixed Conjugation',
  badge: 'MIX',
  description: 'Mixed-pattern verbs and verbs with root shifts or partial irregularity.',
  missionCountLabel: `${mixedConjugationVerbData.length} verb cards`,
  isFolder: true,
};

export const mixedConjugationVerbSets = mixedConjugationVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: mixedConjugationVerbFolderId,
}));
