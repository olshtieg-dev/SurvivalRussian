import { hypotheticalConditionalsLessonSets, hypotheticalConditionalsFolder } from './hypotheticals';
import { requestConditionalsLessonSets, requestConditionalsFolder } from './requests';
import { adviceConditionalsLessonSets, adviceConditionalsFolder } from './advice';

export const conditionalFolderId = 'conditional';

export const conditionalFolder = {
  id: conditionalFolderId,
  label: "Conditional & Subjunctive (бы)",
  badge: "БЫ",
  description: "The Russian conditional/subjunctive mood with бы — hypotheticals, polite requests, and advice. The particle бы always pairs with a past-tense verb.",
  missionCountLabel: '3 construction groups',
  isFolder: true,
};

export const conditionalGroupFolders = [
  hypotheticalConditionalsFolder,
  requestConditionalsFolder,
  adviceConditionalsFolder,
];

export const conditionalLessonSets = [
  ...hypotheticalConditionalsLessonSets,
  ...requestConditionalsLessonSets,
  ...adviceConditionalsLessonSets,
];
