import eslibySet from './esliby.json';
import yabySet from './yaby.json';
import bylobySet from './byloby.json';

export const hypotheticalConditionalsFolderId = "conditional-hypotheticals";

const hypotheticalConditionalsData = [
  ...eslibySet,
  ...yabySet,
  ...bylobySet,
];

export const hypotheticalConditionalsFolder = {
  id: hypotheticalConditionalsFolderId,
  parentId: 'conditional',
  label: "Hypotheticals & Counterfactuals",
  badge: "IF (UNREAL)",
  description: "Unreal conditionals with бы: если бы …, … бы. The particle бы always pairs with a PAST-tense verb. 10 sentences each.",
  missionCountLabel: `${hypotheticalConditionalsData.length} construction cards`,
  isFolder: true,
};

export const hypotheticalConditionalsLessonSets = hypotheticalConditionalsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: hypotheticalConditionalsFolderId,
}));
