import beregSet from './bereg.json';
import derevoSet from './derevo.json';
import dozhdSet from './dozhd.json';
import dymSet from './dym.json';
import goraSet from './gora.json';
import kamenSet from './kamen.json';
import kraiSet from './krai.json';
import kustSet from './kust.json';
import lesSet from './les.json';
import massaSet from './massa.json';
import materialSet from './material.json';
import moreSet from './more.json';
import neboSet from './nebo.json';
import ogonSet from './ogon.json';
import ostrovSet from './ostrov.json';
import prirodaSet from './priroda.json';
import pylSet from './pyl.json';
import rekaSet from './reka.json';
import snegSet from './sneg.json';
import solntseSet from './solntse.json';
import svetSet from './svet.json';
import travaSet from './trava.json';
import tsvetokSet from './tsvetok.json';
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
  ...goraSet,
  ...kamenSet,
  ...kraiSet,
  ...kustSet,
  ...lesSet,
  ...massaSet,
  ...materialSet,
  ...moreSet,
  ...neboSet,
  ...ogonSet,
  ...ostrovSet,
  ...prirodaSet,
  ...pylSet,
  ...rekaSet,
  ...snegSet,
  ...solntseSet,
  ...svetSet,
  ...travaSet,
  ...tsvetokSet,
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
