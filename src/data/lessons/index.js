import missionLessons from './mission.json';
import slangLessons from './slang.json';
import groceryLessons from './grocery-shopping.json';
import kitchenLessons from './kitchen-cooking.json';
import householdLessons from './household-items.json';

export const lessonSets = [
  {
    id: 'mission',
    label: 'Mission Set',
    badge: 'M',
    description: 'Core travel, survival, and utility drills.',
    missions: missionLessons,
  },
  {
    id: 'slang',
    label: 'Street Set',
    badge: 'SL',
    description: 'Casual greetings and everyday conversation.',
    missions: slangLessons,
  },
  {
    id: 'grocery',
    label: 'Grocery Shopping',
    badge: 'GR',
    description: 'Buying essentials, asking prices, and handling checkout.',
    missions: groceryLessons,
  },
  {
    id: 'kitchen',
    label: 'Kitchen & Cooking',
    badge: 'KT',
    description: 'Ordering drinks, food, and cooking-adjacent vocabulary.',
    missions: kitchenLessons,
  },
  {
    id: 'household',
    label: 'Household Items',
    badge: 'HH',
    description: 'Daily home objects and small errands around the house.',
    missions: householdLessons,
  },
];

export const defaultLessonSetId = lessonSets[0]?.id || 'mission';

export function getLessonSet(lessonSetId) {
  return lessonSets.find((lessonSet) => lessonSet.id === lessonSetId) || lessonSets[0];
}
