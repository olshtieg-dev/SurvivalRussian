import chitayushchiySet from './chitayushchiy.json';
import govoryashchiySet from './govoryashchiy.json';
import rabotayushchiySet from './rabotayushchiy.json';
import zhivushchiySet from './zhivushchiy.json';
import idushchiySet from './idushchiy.json';
import lyubyashchiySet from './lyubyashchiy.json';

export const presentActiveParticiplesFolderId = "participles-present-active";

const presentActiveParticiplesData = [
  ...chitayushchiySet,
  ...govoryashchiySet,
  ...rabotayushchiySet,
  ...zhivushchiySet,
  ...idushchiySet,
  ...lyubyashchiySet,
];

export const presentActiveParticiplesFolder = {
  id: presentActiveParticiplesFolderId,
  parentId: 'participles',
  label: "Present Active Participles",
  badge: "PRES-ACT",
  description: "The -щ- participle: 'the one who is doing X'. Each card is 10 sentences across agreement and case.",
  missionCountLabel: `${presentActiveParticiplesData.length} participle cards`,
  isFolder: true,
};

export const presentActiveParticiplesLessonSets = presentActiveParticiplesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: presentActiveParticiplesFolderId,
}));
