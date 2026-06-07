import adresSet from './adres.json';
import besedaSet from './beseda.json';
import bukvaSet from './bukva.json';
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
import kontaktSet from './kontakt.json';
import krikSet from './krik.json';
import molchanieSet from './molchanie.json';
import nadpisSet from './nadpis.json';
import nazvanieSet from './nazvanie.json';
import nomerSet from './nomer.json';
import otkrytieSet from './otkrytie.json';
import pesnyaSet from './pesnya.json';
import pismoSet from './pismo.json';
import podrobnostSet from './podrobnost.json';
import povestSet from './povest.json';
import predmetSet from './predmet.json';
import privetSet from './privet.json';
import proizvedenieSet from './proizvedenie.json';
import prosbaSet from './prosba.json';
import radioSet from './radio.json';
import rasskazSet from './rasskaz.json';
import razgovorSet from './razgovor.json';
import rechSet from './rech.json';
import shumSet from './shum.json';
import shutkaSet from './shutka.json';
import shyopotSet from './shyopot.json';
import signalSet from './signal.json';
import skazkaSet from './skazka.json';
import slovoSet from './slovo.json';
import slukhSet from './slukh.json';
import smekhSet from './smekh.json';
import soobshchenieSet from './soobshchenie.json';
import svedenieSet from './svedenie.json';
import tekstSet from './tekst.json';
import telefonSet from './telefon.json';
import tonSet from './ton.json';
import urokSet from './urok.json';
import zapisSet from './zapis.json';
import zayavlenieSet from './zayavlenie.json';
import zhestSet from './zhest.json';
import zhurnalSet from './zhurnal.json';
import znakSet from './znak.json';
import zvonokSet from './zvonok.json';

export const communicationNounsFolderId = 'nouns-communication-media';
const communicationNounsData = [
  ...adresSet,
  ...besedaSet,
  ...bukvaSet,
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
  ...kontaktSet,
  ...krikSet,
  ...molchanieSet,
  ...nadpisSet,
  ...nazvanieSet,
  ...nomerSet,
  ...otkrytieSet,
  ...pesnyaSet,
  ...pismoSet,
  ...podrobnostSet,
  ...povestSet,
  ...predmetSet,
  ...privetSet,
  ...proizvedenieSet,
  ...prosbaSet,
  ...radioSet,
  ...rasskazSet,
  ...razgovorSet,
  ...rechSet,
  ...shumSet,
  ...shutkaSet,
  ...shyopotSet,
  ...signalSet,
  ...skazkaSet,
  ...slovoSet,
  ...slukhSet,
  ...smekhSet,
  ...soobshchenieSet,
  ...svedenieSet,
  ...tekstSet,
  ...telefonSet,
  ...tonSet,
  ...urokSet,
  ...zapisSet,
  ...zayavlenieSet,
  ...zhestSet,
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
