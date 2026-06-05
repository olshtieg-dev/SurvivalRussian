import govoritSet from './govorit.json';
import lyubitSet from './lyubit.json';
import slyshatSet from './slyshat.json';
import smotretSet from './smotret.json';
import videtSet from './videt.json';
import stoyatSet from './stoyat.json';
import sprositSet from './sprosit.json';
import uvidetSet from './uvidet.json';
import otvetitSet from './otvetit.json';
import znachitSet from './znachit.json';
import posmotretSet from './posmotret.json';
import lezhatSet from './lezhat.json';
import reshitSet from './reshit.json';
import pomnitSet from './pomnit.json';
import poluchitSet from './poluchit.json';
import khoditSet from './khodit.json';
import zametitSet from './zametit.json';
import boyatsyaSet from './boyatsya.json';
import glyadetSet from './glyadet.json';
import poyavitsyaSet from './poyavitsya.json';
import vykhoditSet from './vykhodit.json';
import prositSet from './prosit.json';
import vspomnitSet from './vspomnit.json';
import derzhatSet from './derzhat.json';
import ukhoditSet from './ukhodit.json';
import brositSet from './brosit.json';
import nakhoditsyaSet from './nakhoditsya.json';
import postavitSet from './postavit.json';
import spatSet from './spat.json';
import ostavitSet from './ostavit.json';
import molchatSet from './molchat.json';
import stanovitsyaSet from './stanovitsya.json';
import ostanovitsyaSet from './ostanovitsya.json';
import veritSet from './verit.json';
import krichatSet from './krichat.json';
import proiskhoditSet from './proiskhodit.json';

export const secondConjugationVerbFolderId = 'verbs-second-conjugation';
const secondConjugationVerbData = [
  ...govoritSet,
  ...lyubitSet,
  ...slyshatSet,
  ...smotretSet,
  ...videtSet,
  ...stoyatSet,
  ...sprositSet,
  ...uvidetSet,
  ...otvetitSet,
  ...znachitSet,
  ...posmotretSet,
  ...lezhatSet,
  ...reshitSet,
  ...pomnitSet,
  ...poluchitSet,
  ...khoditSet,
  ...zametitSet,
  ...boyatsyaSet,
  ...glyadetSet,
  ...poyavitsyaSet,
  ...vykhoditSet,
  ...prositSet,
  ...vspomnitSet,
  ...derzhatSet,
  ...ukhoditSet,
  ...brositSet,
  ...nakhoditsyaSet,
  ...postavitSet,
  ...spatSet,
  ...ostavitSet,
  ...molchatSet,
  ...stanovitsyaSet,
  ...ostanovitsyaSet,
  ...veritSet,
  ...krichatSet,
  ...proiskhoditSet,
];

export const secondConjugationVerbFolder = {
  id: secondConjugationVerbFolderId,
  parentId: 'verbs',
  label: 'Second Conjugation',
  badge: '2C',
  description: 'Verbs that follow the second-conjugation pattern. The -ить / -еть / -ать (2nd-conj) family.',
  missionCountLabel: `${secondConjugationVerbData.length} verb cards`,
  isFolder: true,
};

export const secondConjugationVerbSets = secondConjugationVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: secondConjugationVerbFolderId,
}));
