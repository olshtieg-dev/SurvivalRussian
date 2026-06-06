import beregSet from './bereg.json';
import derevoSet from './derevo.json';
import dozhdSet from './dozhd.json';
import dymSet from './dym.json';
import gazSet from './gaz.json';
import goraSet from './gora.json';
import gryazSet from './gryaz.json';
import kamenSet from './kamen.json';
import kholodSet from './kholod.json';
import kostyorSet from './kostyor.json';
import kraiSet from './krai.json';
import kustSet from './kust.json';
import lesSet from './les.json';
import lunaSet from './luna.json';
import massaSet from './massa.json';
import materialSet from './material.json';
import moreSet from './more.json';
import morozSet from './moroz.json';
import neboSet from './nebo.json';
import oblakoSet from './oblako.json';
import ogonSet from './ogon.json';
import osenSet from './osen.json';
import ostrovSet from './ostrov.json';
import pesokSet from './pesok.json';
import prirodaSet from './priroda.json';
import pyatnoSet from './pyatno.json';
import pylSet from './pyl.json';
import rastvorSet from './rastvor.json';
import rekaSet from './reka.json';
import snegSet from './sneg.json';
import solntseSet from './solntse.json';
import svetSet from './svet.json';
import travaSet from './trava.json';
import tsvetokSet from './tsvetok.json';
import tumanSet from './tuman.json';
import vesnaSet from './vesna.json';
import veterSet from './veter.json';
import volnaSet from './volna.json';
import vozdukhSet from './vozdukh.json';
import zemlyaSet from './zemlya.json';
import zimaSet from './zima.json';
import zvezdaSet from './zvezda.json';

export const natureWeatherNounsFolderId = 'nouns-nature-weather';
const natureWeatherNounsData = [
  ...beregSet,
  ...derevoSet,
  ...dozhdSet,
  ...dymSet,
  ...gazSet,
  ...goraSet,
  ...gryazSet,
  ...kamenSet,
  ...kholodSet,
  ...kostyorSet,
  ...kraiSet,
  ...kustSet,
  ...lesSet,
  ...lunaSet,
  ...massaSet,
  ...materialSet,
  ...moreSet,
  ...morozSet,
  ...neboSet,
  ...oblakoSet,
  ...ogonSet,
  ...osenSet,
  ...ostrovSet,
  ...pesokSet,
  ...prirodaSet,
  ...pyatnoSet,
  ...pylSet,
  ...rastvorSet,
  ...rekaSet,
  ...snegSet,
  ...solntseSet,
  ...svetSet,
  ...travaSet,
  ...tsvetokSet,
  ...tumanSet,
  ...vesnaSet,
  ...veterSet,
  ...volnaSet,
  ...vozdukhSet,
  ...zemlyaSet,
  ...zimaSet,
  ...zvezdaSet,
];

export const natureWeatherNounsFolder = {
  id: natureWeatherNounsFolderId,
  parentId: 'nouns',
  label: 'Nature & Weather',
  badge: 'NATURE',
  description: 'Nature & Weather nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${natureWeatherNounsData.length} noun cards`,
  isFolder: true,
};

export const natureWeatherNounsLessonSets = natureWeatherNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: natureWeatherNounsFolderId }));
