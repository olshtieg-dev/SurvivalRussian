import sdelavSet from './sdelav.json';
import prochitavSet from './prochitav.json';
import napisavSet from './napisav.json';
import kupivSet from './kupiv.json';
import uvidevSet from './uvidev.json';
import pridyaSet from './pridya.json';
import vernuvshisSet from './vernuvshis.json';

export const perfectiveGerundsFolderId = "gerunds-perfective";

const perfectiveGerundsData = [
  ...sdelavSet,
  ...prochitavSet,
  ...napisavSet,
  ...kupivSet,
  ...uvidevSet,
  ...pridyaSet,
  ...vernuvshisSet,
];

export const perfectiveGerundsFolder = {
  id: perfectiveGerundsFolderId,
  parentId: 'gerunds',
  label: "Perfective Gerunds",
  badge: "HAVING -ED",
  description: "The -в/-вши/-ши gerund (деепричастие): a same-subject action COMPLETED before the main verb. Indeclinable. 10 sentences each.",
  missionCountLabel: `${perfectiveGerundsData.length} gerund cards`,
  isFolder: true,
};

export const perfectiveGerundsLessonSets = perfectiveGerundsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: perfectiveGerundsFolderId,
}));
