import byitSet from './byt.json';
import estSet from './est.json';
import datSet from './dat.json';
import idtiSet from './idti.json';

export const irregularVerbFolderId = 'verbs-irregular';
const irregularVerbData = [...byitSet, ...estSet, ...datSet, ...idtiSet];

export const irregularVerbFolder = {
  id: irregularVerbFolderId,
  parentId: 'verbs',
  label: 'Irregular Verbs',
  badge: 'IRR',
  description: 'Irregular and high-frequency verbs that need their own dedicated conjugation cards.',
  missionCountLabel: `${irregularVerbData.length} verb cards`,
  isFolder: true,
};

export const irregularVerbSets = irregularVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: irregularVerbFolderId,
}));
