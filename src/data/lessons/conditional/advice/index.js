import natvoyommesteSet from './natvoyommeste.json';
import tebebySet from './tebeby.json';
import tybySet from './tyby.json';

export const adviceConditionalsFolderId = "conditional-advice";

const adviceConditionalsData = [
  ...natvoyommesteSet,
  ...tebebySet,
  ...tybySet,
];

export const adviceConditionalsFolder = {
  id: adviceConditionalsFolderId,
  parentId: 'conditional',
  label: "Advice & Suggestions",
  badge: "IF I WERE YOU",
  description: "Suggesting with бы: gentle advice. бы + past or бы + infinitive proposes a course of action. 10 sentences each.",
  missionCountLabel: `${adviceConditionalsData.length} construction cards`,
  isFolder: true,
};

export const adviceConditionalsLessonSets = adviceConditionalsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: adviceConditionalsFolderId,
}));
