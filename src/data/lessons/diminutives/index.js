import ikchikSet from './ikchik.json';
import okyokSet from './okyok.json';
import ochkaechkaSet from './ochkaechka.json';
import enkaSet from './enka.json';
import ushkaSet from './ushka.json';
import ishcheSet from './ishche.json';

export const diminutivesFolderId = "diminutives";

const diminutivesData = [
  ...ikchikSet,
  ...okyokSet,
  ...ochkaechkaSet,
  ...enkaSet,
  ...ushkaSet,
  ...ishcheSet,
];

export const diminutivesFolder = {
  id: diminutivesFolderId,
  label: "Diminutives & Augmentatives",
  badge: "DIM",
  description: "Russian diminutive and augmentative suffixes — size, affection, and tone. 10 sentences each.",
  missionCountLabel: `${diminutivesData.length} cards`,
  isFolder: true,
};

export const diminutivesLessonSets = diminutivesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: diminutivesFolderId,
}));
