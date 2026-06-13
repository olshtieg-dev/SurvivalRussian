import { imperfectiveGerundsLessonSets, imperfectiveGerundsFolder } from './imperfective';
import { perfectiveGerundsLessonSets, perfectiveGerundsFolder } from './perfective';

export const gerundsFolderId = 'gerunds';

export const gerundsFolder = {
  id: gerundsFolderId,
  label: "Gerunds",
  badge: "GER",
  description: "Russian gerunds (деепричастия) — verbal adverbs by aspect. Imperfective (-я, simultaneous) and perfective (-в, prior). Indeclinable; same subject as the main verb.",
  missionCountLabel: '2 gerund groups',
  isFolder: true,
};

export const gerundsGroupFolders = [
  imperfectiveGerundsFolder,
  perfectiveGerundsFolder,
];

export const gerundsLessonSets = [
  ...imperfectiveGerundsLessonSets,
  ...perfectiveGerundsLessonSets,
];
