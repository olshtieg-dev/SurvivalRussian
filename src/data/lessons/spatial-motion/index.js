import vSet from './v.json';
import naSet from './na.json';
import izSet from './iz.json';
import kSet from './k.json';
import sSet from './s.json';

export const spatialMotionFolderId = 'spatial-motion';
const spatialMotionSetData = [...vSet, ...naSet, ...izSet, ...kSet, ...sSet];

export const spatialMotionFolder = {
  id: spatialMotionFolderId,
  label: 'Spatial Motion',
  badge: 'SM',
  description: 'Location and motion contrasts built around в, на, из, к, and с.',
  missionCountLabel: `${spatialMotionSetData.length} motion sets`,
  isFolder: true,
};

export const spatialMotionLessonSets = spatialMotionSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: spatialMotionFolderId,
}));
