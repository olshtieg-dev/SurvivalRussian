import studentSet from './student.json';
import bratSet from './brat.json';
import drugSet from './drug.json';
import synSet from './syn.json';
import chelovekSet from './chelovek.json';

export const mascAnimateCasesFolderId = 'cases-masc-animate';
const mascAnimateCasesData = [
  ...studentSet,
  ...bratSet,
  ...drugSet,
  ...synSet,
  ...chelovekSet,
];

export const mascAnimateCasesFolder = {
  id: mascAnimateCasesFolderId,
  parentId: 'cases-nouns',
  label: 'Masculine - Animate',
  badge: 'MA',
  description: 'Case-drill cards for masculine - animate nouns — twelve missions each, one sentence per case in singular and plural.',
  missionCountLabel: `${mascAnimateCasesData.length} noun drills`,
  isFolder: true,
};

export const mascAnimateCasesLessonSets = mascAnimateCasesData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: mascAnimateCasesFolderId }));
