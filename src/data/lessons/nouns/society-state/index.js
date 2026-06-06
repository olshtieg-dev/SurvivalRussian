import mirSet from './mir.json';
import voinaSet from './voina.json';
import vlastSet from './vlast.json';
import obshchestvoSet from './obshchestvo.json';
import zakonSet from './zakon.json';
import voennyiSet from './voennyi.json';
import gosudarstvoSet from './gosudarstvo.json';
import partiyaSet from './partiya.json';
import gruppaSet from './gruppa.json';
import armiyaSet from './armiya.json';
import rotaSet from './rota.json';
import vragSet from './vrag.json';
import sovetSet from './sovet.json';
import soyuzSet from './soyuz.json';
import svobodaSet from './svoboda.json';
import sudSet from './sud.json';
import organSet from './organ.json';
import slavaSet from './slava.json';
import pravitelstvoSet from './pravitelstvo.json';
import revolyutsiyaSet from './revolyutsiya.json';
import boiSet from './boi.json';
import borbaSet from './borba.json';
import frontSet from './front.json';
import komandaSet from './komanda.json';
import upravlenieSet from './upravlenie.json';
import udarSet from './udar.json';

export const societyStateNounsFolderId = 'nouns-society-state';
const societyStateNounsData = [
  ...mirSet,
  ...voinaSet,
  ...vlastSet,
  ...obshchestvoSet,
  ...zakonSet,
  ...voennyiSet,
  ...gosudarstvoSet,
  ...partiyaSet,
  ...gruppaSet,
  ...armiyaSet,
  ...rotaSet,
  ...vragSet,
  ...sovetSet,
  ...soyuzSet,
  ...svobodaSet,
  ...sudSet,
  ...organSet,
  ...slavaSet,
  ...pravitelstvoSet,
  ...revolyutsiyaSet,
  ...boiSet,
  ...borbaSet,
  ...frontSet,
  ...komandaSet,
  ...upravlenieSet,
  ...udarSet,
];

export const societyStateNounsFolder = {
  id: societyStateNounsFolderId,
  parentId: 'nouns',
  label: 'Society & State',
  badge: 'STATE',
  description: 'Society & State nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${societyStateNounsData.length} noun cards`,
  isFolder: true,
};

export const societyStateNounsLessonSets = societyStateNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: societyStateNounsFolderId }));
