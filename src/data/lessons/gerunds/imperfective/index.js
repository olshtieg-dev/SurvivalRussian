import chitayaSet from './chitaya.json';
import delayaSet from './delaya.json';
import govoryaSet from './govorya.json';
import slushayaSet from './slushaya.json';
import gulyayaSet from './gulyaya.json';
import ulybayasSet from './ulybayas.json';
import vozvrashchayasSet from './vozvrashchayas.json';

export const imperfectiveGerundsFolderId = "gerunds-imperfective";

const imperfectiveGerundsData = [
  ...chitayaSet,
  ...delayaSet,
  ...govoryaSet,
  ...slushayaSet,
  ...gulyayaSet,
  ...ulybayasSet,
  ...vozvrashchayasSet,
];

export const imperfectiveGerundsFolder = {
  id: imperfectiveGerundsFolderId,
  parentId: 'gerunds',
  label: "Imperfective Gerunds",
  badge: "WHILE -ING",
  description: "The -я/-ясь gerund (деепричастие): a same-subject action happening WHILE the main verb does. Indeclinable. 10 sentences each.",
  missionCountLabel: `${imperfectiveGerundsData.length} gerund cards`,
  isFolder: true,
};

export const imperfectiveGerundsLessonSets = imperfectiveGerundsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: imperfectiveGerundsFolderId,
}));
