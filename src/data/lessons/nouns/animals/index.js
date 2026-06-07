import bykSet from './byk.json';
import konSet from './kon.json';
import korovaSet from './korova.json';
import koshkaSet from './koshka.json';
import kotSet from './kot.json';
import lapaSet from './lapa.json';
import loshadSet from './loshad.json';
import medvedSet from './medved.json';
import mordaSet from './morda.json';
import mukhaSet from './mukha.json';
import obezyanaSet from './obezyana.json';
import ptitsaSet from './ptitsa.json';
import pyosSet from './pyos.json';
import slonSet from './slon.json';
import sobakaSet from './sobaka.json';
import volkSet from './volk.json';
import zverSet from './zver.json';

export const animalsNounsFolderId = 'nouns-animals';
const animalsNounsData = [
  ...bykSet,
  ...konSet,
  ...korovaSet,
  ...koshkaSet,
  ...kotSet,
  ...lapaSet,
  ...loshadSet,
  ...medvedSet,
  ...mordaSet,
  ...mukhaSet,
  ...obezyanaSet,
  ...ptitsaSet,
  ...pyosSet,
  ...slonSet,
  ...sobakaSet,
  ...volkSet,
  ...zverSet,
];

export const animalsNounsFolder = {
  id: animalsNounsFolderId,
  parentId: 'nouns',
  label: 'Animals',
  badge: 'ANIMAL',
  description: 'Animals nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${animalsNounsData.length} noun cards`,
  isFolder: true,
};

export const animalsNounsLessonSets = animalsNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: animalsNounsFolderId }));
