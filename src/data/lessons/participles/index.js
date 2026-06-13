import { presentActiveParticiplesLessonSets, presentActiveParticiplesFolder } from './present-active';
import { pastActiveParticiplesLessonSets, pastActiveParticiplesFolder } from './past-active';
import { presentPassiveParticiplesLessonSets, presentPassiveParticiplesFolder } from './present-passive';
import { pastPassiveParticiplesLessonSets, pastPassiveParticiplesFolder } from './past-passive';

export const participlesFolderId = 'participles';

export const participlesFolder = {
  id: participlesFolderId,
  label: "Participles",
  badge: "PART",
  description: "Russian participles by type — present/past, active/passive. Each participle gets its own 10-sentence card across agreement and case.",
  missionCountLabel: '4 participle groups',
  isFolder: true,
};

export const participlesGroupFolders = [
  presentActiveParticiplesFolder,
  pastActiveParticiplesFolder,
  presentPassiveParticiplesFolder,
  pastPassiveParticiplesFolder,
];

export const participlesLessonSets = [
  ...presentActiveParticiplesLessonSets,
  ...pastActiveParticiplesLessonSets,
  ...presentPassiveParticiplesLessonSets,
  ...pastPassiveParticiplesLessonSets,
];
