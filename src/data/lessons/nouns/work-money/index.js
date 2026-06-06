import bankSet from './bank.json';
import deloSet from './delo.json';
import dengiSet from './dengi.json';
import desyatokSet from './desyatok.json';
import kilometrSet from './kilometr.json';
import kompaniyaSet from './kompaniya.json';
import metrSet from './metr.json';
import ocheredSet from './ochered.json';
import prikazSet from './prikaz.json';
import rublSet from './rubl.json';
import schyotSet from './schyot.json';
import silaSet from './sila.json';
import sluzhbaSet from './sluzhba.json';
import trudSet from './trud.json';
import tsenaSet from './tsena.json';
import tysyachaSet from './tysyacha.json';

export const workMoneyNounsFolderId = 'nouns-work-money';
const workMoneyNounsData = [
  ...bankSet,
  ...deloSet,
  ...dengiSet,
  ...desyatokSet,
  ...kilometrSet,
  ...kompaniyaSet,
  ...metrSet,
  ...ocheredSet,
  ...prikazSet,
  ...rublSet,
  ...schyotSet,
  ...silaSet,
  ...sluzhbaSet,
  ...trudSet,
  ...tsenaSet,
  ...tysyachaSet,
];

export const workMoneyNounsFolder = {
  id: workMoneyNounsFolderId,
  parentId: 'nouns',
  label: 'Work & Money',
  badge: 'WORK',
  description: 'Work & Money nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${workMoneyNounsData.length} noun cards`,
  isFolder: true,
};

export const workMoneyNounsLessonSets = workMoneyNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: workMoneyNounsFolderId }));
