import etoSet from './eto.json';
import domSet from './dom.json';
import vodaSet from './voda.json';
import yaSet from './ya.json';
import tySet from './ty.json';
import mySet from './my.json';
import nashSet from './nash.json';
import vashSet from './vash.json';
import moiSet from './moi.json';
import tvoiSet from './tvoi.json';
import onSet from './on.json';
import onaSet from './ona.json';
import oniSet from './oni.json';
import egoSet from './ego.json';
import eeSet from './ee.json';
import ihSet from './ih.json';
import menyaSet from './menya.json';
import tebyaSet from './tebya.json';
import egoObjSet from './ego-obj.json';
import eeyoSet from './eeyo.json';
import imiSet from './imi.json';
import omneSet from './o-mne.json';
import otebeSet from './o-tebe.json';
import onemSet from './o-nem.json';
import oneiSet from './o-nei.json';
import onasSet from './o-nas.json';
import ovasSet from './o-vas.json';
import onikhSet from './o-nikh.json';

export const lexicalSetsFolderId = 'lexical-sets';
const lexicalSetData = [
  ...etoSet,
  ...domSet,
  ...vodaSet,
  ...yaSet,
  ...tySet,
  ...mySet,
  ...moiSet,
  ...tvoiSet,
  ...nashSet,
  ...vashSet,
  ...egoSet,
  ...eeSet,
  ...ihSet,
  ...menyaSet,
  ...tebyaSet,
  ...egoObjSet,
  ...eeyoSet,
  ...imiSet,
  ...omneSet,
  ...otebeSet,
  ...onemSet,
  ...oneiSet,
  ...onasSet,
  ...ovasSet,
  ...onikhSet,
  ...onSet,
  ...onaSet,
  ...oniSet,
];

export const lexicalSetFolder = {
  id: lexicalSetsFolderId,
  label: 'Lexical Sets',
  badge: 'LX',
  description: 'A folder of word-targeted sentence packs. Each set focuses on one common word or phrase.',
  missionCountLabel: `${lexicalSetData.length} word sets`,
  isFolder: true,
};

export const lexicalLessonSets = lexicalSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: lexicalSetsFolderId,
}));
