import callAndResponseSet from './call-and-response.json';
import casualGreetingsSet from './casual-greetings.json';
import formalGreetingsSet from './formal-greetings.json';
import interestsHobbiesSet from './interests-hobbies.json';
import navigationSet from './navigation.json';
import dailyTasksSet from './daily-tasks.json';
import choresSet from './chores.json';
import shoppingMoneySet from './shopping-money.json';
import restaurantFoodSet from './restaurant-food.json';
import phoneMessagingSet from './phone-messaging.json';
import weatherSmalltalkSet from './weather-smalltalk.json';
import healthDoctorSet from './health-doctor.json';
import travelTransportSet from './travel-transport.json';
import hotelLodgingSet from './hotel-lodging.json';
import emergenciesHelpSet from './emergencies-help.json';
import makingPlansSet from './making-plans.json';
import apologiesPolitenessSet from './apologies-politeness.json';
import workOfficeSet from './work-office.json';
import bankPostSet from './bank-post.json';

export const conversationFolderId = 'conversation';
const conversationSetData = [
  ...callAndResponseSet,
  ...casualGreetingsSet,
  ...formalGreetingsSet,
  ...interestsHobbiesSet,
  ...navigationSet,
  ...dailyTasksSet,
  ...choresSet,
  ...shoppingMoneySet,
  ...restaurantFoodSet,
  ...phoneMessagingSet,
  ...weatherSmalltalkSet,
  ...healthDoctorSet,
  ...travelTransportSet,
  ...hotelLodgingSet,
  ...emergenciesHelpSet,
  ...makingPlansSet,
  ...apologiesPolitenessSet,
  ...workOfficeSet,
  ...bankPostSet,
];

export const conversationFolder = {
  id: conversationFolderId,
  label: 'Conversation & Daily Life',
  badge: 'CV',
  description: 'Greeting, reply, navigation, and everyday task cards for short practical exchanges.',
  missionCountLabel: `${conversationSetData.length} conversation cards`,
  isFolder: true,
};

export const conversationLessonSets = conversationSetData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: conversationFolderId,
}));

export default conversationLessonSets;
