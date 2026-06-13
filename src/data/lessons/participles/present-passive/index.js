import lyubimyySet from './lyubimyy.json';
import uvazhaemyySet from './uvazhaemyy.json';
import vidimyySet from './vidimyy.json';
import chitaemyySet from './chitaemyy.json';
import nazyvaemyySet from './nazyvaemyy.json';
import izuchaemyySet from './izuchaemyy.json';

export const presentPassiveParticiplesFolderId = "participles-present-passive";

const presentPassiveParticiplesData = [
  ...lyubimyySet,
  ...uvazhaemyySet,
  ...vidimyySet,
  ...chitaemyySet,
  ...nazyvaemyySet,
  ...izuchaemyySet,
];

export const presentPassiveParticiplesFolder = {
  id: presentPassiveParticiplesFolderId,
  parentId: 'participles',
  label: "Present Passive Participles",
  badge: "PRES-PASS",
  description: "The -ем-/-им- participle: 'the one being X-ed' (often lexicalized as an adjective). 10 sentences each.",
  missionCountLabel: `${presentPassiveParticiplesData.length} participle cards`,
  isFolder: true,
};

export const presentPassiveParticiplesLessonSets = presentPassiveParticiplesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: presentPassiveParticiplesFolderId,
}));
