import dvoechetveroSet from './dvoechetvero.json';
import collectivesuseSet from './collectivesuse.json';

export const collectiveNumeralsFolderId = "numerals-collectives";

const collectiveNumeralsData = [
  ...dvoechetveroSet,
  ...collectivesuseSet,
];

export const collectiveNumeralsFolder = {
  id: collectiveNumeralsFolderId,
  parentId: "numerals",
  label: "Collective Numerals",
  badge: "COL",
  description: "Collective numerals (двое, трое, четверо) for groups of people; govern the genitive plural. 10 sentences each.",
  missionCountLabel: `${collectiveNumeralsData.length} cards`,
  isFolder: true,
};

export const collectiveNumeralsLessonSets = collectiveNumeralsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: collectiveNumeralsFolderId,
}));
