import interrogativesMatrix from './question-matrix.json';

export const interrogativesFolderId = 'pro-forms-interrogatives';
const interrogativesData = [...interrogativesMatrix];

export const interrogativesFolder = {
  id: interrogativesFolderId,
  parentId: 'pro-forms',
  label: 'Interrogatives',
  badge: 'Q',
  description: 'Who, what, where, when, why, how, which, whose, and related question forms.',
  missionCountLabel: `${interrogativesData.length} lesson cards`,
  isFolder: true,
};

export const interrogativesLessonSets = interrogativesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: interrogativesFolderId,
}));
