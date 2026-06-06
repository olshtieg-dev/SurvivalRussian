import chastSet from './chast.json';
import chertaSet from './cherta.json';
import chisloSet from './chislo.json';
import faktSet from './fakt.json';
import glavaSet from './glava.json';
import kachestvoSet from './kachestvo.json';
import kolichestvoSet from './kolichestvo.json';
import meraSet from './mera.json';
import obstoyatelstvoSet from './obstoyatelstvo.json';
import paraSet from './para.json';
import planSet from './plan.json';
import polovinaSet from './polovina.json';
import polozhenieSet from './polozhenie.json';
import poryadokSet from './poryadok.json';
import povodSet from './povod.json';
import praviloSet from './pravilo.json';
import rostSet from './rost.json';
import ryadSet from './ryad.json';
import skorostSet from './skorost.json';
import sredstvoSet from './sredstvo.json';
import tipSet from './tip.json';
import tsvetSet from './tsvet.json';
import urovenSet from './uroven.json';
import uslovieSet from './uslovie.json';
import variantSet from './variant.json';
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
  ...meraSet,
  ...obstoyatelstvoSet,
  ...paraSet,
  ...planSet,
  ...polovinaSet,
  ...polozhenieSet,
  ...poryadokSet,
  ...povodSet,
  ...praviloSet,
  ...rostSet,
  ...ryadSet,
  ...skorostSet,
  ...sredstvoSet,
  ...tipSet,
  ...tsvetSet,
  ...urovenSet,
  ...uslovieSet,
  ...variantSet,
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
