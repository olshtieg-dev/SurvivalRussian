import bokSet from './bok.json';
import borodaSet from './boroda.json';
import brovSet from './brov.json';
import chelovekSet from './chelovek.json';
import dykhanieSet from './dykhanie.json';
import figuraSet from './figura.json';
import glazSet from './glaz.json';
import golosSet from './golos.json';
import golovaSet from './golova.json';
import gorloSet from './gorlo.json';
import grudSet from './grud.json';
import gubaSet from './guba.json';
import khvostSet from './khvost.json';
import kolenoSet from './koleno.json';
import kostSet from './kost.json';
import kozhaSet from './kozha.json';
import krovSet from './krov.json';
import kryloSet from './krylo.json';
import kulakSet from './kulak.json';
import ladonSet from './ladon.json';
import litsoSet from './litso.json';
import lobSet from './lob.json';
import lokotSet from './lokot.json';
import mozgSet from './mozg.json';
import nervSet from './nerv.json';
import nogaSet from './noga.json';
import nosSet from './nos.json';
import paletsSet from './palets.json';
import plechoSet from './plecho.json';
import potSet from './pot.json';
import ranaSet from './rana.json';
import rotSet from './rot.json';
import rukaSet from './ruka.json';
import rukavSet from './rukav.json';
import serdtseSet from './serdtse.json';
import shagSet from './shag.json';
import shchekaSet from './shcheka.json';
import sheyaSet from './sheya.json';
import spinaSet from './spina.json';
import teloSet from './telo.json';
import ukhoSet from './ukho.json';
import volosSet from './volos.json';
import zatylokSet from './zatylok.json';
import zhivotSet from './zhivot.json';
import zrenieSet from './zrenie.json';
import zubSet from './zub.json';

export const bodyPersonNounsFolderId = 'nouns-body-person';
const bodyPersonNounsData = [
  ...bokSet,
  ...borodaSet,
  ...brovSet,
  ...chelovekSet,
  ...dykhanieSet,
  ...figuraSet,
  ...glazSet,
  ...golosSet,
  ...golovaSet,
  ...gorloSet,
  ...grudSet,
  ...gubaSet,
  ...khvostSet,
  ...kolenoSet,
  ...kostSet,
  ...kozhaSet,
  ...krovSet,
  ...kryloSet,
  ...kulakSet,
  ...ladonSet,
  ...litsoSet,
  ...lobSet,
  ...lokotSet,
  ...mozgSet,
  ...nervSet,
  ...nogaSet,
  ...nosSet,
  ...paletsSet,
  ...plechoSet,
  ...potSet,
  ...ranaSet,
  ...rotSet,
  ...rukaSet,
  ...rukavSet,
  ...serdtseSet,
  ...shagSet,
  ...shchekaSet,
  ...sheyaSet,
  ...spinaSet,
  ...teloSet,
  ...ukhoSet,
  ...volosSet,
  ...zatylokSet,
  ...zhivotSet,
  ...zrenieSet,
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
