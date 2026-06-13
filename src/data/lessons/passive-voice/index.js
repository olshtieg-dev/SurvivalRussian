import reflexivepassiveSet from './reflexivepassive.json';
import bylpostroenSet from './bylpostroen.json';
import agentinstrSet from './agentinstr.json';
import activepassiveSet from './activepassive.json';

export const passiveVoiceFolderId = "passive-voice";

const passiveVoiceData = [
  ...reflexivepassiveSet,
  ...bylpostroenSet,
  ...agentinstrSet,
  ...activepassiveSet,
];

export const passiveVoiceFolder = {
  id: passiveVoiceFolderId,
  label: "Passive Voice",
  badge: "PASS",
  description: "Russian passive constructions: the reflexive -ся passive and the periphrastic быть + short participle passive, with the agent in the instrumental. 10 sentences each.",
  missionCountLabel: `${passiveVoiceData.length} cards`,
  isFolder: true,
};

export const passiveVoiceLessonSets = passiveVoiceData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: passiveVoiceFolderId,
}));
