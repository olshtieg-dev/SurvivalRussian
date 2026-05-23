import demonstrativesMatrix from './pointing-matrix.json';

export const demonstrativesFolderId = 'pro-forms-demonstratives';
const demonstrativesData = [...demonstrativesMatrix];

export const demonstrativesFolder = {
  id: demonstrativesFolderId,
  parentId: 'pro-forms',
  label: 'Demonstratives',
  badge: 'D',
  description: 'Pointing words for nearness, distance, time placement, and visible reference.',
  missionCountLabel: `${demonstrativesData.length} lesson cards`,
  isFolder: true,
};

export const demonstrativesLessonSets = demonstrativesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: demonstrativesFolderId,
}));
