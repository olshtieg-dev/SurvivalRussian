import idtikhoditSet from './idtikhodit.json';
import ekhatezditSet from './ekhatezdit.json';
import bezhatbegatSet from './bezhatbegat.json';
import letetletatSet from './letetletat.json';
import nestinositSet from './nestinosit.json';
import vestivoditSet from './vestivodit.json';
import plytplavatSet from './plytplavat.json';

export const motionVerbsFolderId = "motion-verbs";

const motionVerbsData = [
  ...idtikhoditSet,
  ...ekhatezditSet,
  ...bezhatbegatSet,
  ...letetletatSet,
  ...nestinositSet,
  ...vestivoditSet,
  ...plytplavatSet,
];

export const motionVerbsFolder = {
  id: motionVerbsFolderId,
  label: "Motion Verbs (Pairs)",
  badge: "MV",
  description: "Russian motion-verb pairs: determinate (one trip, in progress) vs indeterminate (habitual or round-trip). идти↔ходить, ехать↔ездить, and more. 10 contrast sentences each.",
  missionCountLabel: `${motionVerbsData.length} motion-verb pairs`,
  isFolder: true,
};

export const motionVerbsLessonSets = motionVerbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: motionVerbsFolderId,
}));
