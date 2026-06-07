import bolSet from './bol.json';
import boleznSet from './bolezn.json';
import glupostSet from './glupost.json';
import goreSet from './gore.json';
import krasotaSet from './krasota.json';
import lechenieSet from './lechenie.json';
import lyubovSet from './lyubov.json';
import napryazhenieSet from './napryazhenie.json';
import nastroenieSet from './nastroenie.json';
import obidaSet from './obida.json';
import opasnostSet from './opasnost.json';
import oshchushchenieSet from './oshchushchenie.json';
import otdykhSet from './otdykh.json';
import pokoiSet from './pokoi.json';
import poteryaSet from './poterya.json';
import prisutstvieSet from './prisutstvie.json';
import radostSet from './radost.json';
import schasteSet from './schaste.json';
import simptomSet from './simptom.json';
import slezaSet from './sleza.json';
import smertSet from './smert.json';
import somnenieSet from './somnenie.json';
import sonSet from './son.json';
import sostoyanieSet from './sostoyanie.json';
import sovestSet from './sovest.json';
import sozhalenieSet from './sozhalenie.json';
import strakhSet from './strakh.json';
import strastSet from './strast.json';
import temnotaSet from './temnota.json';
import temperaturaSet from './temperatura.json';
import tenSet from './ten.json';
import tishinaSet from './tishina.json';
import toskaSet from './toska.json';
import trevogaSet from './trevoga.json';
import udivlenieSet from './udivlenie.json';
import udovolstvieSet from './udovolstvie.json';
import ulybkaSet from './ulybka.json';
import uspekhSet from './uspekh.json';
import uzhasSet from './uzhas.json';
import vkusSet from './vkus.json';
import volnenieSet from './volnenie.json';
import vostorgSet from './vostorg.json';
import vpechatlenieSet from './vpechatlenie.json';
import zabolevanieSet from './zabolevanie.json';
import zabotaSet from './zabota.json';
import zapakhSet from './zapakh.json';
import zdoroveSet from './zdorove.json';
import zvukSet from './zvuk.json';

export const emotionsNounsFolderId = 'nouns-emotions-states';
const emotionsNounsData = [
  ...bolSet,
  ...boleznSet,
  ...glupostSet,
  ...goreSet,
  ...krasotaSet,
  ...lechenieSet,
  ...lyubovSet,
  ...napryazhenieSet,
  ...nastroenieSet,
  ...obidaSet,
  ...opasnostSet,
  ...oshchushchenieSet,
  ...otdykhSet,
  ...pokoiSet,
  ...poteryaSet,
  ...prisutstvieSet,
  ...radostSet,
  ...schasteSet,
  ...simptomSet,
  ...slezaSet,
  ...smertSet,
  ...somnenieSet,
  ...sonSet,
  ...sostoyanieSet,
  ...sovestSet,
  ...sozhalenieSet,
  ...strakhSet,
  ...strastSet,
  ...temnotaSet,
  ...temperaturaSet,
  ...tenSet,
  ...tishinaSet,
  ...toskaSet,
  ...trevogaSet,
  ...udivlenieSet,
  ...udovolstvieSet,
  ...ulybkaSet,
  ...uspekhSet,
  ...uzhasSet,
  ...vkusSet,
  ...volnenieSet,
  ...vostorgSet,
  ...vpechatlenieSet,
  ...zabolevanieSet,
  ...zabotaSet,
  ...zapakhSet,
  ...zdoroveSet,
  ...zvukSet,
];

export const emotionsNounsFolder = {
  id: emotionsNounsFolderId,
  parentId: 'nouns',
  label: 'Emotions & States',
  badge: 'EMOTION',
  description: 'Emotions & States nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${emotionsNounsData.length} noun cards`,
  isFolder: true,
};

export const emotionsNounsLessonSets = emotionsNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: emotionsNounsFolderId }));
