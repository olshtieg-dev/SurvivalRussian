import takSet from './tak.json';
import prostoSet from './prosto.json';
import vdrugSet from './vdrug.json';
import khoroshoSet from './khorosho.json';
import plokhoSet from './plokho.json';
import vmesteSet from './vmeste.json';
import tochnoSet from './tochno.json';
import voobshcheSet from './voobshche.json';
import deistvitelnoSet from './deistvitelno.json';
import inacheSet from './inache.json';
import kstatiSet from './kstati.json';
import spokoinoSet from './spokoino.json';
import molchaSet from './molcha.json';
import neozhidannoSet from './neozhidanno.json';
import ostorozhnoSet from './ostorozhno.json';
import pravilnoSet from './pravilno.json';
import strannoSet from './stranno.json';
import tikhoSet from './tikho.json';
import yasnoSet from './yasno.json';
import vprochemSet from './vprochem.json';
import prichyomSet from './prichyom.json';
import obyazatelnoSet from './obyazatelno.json';
import ravnoSet from './ravno.json';

export const mannerAdverbsFolderId = 'adverbs-manner';
const mannerAdverbsData = [
  ...takSet,
  ...prostoSet,
  ...vdrugSet,
  ...khoroshoSet,
  ...plokhoSet,
  ...vmesteSet,
  ...tochnoSet,
  ...voobshcheSet,
  ...deistvitelnoSet,
  ...inacheSet,
  ...kstatiSet,
  ...spokoinoSet,
  ...molchaSet,
  ...neozhidannoSet,
  ...ostorozhnoSet,
  ...pravilnoSet,
  ...strannoSet,
  ...tikhoSet,
  ...yasnoSet,
  ...vprochemSet,
  ...prichyomSet,
  ...obyazatelnoSet,
  ...ravnoSet,
];

export const mannerAdverbsFolder = {
  id: mannerAdverbsFolderId,
  parentId: 'adverbs',
  label: 'Adverbs of Manner',
  badge: 'HOW',
  description: 'How an action is done: manner and parenthetical adverbs, each a 10-sentence usage card.',
  missionCountLabel: `${mannerAdverbsData.length} adverb cards`,
  isFolder: true,
};

export const mannerAdverbsLessonSets = mannerAdverbsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: mannerAdverbsFolderId,
}));
