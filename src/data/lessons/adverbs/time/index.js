import eshchyoSet from './eshchyo.json';
import uzheSet from './uzhe.json';
import potomSet from './potom.json';
import teperSet from './teper.json';
import srazuSet from './srazu.json';
import segodnyaSet from './segodnya.json';
import zavtraSet from './zavtra.json';
import skoroSet from './skoro.json';
import davnoSet from './davno.json';
import dolgoSet from './dolgo.json';
import nakonetsSet from './nakonets.json';
import zatemSet from './zatem.json';
import snachalaSet from './snachala.json';
import odnazhdySet from './odnazhdy.json';
import prezhdeSet from './prezhde.json';
import nedavnoSet from './nedavno.json';
import vpervyeSet from './vpervye.json';
import vskoreSet from './vskore.json';
import vsegdaSet from './vsegda.json';
import inogdaSet from './inogda.json';
import chastoSet from './chasto.json';
import obychnoSet from './obychno.json';
import snovaSet from './snova.json';
import opyatSet from './opyat.json';
import vnovSet from './vnov.json';

export const timeAdverbsFolderId = 'adverbs-time';
const timeAdverbsData = [
  ...eshchyoSet,
  ...uzheSet,
  ...potomSet,
  ...teperSet,
  ...srazuSet,
  ...segodnyaSet,
  ...zavtraSet,
  ...skoroSet,
  ...davnoSet,
  ...dolgoSet,
  ...nakonetsSet,
  ...zatemSet,
  ...snachalaSet,
  ...odnazhdySet,
  ...prezhdeSet,
  ...nedavnoSet,
  ...vpervyeSet,
  ...vskoreSet,
  ...vsegdaSet,
  ...inogdaSet,
  ...chastoSet,
  ...obychnoSet,
  ...snovaSet,
  ...opyatSet,
  ...vnovSet,
];

export const timeAdverbsFolder = {
  id: timeAdverbsFolderId,
  parentId: 'adverbs',
  label: 'Adverbs of Time',
  badge: 'TIME',
  description: 'When and how often: time and frequency adverbs, each a 10-sentence usage card.',
  missionCountLabel: `${timeAdverbsData.length} adverb cards`,
  isFolder: true,
};

export const timeAdverbsLessonSets = timeAdverbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: timeAdverbsFolderId,
}));
