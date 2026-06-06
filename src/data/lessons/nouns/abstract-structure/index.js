import chastSet from './chast.json';
import chertaSet from './cherta.json';
import chisloSet from './chislo.json';
import faktSet from './fakt.json';
import glavaSet from './glava.json';
import kachestvoSet from './kachestvo.json';
import kolichestvoSet from './kolichestvo.json';
import kuchaSet from './kucha.json';
import meraSet from './mera.json';
import mnozhestvoSet from './mnozhestvo.json';
import obstoyatelstvoSet from './obstoyatelstvo.json';
import ostatokSet from './ostatok.json';
import paraSet from './para.json';
import planSet from './plan.json';
import polovinaSet from './polovina.json';
import polozhenieSet from './polozhenie.json';
import poryadokSet from './poryadok.json';
import povodSet from './povod.json';
import praviloSet from './pravilo.json';
import punktSet from './punkt.json';
import raschyotSet from './raschyot.json';
import raznitsaSet from './raznitsa.json';
import rostSet from './rost.json';
import ryadSet from './ryad.json';
import shtukaSet from './shtuka.json';
import skorostSet from './skorost.json';
import soderzhanieSet from './soderzhanie.json';
import sravnenieSet from './sravnenie.json';
import sredaSet from './sreda.json';
import sredstvoSet from './sredstvo.json';
import summaSet from './summa.json';
import sushchnostSet from './sushchnost.json';
import tipSet from './tip.json';
import tsvetSet from './tsvet.json';
import urovenSet from './uroven.json';
import uslovieSet from './uslovie.json';
import variantSet from './variant.json';
import vesSet from './ves.json';
import vidSet from './vid.json';

export const abstractStructureNounsFolderId = 'nouns-abstract-structure';
const abstractStructureNounsData = [
  ...chastSet,
  ...chertaSet,
  ...chisloSet,
  ...faktSet,
  ...glavaSet,
  ...kachestvoSet,
  ...kolichestvoSet,
  ...kuchaSet,
  ...meraSet,
  ...mnozhestvoSet,
  ...obstoyatelstvoSet,
  ...ostatokSet,
  ...paraSet,
  ...planSet,
  ...polovinaSet,
  ...polozhenieSet,
  ...poryadokSet,
  ...povodSet,
  ...praviloSet,
  ...punktSet,
  ...raschyotSet,
  ...raznitsaSet,
  ...rostSet,
  ...ryadSet,
  ...shtukaSet,
  ...skorostSet,
  ...soderzhanieSet,
  ...sravnenieSet,
  ...sredaSet,
  ...sredstvoSet,
  ...summaSet,
  ...sushchnostSet,
  ...tipSet,
  ...tsvetSet,
  ...urovenSet,
  ...uslovieSet,
  ...variantSet,
  ...vesSet,
  ...vidSet,
];

export const abstractStructureNounsFolder = {
  id: abstractStructureNounsFolderId,
  parentId: 'nouns',
  label: 'Structure & Quantity',
  badge: 'STRUCT',
  description: 'Structure & Quantity nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${abstractStructureNounsData.length} noun cards`,
  isFolder: true,
};

export const abstractStructureNounsLessonSets = abstractStructureNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: abstractStructureNounsFolderId }));
