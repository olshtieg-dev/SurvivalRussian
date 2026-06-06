import bolnoizdorovyiSet from './bolnoi-zdorovyi.json';
import bolshoimalenkiiSet from './bolshoi-malenkii.json';
import bystryimedlennyiSet from './bystryi-medlennyi.json';
import chistyigryaznyiSet from './chistyi-gryaznyi.json';
import chuzhoirodnoiSet from './chuzhoi-rodnoi.json';
import chyornyibelyiSet from './chyornyi-belyi.json';
import dalyokiiblizkiiSet from './dalyokii-blizkii.json';
import dobryizloiSet from './dobryi-zloi.json';
import khoroshiiplokhoiSet from './khoroshii-plokhoi.json';
import korotkiidlinnyiSet from './korotkii-dlinnyi.json';
import krasivyiurodlivyiSet from './krasivyi-urodlivyi.json';
import molodoistaryiSet from './molodoi-staryi.json';
import novyistaryiSet from './novyi-staryi.json';
import ogromnyikroshechnyiSet from './ogromnyi-kroshechnyi.json';
import polnyipustoiSet from './polnyi-pustoi.json';
import prostoislozhnyiSet from './prostoi-slozhnyi.json';
import shirokiiuzkiiSet from './shirokii-uzkii.json';
import silnyislabyiSet from './silnyi-slabyi.json';
import strannyiobychnyiSet from './strannyi-obychnyi.json';
import svetlyityomnyiSet from './svetlyi-tyomnyi.json';
import tolstyitonkiiSet from './tolstyi-tonkii.json';
import tyazhelyilyogkiiSet from './tyazhelyi-lyogkii.json';
import tyoplyikholodnyiSet from './tyoplyi-kholodnyi.json';
import vysokiinizkiiSet from './vysokii-nizkii.json';
import zhivoimyortvyiSet from './zhivoi-myortvyi.json';
import glubokiineglubokiiSet from './glubokii-neglubokii.json';
import dolgiikratkiiSet from './dolgii-kratkii.json';
import chastyiredkiiSet from './chastyi-redkii.json';
import tikhiigromkiiSet from './tikhii-gromkii.json';
import ostryitupoiSet from './ostryi-tupoi.json';
import vesyolyigrustnyiSet from './vesyolyi-grustnyi.json';
import sukhoimokryiSet from './sukhoi-mokryi.json';
import pryamoikrivoiSet from './pryamoi-krivoi.json';
import schastlivyineschastnyiSet from './schastlivyi-neschastnyi.json';
import starshiimladshiiSet from './starshii-mladshii.json';
import pravyilevyiSet from './pravyi-levyi.json';
import otkrytyizakrytyiSet from './otkrytyi-zakrytyi.json';
import krupnyimelkiiSet from './krupnyi-melkii.json';
import goryachiikholodnyiSet from './goryachii-kholodnyi.json';

export const binaryAdjectivesFolderId = 'binary-adjectives';
const binaryAdjectivesSetData = [
  ...bolnoizdorovyiSet,
  ...bolshoimalenkiiSet,
  ...bystryimedlennyiSet,
  ...chistyigryaznyiSet,
  ...chuzhoirodnoiSet,
  ...chyornyibelyiSet,
  ...dalyokiiblizkiiSet,
  ...dobryizloiSet,
  ...khoroshiiplokhoiSet,
  ...korotkiidlinnyiSet,
  ...krasivyiurodlivyiSet,
  ...molodoistaryiSet,
  ...novyistaryiSet,
  ...ogromnyikroshechnyiSet,
  ...polnyipustoiSet,
  ...prostoislozhnyiSet,
  ...shirokiiuzkiiSet,
  ...silnyislabyiSet,
  ...strannyiobychnyiSet,
  ...svetlyityomnyiSet,
  ...tolstyitonkiiSet,
  ...tyazhelyilyogkiiSet,
  ...tyoplyikholodnyiSet,
  ...vysokiinizkiiSet,
  ...zhivoimyortvyiSet,
  ...glubokiineglubokiiSet,
  ...dolgiikratkiiSet,
  ...chastyiredkiiSet,
  ...tikhiigromkiiSet,
  ...ostryitupoiSet,
  ...vesyolyigrustnyiSet,
  ...sukhoimokryiSet,
  ...pryamoikrivoiSet,
  ...schastlivyineschastnyiSet,
  ...starshiimladshiiSet,
  ...pravyilevyiSet,
  ...otkrytyizakrytyiSet,
  ...krupnyimelkiiSet,
  ...goryachiikholodnyiSet,
];

export const binaryAdjectivesFolder = {
  id: binaryAdjectivesFolderId,
  label: 'Binary Adjectives',
  badge: 'BA',
  description: 'Oppositional adjective pairs that teach comparison through short practical scenes.',
  missionCountLabel: `${binaryAdjectivesSetData.length} adjective sets`,
  isFolder: true,
};

export const binaryAdjectivesLessonSets = binaryAdjectivesSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: binaryAdjectivesFolderId,
}));
