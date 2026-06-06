import avtomatSet from './avtomat.json';
import biletSet from './bilet.json';
import bryukiSet from './bryuki.json';
import chemodanSet from './chemodan.json';
import divanSet from './divan.json';
import doskaSet from './doska.json';
import dverSet from './dver.json';
import ekranSet from './ekran.json';
import fonarSet from './fonar.json';
import formaSet from './forma.json';
import kameraSet from './kamera.json';
import karmanSet from './karman.json';
import kletkaSet from './kletka.json';
import klyuchSet from './klyuch.json';
import knizhkaSet from './knizhka.json';
import koltsoSet from './koltso.json';
import kostyumSet from './kostyum.json';
import kraskaSet from './kraska.json';
import kresloSet from './kreslo.json';
import krestSet from './krest.json';
import krovatSet from './krovat.json';
import krugSet from './krug.json';
import kurtkaSet from './kurtka.json';
import kusokSet from './kusok.json';
import lampaSet from './lampa.json';
import mechSet from './mech.json';
import meshokSet from './meshok.json';
import nozhSet from './nozh.json';
import odeyaloSet from './odeyalo.json';
import odezhdaSet from './odezhda.json';
import oknoSet from './okno.json';
import orudieSet from './orudie.json';
import oruzhieSet from './oruzhie.json';
import pachkaSet from './pachka.json';
import palatkaSet from './palatka.json';
import palkaSet from './palka.json';
import paltoSet from './palto.json';
import pasportSet from './pasport.json';
import pidzhakSet from './pidzhak.json';
import pilaSet from './pila.json';
import pistoletSet from './pistolet.json';
import plashchSet from './plashch.json';
import plateSet from './plate.json';
import platokSet from './platok.json';
import podarokSet from './podarok.json';
import polSet from './pol.json';
import portretSet from './portret.json';
import postelSet from './postel.json';
import poyasSet from './poyas.json';
import pulyaSet from './pulya.json';
import rubashkaSet from './rubashka.json';
import ruchkaSet from './ruchka.json';
import sapogSet from './sapog.json';
import shinelSet from './shinel.json';
import shkafSet from './shkaf.json';
import shlyapaSet from './shlyapa.json';
import shtanySet from './shtany.json';
import sigaretaSet from './sigareta.json';
import spisokSet from './spisok.json';
import stekloSet from './steklo.json';
import stenaSet from './stena.json';
import stenkaSet from './stenka.json';
import stolSet from './stol.json';
import stolbSet from './stolb.json';
import stolikSet from './stolik.json';
import stulSet from './stul.json';
import stvolSet from './stvol.json';
import sumkaSet from './sumka.json';
import tarelkaSet from './tarelka.json';
import televizorSet from './televizor.json';
import tochkaSet from './tochka.json';
import toporSet from './topor.json';
import trubaSet from './truba.json';
import ustroistvoSet from './ustroistvo.json';
import vedroSet from './vedro.json';
import vetkaSet from './vetka.json';
import vorotSet from './vorot.json';
import yashchikSet from './yashchik.json';
import zaborSet from './zabor.json';
import zapiskaSet from './zapiska.json';

export const householdNounsFolderId = 'nouns-household';
const householdNounsData = [
  ...avtomatSet,
  ...biletSet,
  ...bryukiSet,
  ...chemodanSet,
  ...divanSet,
  ...doskaSet,
  ...dverSet,
  ...ekranSet,
  ...fonarSet,
  ...formaSet,
  ...kameraSet,
  ...karmanSet,
  ...kletkaSet,
  ...klyuchSet,
  ...knizhkaSet,
  ...koltsoSet,
  ...kostyumSet,
  ...kraskaSet,
  ...kresloSet,
  ...krestSet,
  ...krovatSet,
  ...krugSet,
  ...kurtkaSet,
  ...kusokSet,
  ...lampaSet,
  ...mechSet,
  ...meshokSet,
  ...nozhSet,
  ...odeyaloSet,
  ...odezhdaSet,
  ...oknoSet,
  ...orudieSet,
  ...oruzhieSet,
  ...pachkaSet,
  ...palatkaSet,
  ...palkaSet,
  ...paltoSet,
  ...pasportSet,
  ...pidzhakSet,
  ...pilaSet,
  ...pistoletSet,
  ...plashchSet,
  ...plateSet,
  ...platokSet,
  ...podarokSet,
  ...polSet,
  ...portretSet,
  ...postelSet,
  ...poyasSet,
  ...pulyaSet,
  ...rubashkaSet,
  ...ruchkaSet,
  ...sapogSet,
  ...shinelSet,
  ...shkafSet,
  ...shlyapaSet,
  ...shtanySet,
  ...sigaretaSet,
  ...spisokSet,
  ...stekloSet,
  ...stenaSet,
  ...stenkaSet,
  ...stolSet,
  ...stolbSet,
  ...stolikSet,
  ...stulSet,
  ...stvolSet,
  ...sumkaSet,
  ...tarelkaSet,
  ...televizorSet,
  ...tochkaSet,
  ...toporSet,
  ...trubaSet,
  ...ustroistvoSet,
  ...vedroSet,
  ...vetkaSet,
  ...vorotSet,
  ...yashchikSet,
  ...zaborSet,
  ...zapiskaSet,
];

export const householdNounsFolder = {
  id: householdNounsFolderId,
  parentId: 'nouns',
  label: 'Household Nouns',
  badge: 'HOME',
  description: 'Furniture, room objects, and everyday house vocabulary.',
  missionCountLabel: `${householdNounsData.length} noun cards`,
  isFolder: true,
};

export const householdNounsLessonSets = householdNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: householdNounsFolderId }));
