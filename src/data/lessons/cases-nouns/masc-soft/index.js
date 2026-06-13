import slovarSet from './slovar.json';
import muzeySet from './muzey.json';
import gostSet from './gost.json';
import konSet from './kon.json';
import tramvaySet from './tramvay.json';

export const mascSoftCasesFolderId = 'cases-masc-soft';
const mascSoftCasesData = [
  ...slovarSet,
  ...muzeySet,
  ...gostSet,
  ...konSet,
  ...tramvaySet,
];

export const mascSoftCasesFolder = {
  id: mascSoftCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Masculine - Soft and -й',
  badge: 'MS',
  description: 'Case-drill cards for masculine - soft and -й nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${mascSoftCasesData.length} noun drills`,
  isFolder: true,
};

export const mascSoftCasesLessonSets = mascSoftCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: mascSoftCasesFolderId }));
