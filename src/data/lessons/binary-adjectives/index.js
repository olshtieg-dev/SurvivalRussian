import bolshoimalenkiiSet from './bolshoi-malenkii.json';
import bystryimedlennyiSet from './bystryi-medlennyi.json';
import chistyigryaznyiSet from './chistyi-gryaznyi.json';
import khoroshiiplokhoiSet from './khoroshii-plokhoi.json';
import korotkiidlinnyiSet from './korotkii-dlinnyi.json';
import novyistaryiSet from './novyi-staryi.json';
import svetlyityomnyiSet from './svetlyi-tyomnyi.json';
import tyazhelyilyogkiiSet from './tyazhelyi-lyogkii.json';
import tyoplyikholodnyiSet from './tyoplyi-kholodnyi.json';
import vysokiinizkiiSet from './vysokii-nizkii.json';
import dalyokiiblizkiiSet from './dalyokii-blizkii.json';
import polnyipustoiSet from './polnyi-pustoi.json';
import molodoistaryiSet from './molodoi-staryi.json';
import ogromnyikroshechnyiSet from './ogromnyi-kroshechnyi.json';
import zhivoimyortvyiSet from './zhivoi-myortvyi.json';
import chyornyibelyiSet from './chyornyi-belyi.json';
import silnyislabyiSet from './silnyi-slabyi.json';
import prostoislozhnyiSet from './prostoi-slozhnyi.json';
import strannyiobychnyiSet from './strannyi-obychnyi.json';
import dobryizloiSet from './dobryi-zloi.json';
import shirokiiuzkiiSet from './shirokii-uzkii.json';
import krasivyiurodlivyiSet from './krasivyi-urodlivyi.json';
import tolstyitonkiiSet from './tolstyi-tonkii.json';
import chuzhoirodnoiSet from './chuzhoi-rodnoi.json';
import bolnoizdorovyiSet from './bolnoi-zdorovyi.json';

export const binaryAdjectivesFolderId = 'binary-adjectives';
const binaryAdjectivesSetData = [
  ...bolshoimalenkiiSet,
  ...bystryimedlennyiSet,
  ...chistyigryaznyiSet,
  ...khoroshiiplokhoiSet,
  ...korotkiidlinnyiSet,
  ...novyistaryiSet,
  ...svetlyityomnyiSet,
  ...tyazhelyilyogkiiSet,
  ...tyoplyikholodnyiSet,
  ...vysokiinizkiiSet,
  ...dalyokiiblizkiiSet,
  ...polnyipustoiSet,
  ...molodoistaryiSet,
  ...ogromnyikroshechnyiSet,
  ...zhivoimyortvyiSet,
  ...chyornyibelyiSet,
  ...silnyislabyiSet,
  ...prostoislozhnyiSet,
  ...strannyiobychnyiSet,
  ...dobryizloiSet,
  ...shirokiiuzkiiSet,
  ...krasivyiurodlivyiSet,
  ...tolstyitonkiiSet,
  ...chuzhoirodnoiSet,
  ...bolnoizdorovyiSet,
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
