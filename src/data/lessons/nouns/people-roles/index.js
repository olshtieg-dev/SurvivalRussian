import drugSet from './drug.json';
import zhenshchinaSet from './zhenshchina.json';
import tovarishchSet from './tovarishch.json';
import narodSet from './narod.json';
import bogSet from './bog.json';
import starikSet from './starik.json';
import malchikSet from './malchik.json';
import devushkaSet from './devushka.json';
import soldatSet from './soldat.json';
import khozyainSet from './khozyain.json';
import nachalnikSet from './nachalnik.json';
import parenSet from './paren.json';
import muzhchinaSet from './muzhchina.json';
import kapitanSet from './kapitan.json';
import generalSet from './general.json';
import znakomyiSet from './znakomyi.json';
import pisatelSet from './pisatel.json';
import gostSet from './gost.json';
import vrachSet from './vrach.json';
import komandirSet from './komandir.json';
import geroiSet from './geroi.json';
import professorSet from './professor.json';
import gospodinSet from './gospodin.json';
import direktorSet from './direktor.json';
import muzhikSet from './muzhik.json';
import avtorSet from './avtor.json';
import doktorSet from './doktor.json';
import leitenantSet from './leitenant.json';
import poetSet from './poet.json';
import prezidentSet from './prezident.json';
import ofitserSet from './ofitser.json';
import babaSet from './baba.json';
import chlenSet from './chlen.json';
import sosedSet from './sosed.json';
import durakSet from './durak.json';
import lyubimyiSet from './lyubimyi.json';
import korolSet from './korol.json';
import polkovnikSet from './polkovnik.json';
import damaSet from './dama.json';
import uchitelSet from './uchitel.json';
import grazhdaninSet from './grazhdanin.json';
import khudozhnikSet from './khudozhnik.json';
import nemetsSet from './nemets.json';

export const peopleRolesNounsFolderId = 'nouns-people-roles';
const peopleRolesNounsData = [
  ...drugSet,
  ...zhenshchinaSet,
  ...tovarishchSet,
  ...narodSet,
  ...bogSet,
  ...starikSet,
  ...malchikSet,
  ...devushkaSet,
  ...soldatSet,
  ...khozyainSet,
  ...nachalnikSet,
  ...parenSet,
  ...muzhchinaSet,
  ...kapitanSet,
  ...generalSet,
  ...znakomyiSet,
  ...pisatelSet,
  ...gostSet,
  ...vrachSet,
  ...komandirSet,
  ...geroiSet,
  ...professorSet,
  ...gospodinSet,
  ...direktorSet,
  ...muzhikSet,
  ...avtorSet,
  ...doktorSet,
  ...leitenantSet,
  ...poetSet,
  ...prezidentSet,
  ...ofitserSet,
  ...babaSet,
  ...chlenSet,
  ...sosedSet,
  ...durakSet,
  ...lyubimyiSet,
  ...korolSet,
  ...polkovnikSet,
  ...damaSet,
  ...uchitelSet,
  ...grazhdaninSet,
  ...khudozhnikSet,
  ...nemetsSet,
];

export const peopleRolesNounsFolder = {
  id: peopleRolesNounsFolderId,
  parentId: 'nouns',
  label: 'People & Roles',
  badge: 'PEOPLE',
  description: 'People & Roles nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${peopleRolesNounsData.length} noun cards`,
  isFolder: true,
};

export const peopleRolesNounsLessonSets = peopleRolesNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: peopleRolesNounsFolderId }));
