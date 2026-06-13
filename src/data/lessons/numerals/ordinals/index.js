import pervyypyatyySet from './pervyypyatyy.json';
import shestoydesyatyySet from './shestoydesyatyy.json';
import ordinalydatySet from './ordinalydaty.json';

export const ordinalNumeralsFolderId = "numerals-ordinals";

const ordinalNumeralsData = [
  ...pervyypyatyySet,
  ...shestoydesyatyySet,
  ...ordinalydatySet,
];

export const ordinalNumeralsFolder = {
  id: ordinalNumeralsFolderId,
  parentId: "numerals",
  label: "Ordinal Numerals",
  badge: "ORD",
  description: "Ordinals (первый, второй, …) decline and agree like adjectives. Ranking, dates, floors. 10 sentences each.",
  missionCountLabel: `${ordinalNumeralsData.length} cards`,
  isFolder: true,
};

export const ordinalNumeralsLessonSets = ordinalNumeralsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: ordinalNumeralsFolderId,
}));
