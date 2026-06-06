import chasSet from './chas.json';
import denSet from './den.json';
import godSet from './god.json';
import letoSet from './leto.json';
import mesyatsSet from './mesyats.json';
import minutaSet from './minuta.json';
import nedelyaSet from './nedelya.json';
import nochSet from './noch.json';
import sekundaSet from './sekunda.json';
import sutkiSet from './sutki.json';
import utroSet from './utro.json';
import vecherSet from './vecher.json';
import vekSet from './vek.json';
import vozrastSet from './vozrast.json';

export const timeUnitsNounsFolderId = 'nouns-time-units';
const timeUnitsNounsData = [
  ...chasSet,
  ...denSet,
  ...godSet,
  ...letoSet,
  ...mesyatsSet,
  ...minutaSet,
  ...nedelyaSet,
  ...nochSet,
  ...sekundaSet,
  ...sutkiSet,
  ...utroSet,
  ...vecherSet,
  ...vekSet,
  ...vozrastSet,
];

export const timeUnitsNounsFolder = {
  id: timeUnitsNounsFolderId,
  parentId: 'nouns',
  label: 'Time',
  badge: 'TIME',
  description: 'Time nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${timeUnitsNounsData.length} noun cards`,
  isFolder: true,
};

export const timeUnitsNounsLessonSets = timeUnitsNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: timeUnitsNounsFolderId }));
