import lyubovSet from './lyubov.json';
import schasteSet from './schaste.json';
import strakhSet from './strakh.json';
import bolSet from './bol.json';
import radostSet from './radost.json';
import udovolstvieSet from './udovolstvie.json';
import sostoyanieSet from './sostoyanie.json';
import boleznSet from './bolezn.json';
import zabolevanieSet from './zabolevanie.json';
import lechenieSet from './lechenie.json';
import zdoroveSet from './zdorove.json';
import sonSet from './son.json';
import zapakhSet from './zapakh.json';
import zvukSet from './zvuk.json';
import tenSet from './ten.json';
import tishinaSet from './tishina.json';
import temnotaSet from './temnota.json';
import slezaSet from './sleza.json';
import ulybkaSet from './ulybka.json';
import smertSet from './smert.json';

export const emotionsNounsFolderId = 'nouns-emotions-states';
const emotionsNounsData = [
  ...lyubovSet,
  ...schasteSet,
  ...strakhSet,
  ...bolSet,
  ...radostSet,
  ...udovolstvieSet,
  ...sostoyanieSet,
  ...boleznSet,
  ...zabolevanieSet,
  ...lechenieSet,
  ...zdoroveSet,
  ...sonSet,
  ...zapakhSet,
  ...zvukSet,
  ...tenSet,
  ...tishinaSet,
  ...temnotaSet,
  ...slezaSet,
  ...ulybkaSet,
  ...smertSet,
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
