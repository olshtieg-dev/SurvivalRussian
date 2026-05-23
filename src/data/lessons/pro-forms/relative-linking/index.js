import relativeLinkingMatrix from './clause-links.json';

export const relativeLinkingFolderId = 'pro-forms-relative-linking';
const relativeLinkingData = [...relativeLinkingMatrix];

export const relativeLinkingFolder = {
  id: relativeLinkingFolderId,
  parentId: 'pro-forms',
  label: 'Relative & Linking',
  badge: 'R',
  description: 'Clause-joining forms that tie explanations, definitions, and subordinate ideas together.',
  missionCountLabel: `${relativeLinkingData.length} lesson cards`,
  isFolder: true,
};

export const relativeLinkingLessonSets = relativeLinkingData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: relativeLinkingFolderId,
}));
