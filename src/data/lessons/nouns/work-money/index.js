import bankSet from './bank.json';
import deloSet from './delo.json';
import dengiSet from './dengi.json';
import desyatokSet from './desyatok.json';
import deyatelnostSet from './deyatelnost.json';
import dollarSet from './dollar.json';
import firmaSet from './firma.json';
import khozyaistvoSet from './khozyaistvo.json';
import kilometrSet from './kilometr.json';
import kompaniyaSet from './kompaniya.json';
import kursSet from './kurs.json';
import metrSet from './metr.json';
import millionSet from './million.json';
import ocheredSet from './ochered.json';
import ochkoSet from './ochko.json';
import prikazSet from './prikaz.json';
import programmaSet from './programma.json';
import proizvodstvoSet from './proizvodstvo.json';
import protsentSet from './protsent.json';
import razmerSet from './razmer.json';
import rublSet from './rubl.json';
import schyotSet from './schyot.json';
import silaSet from './sila.json';
import sluzhbaSet from './sluzhba.json';
import sotnyaSet from './sotnya.json';
import trudSet from './trud.json';
import tsenaSet from './tsena.json';
import tysyachaSet from './tysyacha.json';
import zadachaSet from './zadacha.json';

export const workMoneyNounsFolderId = 'nouns-work-money';
const workMoneyNounsData = [
  ...bankSet,
  ...deloSet,
  ...dengiSet,
  ...desyatokSet,
  ...deyatelnostSet,
  ...dollarSet,
  ...firmaSet,
  ...khozyaistvoSet,
  ...kilometrSet,
  ...kompaniyaSet,
  ...kursSet,
  ...metrSet,
  ...millionSet,
  ...ocheredSet,
  ...ochkoSet,
  ...prikazSet,
  ...programmaSet,
  ...proizvodstvoSet,
  ...protsentSet,
  ...razmerSet,
  ...rublSet,
  ...schyotSet,
  ...silaSet,
  ...sluzhbaSet,
  ...sotnyaSet,
  ...trudSet,
  ...tsenaSet,
  ...tysyachaSet,
  ...zadachaSet,
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
