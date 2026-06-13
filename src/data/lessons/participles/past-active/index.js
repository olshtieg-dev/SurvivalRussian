import sdelavshiySet from './sdelavshiy.json';
import prishedshiySet from './prishedshiy.json';
import napisavshiySet from './napisavshiy.json';
import uvidevshiySet from './uvidevshiy.json';
import kupivshiySet from './kupivshiy.json';
import ushedshiySet from './ushedshiy.json';

export const pastActiveParticiplesFolderId = "participles-past-active";

const pastActiveParticiplesData = [
  ...sdelavshiySet,
  ...prishedshiySet,
  ...napisavshiySet,
  ...uvidevshiySet,
  ...kupivshiySet,
  ...ushedshiySet,
];

export const pastActiveParticiplesFolder = {
  id: pastActiveParticiplesFolderId,
  parentId: 'participles',
  label: "Past Active Participles",
  badge: "PAST-ACT",
  description: "The -вш-/-ш- participle: 'the one who did X'. Each card is 10 sentences across agreement and case.",
  missionCountLabel: `${pastActiveParticiplesData.length} participle cards`,
  isFolder: true,
};

export const pastActiveParticiplesLessonSets = pastActiveParticiplesData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: pastActiveParticiplesFolderId,
}));
