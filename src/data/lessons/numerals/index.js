import { ordinalNumeralsLessonSets, ordinalNumeralsFolder } from './ordinals';
import { collectiveNumeralsLessonSets, collectiveNumeralsFolder } from './collectives';

export const numeralsFolderId = "numerals";

export const numeralsFolder = {
  id: numeralsFolderId,
  label: "Numerals (Ordinal & Collective)",
  badge: "NUM",
  description: "Russian ordinal numerals (agreeing adjectives) and collective numerals (двое, трое) with their special governance.",
  missionCountLabel: '2 numeral groups',
  isFolder: true,
};

export const numeralsGroupFolders = [
  ordinalNumeralsFolder,
  collectiveNumeralsFolder,
];

export const numeralsLessonSets = [
  ...ordinalNumeralsLessonSets,
  ...collectiveNumeralsLessonSets,
];
