import chastSet from './chast.json';
import ryadSet from './ryad.json';
import meraSet from './mera.json';
import chisloSet from './chislo.json';
import paraSet from './para.json';
import polovinaSet from './polovina.json';
import kachestvoSet from './kachestvo.json';
import kolichestvoSet from './kolichestvo.json';
import tipSet from './tip.json';
import urovenSet from './uroven.json';
import vidSet from './vid.json';
import poryadokSet from './poryadok.json';
import chertaSet from './cherta.json';
import sredstvoSet from './sredstvo.json';
import polozhenieSet from './polozhenie.json';
import uslovieSet from './uslovie.json';
import glavaSet from './glava.json';
import planSet from './plan.json';
import rostSet from './rost.json';
import tsvetSet from './tsvet.json';
import praviloSet from './pravilo.json';
import faktSet from './fakt.json';
import povodSet from './povod.json';

export const abstractStructureNounsFolderId = 'nouns-abstract-structure';
const abstractStructureNounsData = [
  ...chastSet,
  ...ryadSet,
  ...meraSet,
  ...chisloSet,
  ...paraSet,
  ...polovinaSet,
  ...kachestvoSet,
  ...kolichestvoSet,
  ...tipSet,
  ...urovenSet,
  ...vidSet,
  ...poryadokSet,
  ...chertaSet,
  ...sredstvoSet,
  ...polozhenieSet,
  ...uslovieSet,
  ...glavaSet,
  ...planSet,
  ...rostSet,
  ...tsvetSet,
  ...praviloSet,
  ...faktSet,
  ...povodSet,
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
