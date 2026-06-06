import armiyaSet from './armiya.json';
import bedaSet from './beda.json';
import boiSet from './boi.json';
import borbaSet from './borba.json';
import chestSet from './chest.json';
import frontSet from './front.json';
import gosudarstvoSet from './gosudarstvo.json';
import gruppaSet from './gruppa.json';
import komandaSet from './komanda.json';
import militsiyaSet from './militsiya.json';
import mirSet from './mir.json';
import nachalstvoSet from './nachalstvo.json';
import obshchestvoSet from './obshchestvo.json';
import operatsiyaSet from './operatsiya.json';
import organSet from './organ.json';
import organizatsiyaSet from './organizatsiya.json';
import otryadSet from './otryad.json';
import partiyaSet from './partiya.json';
import pobedaSet from './pobeda.json';
import pravitelstvoSet from './pravitelstvo.json';
import prazdnikSet from './prazdnik.json';
import protivnikSet from './protivnik.json';
import revolyutsiyaSet from './revolyutsiya.json';
import rotaSet from './rota.json';
import slavaSet from './slava.json';
import sovetSet from './sovet.json';
import soyuzSet from './soyuz.json';
import sudSet from './sud.json';
import svobodaSet from './svoboda.json';
import udarSet from './udar.json';
import upravlenieSet from './upravlenie.json';
import vlastSet from './vlast.json';
import voennyiSet from './voennyi.json';
import voinaSet from './voina.json';
import voiskoSet from './voisko.json';
import vragSet from './vrag.json';
import zakonSet from './zakon.json';
import zhertvaSet from './zhertva.json';

export const societyStateNounsFolderId = 'nouns-society-state';
const societyStateNounsData = [
  ...armiyaSet,
  ...bedaSet,
  ...boiSet,
  ...borbaSet,
  ...chestSet,
  ...frontSet,
  ...gosudarstvoSet,
  ...gruppaSet,
  ...komandaSet,
  ...militsiyaSet,
  ...mirSet,
  ...nachalstvoSet,
  ...obshchestvoSet,
  ...operatsiyaSet,
  ...organSet,
  ...organizatsiyaSet,
  ...otryadSet,
  ...partiyaSet,
  ...pobedaSet,
  ...pravitelstvoSet,
  ...prazdnikSet,
  ...protivnikSet,
  ...revolyutsiyaSet,
  ...rotaSet,
  ...slavaSet,
  ...sovetSet,
  ...soyuzSet,
  ...sudSet,
  ...svobodaSet,
  ...udarSet,
  ...upravlenieSet,
  ...vlastSet,
  ...voennyiSet,
  ...voinaSet,
  ...voiskoSet,
  ...vragSet,
  ...zakonSet,
  ...zhertvaSet,
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
