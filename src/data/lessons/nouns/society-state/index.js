import armiyaSet from './armiya.json';
import batalonSet from './batalon.json';
import bedaSet from './beda.json';
import bezopasnostSet from './bezopasnost.json';
import boiSet from './boi.json';
import borbaSet from './borba.json';
import chestSet from './chest.json';
import diviziyaSet from './diviziya.json';
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
import ordenSet from './orden.json';
import organSet from './organ.json';
import organizatsiyaSet from './organizatsiya.json';
import otryadSet from './otryad.json';
import pamyatnikSet from './pamyatnik.json';
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
import razvedkaSet from './razvedka.json';
import revolyutsiyaSet from './revolyutsiya.json';
import rezhimSet from './rezhim.json';
import rotaSet from './rota.json';
import rukovodstvoSet from './rukovodstvo.json';
import slavaSet from './slava.json';
import sledstvieSet from './sledstvie.json';
import sovetSet from './sovet.json';
import soyuzSet from './soyuz.json';
import sudSet from './sud.json';
import svobodaSet from './svoboda.json';
import ubiistvoSet from './ubiistvo.json';
import udarSet from './udar.json';
import ugrozaSet from './ugroza.json';
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
import zvanieSet from './zvanie.json';

export const societyStateNounsFolderId = 'nouns-society-state';
const societyStateNounsData = [
  ...armiyaSet,
  ...batalonSet,
  ...bedaSet,
  ...bezopasnostSet,
  ...boiSet,
  ...borbaSet,
  ...chestSet,
  ...diviziyaSet,
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
  ...ordenSet,
  ...organSet,
  ...organizatsiyaSet,
  ...otryadSet,
  ...pamyatnikSet,
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
  ...razvedkaSet,
  ...revolyutsiyaSet,
  ...rezhimSet,
  ...rotaSet,
  ...rukovodstvoSet,
  ...slavaSet,
  ...sledstvieSet,
  ...sovetSet,
  ...soyuzSet,
  ...sudSet,
  ...svobodaSet,
  ...ubiistvoSet,
  ...udarSet,
  ...ugrozaSet,
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
  ...zvanieSet,
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
