import { householdNounsLessonSets, householdNounsFolder } from './household';
import { bodyPersonNounsLessonSets, bodyPersonNounsFolder } from './body-person';
import { motionLocationNounsLessonSets, motionLocationNounsFolder } from './motion-location';
import { abstractNounsLessonSets, abstractNounsFolder } from './abstract';
import { familyNounsLessonSets, familyNounsFolder } from './family';
import { foodDrinkNounsLessonSets, foodDrinkNounsFolder } from './food-drink';
import { natureWeatherNounsLessonSets, natureWeatherNounsFolder } from './nature-weather';
import { animalsNounsLessonSets, animalsNounsFolder } from './animals';
import { timeUnitsNounsLessonSets, timeUnitsNounsFolder } from './time-units';
import { transportNounsLessonSets, transportNounsFolder } from './transport';
import { workMoneyNounsLessonSets, workMoneyNounsFolder } from './work-money';
import { peopleRolesNounsLessonSets, peopleRolesNounsFolder } from './people-roles';
import { communicationNounsLessonSets, communicationNounsFolder } from './communication-media';
import { educationNounsLessonSets, educationNounsFolder } from './education-science';

export const nounsFolderId = 'nouns';

export const nounsFolder = {
  id: nounsFolderId,
  label: 'Nouns',
  badge: 'NN',
  description: 'A noun library organized into semantic families. Each noun gets its own 10-sentence usage card.',
  missionCountLabel: '14 noun groups',
  isFolder: true,
};

export const nounsGroupFolders = [
  householdNounsFolder,
  bodyPersonNounsFolder,
  motionLocationNounsFolder,
  abstractNounsFolder,
  familyNounsFolder,
  foodDrinkNounsFolder,
  natureWeatherNounsFolder,
  animalsNounsFolder,
  timeUnitsNounsFolder,
  transportNounsFolder,
  workMoneyNounsFolder,
  peopleRolesNounsFolder,
  communicationNounsFolder,
  educationNounsFolder,
];

export const nounsLessonSets = [
  ...householdNounsLessonSets,
  ...bodyPersonNounsLessonSets,
  ...motionLocationNounsLessonSets,
  ...abstractNounsLessonSets,
  ...familyNounsLessonSets,
  ...foodDrinkNounsLessonSets,
  ...natureWeatherNounsLessonSets,
  ...animalsNounsLessonSets,
  ...timeUnitsNounsLessonSets,
  ...transportNounsLessonSets,
  ...workMoneyNounsLessonSets,
  ...peopleRolesNounsLessonSets,
  ...communicationNounsLessonSets,
  ...educationNounsLessonSets,
];
