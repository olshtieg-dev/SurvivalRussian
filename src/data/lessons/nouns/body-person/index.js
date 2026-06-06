import bokSet from './bok.json';
import chelovekSet from './chelovek.json';
import glazSet from './glaz.json';
import golosSet from './golos.json';
import golovaSet from './golova.json';
import grudSet from './grud.json';
import gubaSet from './guba.json';
import kolenoSet from './koleno.json';
import kozhaSet from './kozha.json';
import krovSet from './krov.json';
import kulakSet from './kulak.json';
import ladonSet from './ladon.json';
import litsoSet from './litso.json';
import lobSet from './lob.json';
import mozgSet from './mozg.json';
import nogaSet from './noga.json';
import nosSet from './nos.json';
import paletsSet from './palets.json';
import plechoSet from './plecho.json';
import rotSet from './rot.json';
import rukaSet from './ruka.json';
import serdtseSet from './serdtse.json';
import shagSet from './shag.json';
import shchekaSet from './shcheka.json';
import sheyaSet from './sheya.json';
import spinaSet from './spina.json';
import teloSet from './telo.json';
import ukhoSet from './ukho.json';
import volosSet from './volos.json';
import zhivotSet from './zhivot.json';
import zubSet from './zub.json';

export const bodyPersonNounsFolderId = 'nouns-body-person';
const bodyPersonNounsData = [
  ...bokSet,
  ...chelovekSet,
  ...glazSet,
  ...golosSet,
  ...golovaSet,
  ...grudSet,
  ...gubaSet,
  ...kolenoSet,
  ...kozhaSet,
  ...krovSet,
  ...kulakSet,
  ...ladonSet,
  ...litsoSet,
  ...lobSet,
  ...mozgSet,
  ...nogaSet,
  ...nosSet,
  ...paletsSet,
  ...plechoSet,
  ...rotSet,
  ...rukaSet,
  ...serdtseSet,
  ...shagSet,
  ...shchekaSet,
  ...sheyaSet,
  ...spinaSet,
  ...teloSet,
  ...ukhoSet,
  ...volosSet,
  ...zhivotSet,
  ...zubSet,
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

export const bodyPersonNounsLessonSets = bodyPersonNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: bodyPersonNounsFolderId }));
