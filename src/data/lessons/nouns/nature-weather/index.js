import beregSet from './bereg.json';
import derevoSet from './derevo.json';
import dozhdSet from './dozhd.json';
import dymSet from './dym.json';
import gazSet from './gaz.json';
import goraSet from './gora.json';
import gryazSet from './gryaz.json';
import kamenSet from './kamen.json';
import kholodSet from './kholod.json';
import korenSet from './koren.json';
import kostyorSet from './kostyor.json';
import kraiSet from './krai.json';
import kustSet from './kust.json';
import lesSet from './les.json';
import luchSet from './luch.json';
import lunaSet from './luna.json';
import lyodSet from './lyod.json';
import massaSet from './massa.json';
import materialSet from './material.json';
import moreSet from './more.json';
import morozSet from './moroz.json';
import neboSet from './nebo.json';
import oblakoSet from './oblako.json';
import ogonSet from './ogon.json';
import okeanSet from './okean.json';
import osenSet from './osen.json';
import ostrovSet from './ostrov.json';
import pesokSet from './pesok.json';
import pogodaSet from './pogoda.json';
import prirodaSet from './priroda.json';
import pyatnoSet from './pyatno.json';
import pylSet from './pyl.json';
import rastvorSet from './rastvor.json';
import rekaSet from './reka.json';
import skalaSet from './skala.json';
import snegSet from './sneg.json';
import solntseSet from './solntse.json';
import svetSet from './svet.json';
import taigaSet from './taiga.json';
import tkanSet from './tkan.json';
import tmaSet from './tma.json';
import travaSet from './trava.json';
import tsvetokSet from './tsvetok.json';
import tumanSet from './tuman.json';
import veshchestvoSet from './veshchestvo.json';
import vesnaSet from './vesna.json';
import veterSet from './veter.json';
import volnaSet from './volna.json';
import vozdukhSet from './vozdukh.json';
import zemlyaSet from './zemlya.json';
import zharSet from './zhar.json';
import zhelezoSet from './zhelezo.json';
import zimaSet from './zima.json';
import zolotoSet from './zoloto.json';
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
  ...korenSet,
  ...kostyorSet,
  ...kraiSet,
  ...kustSet,
  ...lesSet,
  ...luchSet,
  ...lunaSet,
  ...lyodSet,
  ...massaSet,
  ...materialSet,
  ...moreSet,
  ...morozSet,
  ...neboSet,
  ...oblakoSet,
  ...ogonSet,
  ...okeanSet,
  ...osenSet,
  ...ostrovSet,
  ...pesokSet,
  ...pogodaSet,
  ...prirodaSet,
  ...pyatnoSet,
  ...pylSet,
  ...rastvorSet,
  ...rekaSet,
  ...skalaSet,
  ...snegSet,
  ...solntseSet,
  ...svetSet,
  ...taigaSet,
  ...tkanSet,
  ...tmaSet,
  ...travaSet,
  ...tsvetokSet,
  ...tumanSet,
  ...veshchestvoSet,
  ...vesnaSet,
  ...veterSet,
  ...volnaSet,
  ...vozdukhSet,
  ...zemlyaSet,
  ...zharSet,
  ...zhelezoSet,
  ...zimaSet,
  ...zolotoSet,
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
