import chitatSet from './chitat.json';
import delatSet from './delat.json';
import dumatSet from './dumat.json';
import rabotatSet from './rabotat.json';
import znatSet from './znat.json';
import skazatSet from './skazat.json';
import mochSet from './moch.json';
import statSet from './stat.json';
import ponyatSet from './ponyat.json';
import imetSet from './imet.json';
import vzyatSet from './vzyat.json';
import sdelatSet from './sdelat.json';
import ponimatSet from './ponimat.json';
import kazatsyaSet from './kazatsya.json';
import davatSet from './davat.json';
import ostatsyaSet from './ostatsya.json';
import okazatsyaSet from './okazatsya.json';
import podumatSet from './podumat.json';
import zhdatSet from './zhdat.json';
import pisatSet from './pisat.json';
import vernutsyaSet from './vernutsya.json';
import schitatSet from './schitat.json';
import byvatSet from './byvat.json';
import uznatSet from './uznat.json';
import slushatSet from './slushat.json';
import ostavatsyaSet from './ostavatsya.json';
import bratSet from './brat.json';
import napisatSet from './napisat.json';
import nachinatSet from './nachinat.json';
import chuvstvovatSet from './chuvstvovat.json';
import vestiSet from './vesti.json';
import uspetSet from './uspet.json';
import prodolzhatSet from './prodolzhat.json';
import zabytSet from './zabyt.json';
import pytatsyaSet from './pytatsya.json';
import pokazatSet from './pokazat.json';
import nazyvatSet from './nazyvat.json';
import podnyatSet from './podnyat.json';
import sprashivatSet from './sprashivat.json';
import vstatSet from './vstat.json';
import igratSet from './igrat.json';
import sledovatSet from './sledovat.json';
import rasskazatSet from './rasskazat.json';
import rasskazyvatSet from './rasskazyvat.json';
import otvechatSet from './otvechat.json';
import iskatSet from './iskat.json';
import nachatSet from './nachat.json';
import yavlyatsyaSet from './yavlyatsya.json';
import otkrytSet from './otkryt.json';

export const firstConjugationVerbFolderId = 'verbs-first-conjugation';
const firstConjugationVerbData = [
  ...chitatSet,
  ...delatSet,
  ...dumatSet,
  ...rabotatSet,
  ...znatSet,
  ...skazatSet,
  ...mochSet,
  ...statSet,
  ...ponyatSet,
  ...imetSet,
  ...vzyatSet,
  ...sdelatSet,
  ...ponimatSet,
  ...kazatsyaSet,
  ...davatSet,
  ...ostatsyaSet,
  ...okazatsyaSet,
  ...podumatSet,
  ...zhdatSet,
  ...pisatSet,
  ...vernutsyaSet,
  ...schitatSet,
  ...byvatSet,
  ...uznatSet,
  ...slushatSet,
  ...ostavatsyaSet,
  ...bratSet,
  ...napisatSet,
  ...nachinatSet,
  ...chuvstvovatSet,
  ...vestiSet,
  ...uspetSet,
  ...prodolzhatSet,
  ...zabytSet,
  ...pytatsyaSet,
  ...pokazatSet,
  ...nazyvatSet,
  ...podnyatSet,
  ...sprashivatSet,
  ...vstatSet,
  ...igratSet,
  ...sledovatSet,
  ...rasskazatSet,
  ...rasskazyvatSet,
  ...otvechatSet,
  ...iskatSet,
  ...nachatSet,
  ...yavlyatsyaSet,
  ...otkrytSet,
];

export const firstConjugationVerbFolder = {
  id: firstConjugationVerbFolderId,
  parentId: 'verbs',
  label: 'First Conjugation',
  badge: '1C',
  description: 'Verbs that follow the first-conjugation pattern. Start here for the standard -у/-ю family.',
  missionCountLabel: `${firstConjugationVerbData.length} verb cards`,
  isFolder: true,
};

export const firstConjugationVerbSets = firstConjugationVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: firstConjugationVerbFolderId,
}));
