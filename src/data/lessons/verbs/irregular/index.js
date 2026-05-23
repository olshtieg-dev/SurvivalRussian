import byitSet from './byt.json';

export const irregularVerbFolderId = 'verbs-irregular';
const irregularVerbData = [...byitSet];

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
