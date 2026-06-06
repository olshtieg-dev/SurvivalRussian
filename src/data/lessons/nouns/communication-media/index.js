import adresSet from './adres.json';
import besedaSet from './beseda.json';
import bumagaSet from './bumaga.json';
import dokumentSet from './dokument.json';
import ekhoSet from './ekho.json';
import familiyaSet from './familiya.json';
import filmSet from './film.json';
import fotografiyaSet from './fotografiya.json';
import frazaSet from './fraza.json';
import gazetaSet from './gazeta.json';
import imyaSet from './imya.json';
import informatsiyaSet from './informatsiya.json';
import kartaSet from './karta.json';
import kinoSet from './kino.json';
import knigaSet from './kniga.json';
import krikSet from './krik.json';
import nazvanieSet from './nazvanie.json';
import nomerSet from './nomer.json';
import pesnyaSet from './pesnya.json';
import pismoSet from './pismo.json';
import predmetSet from './predmet.json';
import rasskazSet from './rasskaz.json';
import razgovorSet from './razgovor.json';
import rechSet from './rech.json';
import shumSet from './shum.json';
import shutkaSet from './shutka.json';
import slovoSet from './slovo.json';
import slukhSet from './slukh.json';
import smekhSet from './smekh.json';
import tekstSet from './tekst.json';
import telefonSet from './telefon.json';
import tonSet from './ton.json';
import urokSet from './urok.json';
import zhurnalSet from './zhurnal.json';
import znakSet from './znak.json';
import zvonokSet from './zvonok.json';

export const communicationNounsFolderId = 'nouns-communication-media';
const communicationNounsData = [
  ...adresSet,
  ...besedaSet,
  ...bumagaSet,
  ...dokumentSet,
  ...ekhoSet,
  ...familiyaSet,
  ...filmSet,
  ...fotografiyaSet,
  ...frazaSet,
  ...gazetaSet,
  ...imyaSet,
  ...informatsiyaSet,
  ...kartaSet,
  ...kinoSet,
  ...knigaSet,
  ...krikSet,
  ...nazvanieSet,
  ...nomerSet,
  ...pesnyaSet,
  ...pismoSet,
  ...predmetSet,
  ...rasskazSet,
  ...razgovorSet,
  ...rechSet,
  ...shumSet,
  ...shutkaSet,
  ...slovoSet,
  ...slukhSet,
  ...smekhSet,
  ...tekstSet,
  ...telefonSet,
  ...tonSet,
  ...urokSet,
  ...zhurnalSet,
  ...znakSet,
  ...zvonokSet,
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
