import armiyaSet from './armiya.json';
import bedaSet from './beda.json';
import bezopasnostSet from './bezopasnost.json';
import boiSet from './boi.json';
import borbaSet from './borba.json';
import chestSet from './chest.json';
import dolzhnostSet from './dolzhnost.json';
import frontSet from './front.json';
import gosudarstvoSet from './gosudarstvo.json';
import grekhSet from './grekh.json';
import gruppaSet from './gruppa.json';
import komandaSet from './komanda.json';
import komissiyaSet from './komissiya.json';
import militsiyaSet from './militsiya.json';
import mirSet from './mir.json';
import nachalstvoSet from './nachalstvo.json';
import obektSet from './obekt.json';
import obshchestvoSet from './obshchestvo.json';
import obstanovkaSet from './obstanovka.json';
import okhotaSet from './okhota.json';
import okhranaSet from './okhrana.json';
import operatsiyaSet from './operatsiya.json';
import organSet from './organ.json';
import organizatsiyaSet from './organizatsiya.json';
import otryadSet from './otryad.json';
import partiyaSet from './partiya.json';
import pobedaSet from './pobeda.json';
import politikaSet from './politika.json';
import politsiyaSet from './politsiya.json';
import polkSet from './polk.json';
import porazhenieSet from './porazhenie.json';
import posyolokSet from './posyolok.json';
import pravitelstvoSet from './pravitelstvo.json';
import prazdnikSet from './prazdnik.json';
import prestuplenieSet from './prestuplenie.json';
import protivnikSet from './protivnik.json';
import revolyutsiyaSet from './revolyutsiya.json';
import rezhimSet from './rezhim.json';
import rotaSet from './rota.json';
import rukovodstvoSet from './rukovodstvo.json';
import slavaSet from './slava.json';
import sovetSet from './sovet.json';
import soyuzSet from './soyuz.json';
import sudSet from './sud.json';
import svobodaSet from './svoboda.json';
import ubiistvoSet from './ubiistvo.json';
import udarSet from './udar.json';
import upravlenieSet from './upravlenie.json';
import vlastSet from './vlast.json';
import voennyiSet from './voennyi.json';
import voinaSet from './voina.json';
import voiskoSet from './voisko.json';
import vragSet from './vrag.json';
import vystrelSet from './vystrel.json';
import vzryvSet from './vzryv.json';
import zakonSet from './zakon.json';
import zashchitaSet from './zashchita.json';
import zhertvaSet from './zhertva.json';

export const societyStateNounsFolderId = 'nouns-society-state';
const societyStateNounsData = [
  ...armiyaSet,
  ...bedaSet,
  ...bezopasnostSet,
  ...boiSet,
  ...borbaSet,
  ...chestSet,
  ...dolzhnostSet,
  ...frontSet,
  ...gosudarstvoSet,
  ...grekhSet,
  ...gruppaSet,
  ...komandaSet,
  ...komissiyaSet,
  ...militsiyaSet,
  ...mirSet,
  ...nachalstvoSet,
  ...obektSet,
  ...obshchestvoSet,
  ...obstanovkaSet,
  ...okhotaSet,
  ...okhranaSet,
  ...operatsiyaSet,
  ...organSet,
  ...organizatsiyaSet,
  ...otryadSet,
  ...partiyaSet,
  ...pobedaSet,
  ...politikaSet,
  ...politsiyaSet,
  ...polkSet,
  ...porazhenieSet,
  ...posyolokSet,
  ...pravitelstvoSet,
  ...prazdnikSet,
  ...prestuplenieSet,
  ...protivnikSet,
  ...revolyutsiyaSet,
  ...rezhimSet,
  ...rotaSet,
  ...rukovodstvoSet,
  ...slavaSet,
  ...sovetSet,
  ...soyuzSet,
  ...sudSet,
  ...svobodaSet,
  ...ubiistvoSet,
  ...udarSet,
  ...upravlenieSet,
  ...vlastSet,
  ...voennyiSet,
  ...voinaSet,
  ...voiskoSet,
  ...vragSet,
  ...vystrelSet,
  ...vzryvSet,
  ...zakonSet,
  ...zashchitaSet,
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
