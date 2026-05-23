import shortLongSet from './korotkii-dlinnyi.json';
import bigSmallSet from './bolshoi-malenkii.json';
import highLowSet from './vysokii-nizkii.json';
import fastSlowSet from './bystryi-medlennyi.json';
import heavyLightSet from './tyazhelyi-lyogkii.json';

export const binaryAdjectivesFolderId = 'binary-adjectives';
const binaryAdjectivesSetData = [
  ...shortLongSet,
  ...bigSmallSet,
  ...highLowSet,
  ...fastSlowSet,
  ...heavyLightSet,
];

export const binaryAdjectivesFolder = {
  id: binaryAdjectivesFolderId,
  label: 'Binary Adjectives',
  badge: 'BA',
  description: 'Oppositional adjective pairs that teach comparison through short practical scenes.',
  missionCountLabel: `${binaryAdjectivesSetData.length} adjective sets`,
  isFolder: true,
};

export const binaryAdjectivesLessonSets = binaryAdjectivesSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: binaryAdjectivesFolderId,
}));
