import golovaSet from './golova.json';
import chelovekSet from './chelovek.json';
import glazSet from './glaz.json';
import nosSet from './nos.json';
import rotSet from './rot.json';
import sheyaSet from './sheya.json';
import grudSet from './grud.json';
import serdtseSet from './serdtse.json';
import rukaSet from './ruka.json';
import nogaSet from './noga.json';

export const bodyPersonNounsFolderId = 'nouns-body-person';
const bodyPersonNounsData = [
  ...golovaSet,
  ...chelovekSet,
  ...glazSet,
  ...nosSet,
  ...rotSet,
  ...sheyaSet,
  ...grudSet,
  ...serdtseSet,
  ...rukaSet,
  ...nogaSet,
];

export const bodyPersonNounsFolder = {
  id: bodyPersonNounsFolderId,
  parentId: 'nouns',
  label: 'Body & Person Nouns',
  badge: 'BODY',
  description: 'Human bodies, people, and everyday person-reference nouns.',
  missionCountLabel: `${bodyPersonNounsData.length} noun cards`,
  isFolder: true,
};

export const bodyPersonNounsLessonSets = bodyPersonNounsData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: bodyPersonNounsFolderId,
}));
