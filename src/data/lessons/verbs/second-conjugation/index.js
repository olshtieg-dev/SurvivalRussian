import govoritSet from './govorit.json';
import lyubitSet from './lyubit.json';
import videtSet from './videt.json';
import smotretSet from './smotret.json';
import slyshatSet from './slyshat.json';

export const secondConjugationVerbFolderId = 'verbs-second-conjugation';
const secondConjugationVerbData = [
  ...govoritSet,
  ...lyubitSet,
  ...videtSet,
  ...smotretSet,
  ...slyshatSet,
];

export const secondConjugationVerbFolder = {
  id: secondConjugationVerbFolderId,
  parentId: 'verbs',
  label: 'Second Conjugation',
  badge: '2C',
  description: 'Verbs that follow the second-conjugation pattern. The -ить / -еть / -ать (2nd-conj) family.',
  missionCountLabel: `${secondConjugationVerbData.length} verb cards`,
  isFolder: true,
};

export const secondConjugationVerbSets = secondConjugationVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: secondConjugationVerbFolderId,
}));
