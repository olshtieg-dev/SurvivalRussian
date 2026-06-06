import bumagaSet from './bumaga.json';
import dokumentSet from './dokument.json';
import familiyaSet from './familiya.json';
import filmSet from './film.json';
import fotografiyaSet from './fotografiya.json';
import frazaSet from './fraza.json';
import gazetaSet from './gazeta.json';
import imyaSet from './imya.json';
import informatsiyaSet from './informatsiya.json';
import kartaSet from './karta.json';
import knigaSet from './kniga.json';
import krikSet from './krik.json';
import nazvanieSet from './nazvanie.json';
import nomerSet from './nomer.json';
import pismoSet from './pismo.json';
import predmetSet from './predmet.json';
import rasskazSet from './rasskaz.json';
import razgovorSet from './razgovor.json';
import rechSet from './rech.json';
import shumSet from './shum.json';
import slovoSet from './slovo.json';
import slukhSet from './slukh.json';
import smekhSet from './smekh.json';
import telefonSet from './telefon.json';
import zhurnalSet from './zhurnal.json';
import znakSet from './znak.json';

export const communicationNounsFolderId = 'nouns-communication-media';
const communicationNounsData = [
  ...bumagaSet,
  ...dokumentSet,
  ...familiyaSet,
  ...filmSet,
  ...fotografiyaSet,
  ...frazaSet,
  ...gazetaSet,
  ...imyaSet,
  ...informatsiyaSet,
  ...kartaSet,
  ...knigaSet,
  ...krikSet,
  ...nazvanieSet,
  ...nomerSet,
  ...pismoSet,
  ...predmetSet,
  ...rasskazSet,
  ...razgovorSet,
  ...rechSet,
  ...shumSet,
  ...slovoSet,
  ...slukhSet,
  ...smekhSet,
  ...telefonSet,
  ...zhurnalSet,
  ...znakSet,
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
