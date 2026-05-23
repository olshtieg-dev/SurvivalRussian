import callAndResponseSet from './call-and-response.json';
import casualGreetingsSet from './casual-greetings.json';
import formalGreetingsSet from './formal-greetings.json';
import interestsHobbiesSet from './interests-hobbies.json';
import navigationSet from './navigation.json';
import dailyTasksSet from './daily-tasks.json';
import choresSet from './chores.json';

export const conversationFolderId = 'conversation';
const conversationSetData = [
  ...callAndResponseSet,
  ...casualGreetingsSet,
  ...formalGreetingsSet,
  ...interestsHobbiesSet,
  ...navigationSet,
  ...dailyTasksSet,
  ...choresSet,
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
