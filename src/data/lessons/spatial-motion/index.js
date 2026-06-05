import vSet from './v.json';
import naSet from './na.json';
import izSet from './iz.json';
import kSet from './k.json';
import sSet from './s.json';
import poSet from './po.json';
import oSet from './o.json';
import otSet from './ot.json';
import doSet from './do.json';
import podSet from './pod.json';
import nadSet from './nad.json';

export const spatialMotionFolderId = 'spatial-motion';
const spatialMotionSetData = [
  ...vSet,
  ...naSet,
  ...izSet,
  ...kSet,
  ...sSet,
  ...poSet,
  ...oSet,
  ...otSet,
  ...doSet,
  ...podSet,
  ...nadSet,
];

export const spatialMotionFolder = {
  id: spatialMotionFolderId,
  label: 'Spatial Motion',
  badge: 'SM',
  description: 'Location and motion prepositions: в, на, из, к, с, по, о, от, до, под, над — each with its case government.',
  missionCountLabel: `${spatialMotionSetData.length} motion sets`,
  isFolder: true,
};

export const spatialMotionLessonSets = spatialMotionSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: spatialMotionFolderId,
}));
