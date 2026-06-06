import slovoSet from './slovo.json';
import razgovorSet from './razgovor.json';
import knigaSet from './kniga.json';
import pismoSet from './pismo.json';
import imyaSet from './imya.json';
import gazetaSet from './gazeta.json';
import bumagaSet from './bumaga.json';
import nomerSet from './nomer.json';
import telefonSet from './telefon.json';
import dokumentSet from './dokument.json';
import rasskazSet from './rasskaz.json';
import rechSet from './rech.json';
import familiyaSet from './familiya.json';
import nazvanieSet from './nazvanie.json';
import znakSet from './znak.json';
import informatsiyaSet from './informatsiya.json';
import kartaSet from './karta.json';

export const communicationNounsFolderId = 'nouns-communication-media';
const communicationNounsData = [
  ...slovoSet,
  ...razgovorSet,
  ...knigaSet,
  ...pismoSet,
  ...imyaSet,
  ...gazetaSet,
  ...bumagaSet,
  ...nomerSet,
  ...telefonSet,
  ...dokumentSet,
  ...rasskazSet,
  ...rechSet,
  ...familiyaSet,
  ...nazvanieSet,
  ...znakSet,
  ...informatsiyaSet,
  ...kartaSet,
];

export const communicationNounsFolder = {
  id: communicationNounsFolderId,
  parentId: 'nouns',
  label: 'Communication',
  badge: 'COMMS',
  description: 'Communication nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${communicationNounsData.length} noun cards`,
  isFolder: true,
};

export const communicationNounsLessonSets = communicationNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: communicationNounsFolderId }));
