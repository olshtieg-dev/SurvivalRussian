import sdelannyySet from './sdelannyy.json';
import napisannyySet from './napisannyy.json';
import prochitannyySet from './prochitannyy.json';
import otkrytyySet from './otkrytyy.json';
import zakrytyySet from './zakrytyy.json';
import postroennyySet from './postroennyy.json';

export const pastPassiveParticiplesFolderId = "participles-past-passive";

const pastPassiveParticiplesData = [
  ...sdelannyySet,
  ...napisannyySet,
  ...prochitannyySet,
  ...otkrytyySet,
  ...zakrytyySet,
  ...postroennyySet,
];

export const pastPassiveParticiplesFolder = {
  id: pastPassiveParticiplesFolderId,
  parentId: 'participles',
  label: "Past Passive Participles",
  badge: "PAST-PASS",
  description: "The -нн-/-енн-/-т- participle: 'the one that was X-ed', plus its short form (сделан/написан). 10 sentences each.",
  missionCountLabel: `${pastPassiveParticiplesData.length} participle cards`,
  isFolder: true,
};

export const pastPassiveParticiplesLessonSets = pastPassiveParticiplesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: pastPassiveParticiplesFolderId,
}));
