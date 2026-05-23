import ideyaSet from './ideya.json';
import mnenieSet from './mnenie.json';

export const abstractNounsFolderId = 'nouns-abstract';
const abstractNounsData = [...ideyaSet, ...mnenieSet];

export const abstractNounsFolder = {
  id: abstractNounsFolderId,
  parentId: 'nouns',
  label: 'Abstract Nouns',
  badge: 'IDEA',
  description: 'Ideas, opinions, reasons, and debate-friendly semantic nouns.',
  missionCountLabel: `${abstractNounsData.length} noun cards`,
  isFolder: true,
};

export const abstractNounsLessonSets = abstractNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: abstractNounsFolderId,
}));
