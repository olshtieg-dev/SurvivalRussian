import avtorSet from './avtor.json';
import babaSet from './baba.json';
import boetsSet from './boets.json';
import bogSet from './bog.json';
import chelovechestvoSet from './chelovechestvo.json';
import chlenSet from './chlen.json';
import damaSet from './dama.json';
import devushkaSet from './devushka.json';
import direktorSet from './direktor.json';
import doktorSet from './doktor.json';
import drugSet from './drug.json';
import durakSet from './durak.json';
import generalSet from './general.json';
import geroiSet from './geroi.json';
import gospodinSet from './gospodin.json';
import gostSet from './gost.json';
import grazhdaninSet from './grazhdanin.json';
import inzhenerSet from './inzhener.json';
import kapitanSet from './kapitan.json';
import khozyainSet from './khozyain.json';
import khudozhnikSet from './khudozhnik.json';
import komandirSet from './komandir.json';
import korolSet from './korol.json';
import leitenantSet from './leitenant.json';
import lichnostSet from './lichnost.json';
import lyubimyiSet from './lyubimyi.json';
import maiorSet from './maior.json';
import malchikSet from './malchik.json';
import malchishkaSet from './malchishka.json';
import masterSet from './master.json';
import ministrSet from './ministr.json';
import muzhchinaSet from './muzhchina.json';
import muzhikSet from './muzhik.json';
import nachalnikSet from './nachalnik.json';
import narodSet from './narod.json';
import naselenieSet from './naselenie.json';
import nemetsSet from './nemets.json';
import ofitserSet from './ofitser.json';
import parenSet from './paren.json';
import pisatelSet from './pisatel.json';
import poetSet from './poet.json';
import polkovnikSet from './polkovnik.json';
import predsedatelSet from './predsedatel.json';
import prezidentSet from './prezident.json';
import professorSet from './professor.json';
import soldatSet from './soldat.json';
import sosedSet from './sosed.json';
import starikSet from './starik.json';
import studentSet from './student.json';
import sushchestvoSet from './sushchestvo.json';
import tovarishchSet from './tovarishch.json';
import uchitelSet from './uchitel.json';
import uchyonyiSet from './uchyonyi.json';
import vrachSet from './vrach.json';
import zhenshchinaSet from './zhenshchina.json';
import znakomyiSet from './znakomyi.json';

export const peopleRolesNounsFolderId = 'nouns-people-roles';
const peopleRolesNounsData = [
  ...avtorSet,
  ...babaSet,
  ...boetsSet,
  ...bogSet,
  ...chelovechestvoSet,
  ...chlenSet,
  ...damaSet,
  ...devushkaSet,
  ...direktorSet,
  ...doktorSet,
  ...drugSet,
  ...durakSet,
  ...generalSet,
  ...geroiSet,
  ...gospodinSet,
  ...gostSet,
  ...grazhdaninSet,
  ...inzhenerSet,
  ...kapitanSet,
  ...khozyainSet,
  ...khudozhnikSet,
  ...komandirSet,
  ...korolSet,
  ...leitenantSet,
  ...lichnostSet,
  ...lyubimyiSet,
  ...maiorSet,
  ...malchikSet,
  ...malchishkaSet,
  ...masterSet,
  ...ministrSet,
  ...muzhchinaSet,
  ...muzhikSet,
  ...nachalnikSet,
  ...narodSet,
  ...naselenieSet,
  ...nemetsSet,
  ...ofitserSet,
  ...parenSet,
  ...pisatelSet,
  ...poetSet,
  ...polkovnikSet,
  ...predsedatelSet,
  ...prezidentSet,
  ...professorSet,
  ...soldatSet,
  ...sosedSet,
  ...starikSet,
  ...studentSet,
  ...sushchestvoSet,
  ...tovarishchSet,
  ...uchitelSet,
  ...uchyonyiSet,
  ...vrachSet,
  ...zhenshchinaSet,
  ...znakomyiSet,
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
