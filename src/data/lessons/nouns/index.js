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
import { societyStateNounsLessonSets, societyStateNounsFolder } from './society-state';
import { emotionsNounsLessonSets, emotionsNounsFolder } from './emotions-states';
import { abstractMindNounsLessonSets, abstractMindNounsFolder } from './abstract-mind';
import { abstractStructureNounsLessonSets, abstractStructureNounsFolder } from './abstract-structure';
import { abstractEventNounsLessonSets, abstractEventNounsFolder } from './abstract-event';

export const nounsFolderId = 'nouns';

export const nounsFolder = {
  id: nounsFolderId,
  label: 'Nouns',
  badge: 'NN',
  description: 'A noun library organized into semantic families. Each noun gets its own 10-sentence usage card.',
  missionCountLabel: '19 noun groups',
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
  societyStateNounsFolder,
  emotionsNounsFolder,
  abstractMindNounsFolder,
  abstractStructureNounsFolder,
  abstractEventNounsFolder,
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
  ...societyStateNounsLessonSets,
  ...emotionsNounsLessonSets,
  ...abstractMindNounsLessonSets,
  ...abstractStructureNounsLessonSets,
  ...abstractEventNounsLessonSets,
];
