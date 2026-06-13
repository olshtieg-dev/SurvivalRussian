import svoySet from './svoy.json';
import svoyvsegoSet from './svoyvsego.json';
import svoycasesSet from './svoycases.json';
import svoyidiomsSet from './svoyidioms.json';

export const possessivesFolderId = "possessives";

const possessivesData = [
  ...svoySet,
  ...svoyvsegoSet,
  ...svoycasesSet,
  ...svoyidiomsSet,
];

export const possessivesFolder = {
  id: possessivesFolderId,
  label: "Possessives (свой)",
  badge: "POSS",
  description: "The reflexive possessive свой and its contrast with его/её/их — the most common Russian possessive trap. 10 sentences each.",
  missionCountLabel: `${possessivesData.length} cards`,
  isFolder: true,
};

export const possessivesLessonSets = possessivesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: possessivesFolderId,
}));
