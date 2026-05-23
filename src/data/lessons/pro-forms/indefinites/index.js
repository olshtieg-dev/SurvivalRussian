import indefinitesMatrix from './blank-slate-matrix.json';

export const indefinitesFolderId = 'pro-forms-indefinites';
const indefinitesData = [...indefinitesMatrix];

export const indefinitesFolder = {
  id: indefinitesFolderId,
  parentId: 'pro-forms',
  label: 'Indefinites',
  badge: 'I',
  description: 'Unknown, generic, and negative blanks: someone, something, somewhere, never, nowhere, and friends.',
  missionCountLabel: `${indefinitesData.length} lesson cards`,
  isFolder: true,
};

export const indefinitesLessonSets = indefinitesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: indefinitesFolderId,
}));
