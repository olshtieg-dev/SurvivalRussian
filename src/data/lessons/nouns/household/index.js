import avtomatSet from './avtomat.json';
import biletSet from './bilet.json';
import divanSet from './divan.json';
import doskaSet from './doska.json';
import dverSet from './dver.json';
import formaSet from './forma.json';
import kameraSet from './kamera.json';
import karmanSet from './karman.json';
import klyuchSet from './klyuch.json';
import knizhkaSet from './knizhka.json';
import kostyumSet from './kostyum.json';
import kresloSet from './kreslo.json';
import krovatSet from './krovat.json';
import krugSet from './krug.json';
import kusokSet from './kusok.json';
import lampaSet from './lampa.json';
import mechSet from './mech.json';
import meshokSet from './meshok.json';
import nozhSet from './nozh.json';
import odezhdaSet from './odezhda.json';
import oknoSet from './okno.json';
import oruzhieSet from './oruzhie.json';
import palatkaSet from './palatka.json';
import pistoletSet from './pistolet.json';
import plateSet from './plate.json';
import polSet from './pol.json';
import postelSet from './postel.json';
import pulyaSet from './pulya.json';
import ruchkaSet from './ruchka.json';
import sapogSet from './sapog.json';
import shkafSet from './shkaf.json';
import sigaretaSet from './sigareta.json';
import stekloSet from './steklo.json';
import stenaSet from './stena.json';
import stolSet from './stol.json';
import stulSet from './stul.json';
import sumkaSet from './sumka.json';
import tochkaSet from './tochka.json';
import trubaSet from './truba.json';
import vorotSet from './vorot.json';
import yashchikSet from './yashchik.json';

export const householdNounsFolderId = 'nouns-household';
const householdNounsData = [
  ...avtomatSet,
  ...biletSet,
  ...divanSet,
  ...doskaSet,
  ...dverSet,
  ...formaSet,
  ...kameraSet,
  ...karmanSet,
  ...klyuchSet,
  ...knizhkaSet,
  ...kostyumSet,
  ...kresloSet,
  ...krovatSet,
  ...krugSet,
  ...kusokSet,
  ...lampaSet,
  ...mechSet,
  ...meshokSet,
  ...nozhSet,
  ...odezhdaSet,
  ...oknoSet,
  ...oruzhieSet,
  ...palatkaSet,
  ...pistoletSet,
  ...plateSet,
  ...polSet,
  ...postelSet,
  ...pulyaSet,
  ...ruchkaSet,
  ...sapogSet,
  ...shkafSet,
  ...sigaretaSet,
  ...stekloSet,
  ...stenaSet,
  ...stolSet,
  ...stulSet,
  ...sumkaSet,
  ...tochkaSet,
  ...trubaSet,
  ...vorotSet,
  ...yashchikSet,
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
