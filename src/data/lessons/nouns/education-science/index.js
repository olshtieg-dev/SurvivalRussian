import chudoSet from './chudo.json';
import energiyaSet from './energiya.json';
import igraSet from './igra.json';
import istoriyaSet from './istoriya.json';
import kartinaSet from './kartina.json';
import klassSet from './klass.json';
import kulturaSet from './kultura.json';
import literaturaSet from './literatura.json';
import muzykaSet from './muzyka.json';
import naukaSet from './nauka.json';
import obrazSet from './obraz.json';
import obrazovanieSet from './obrazovanie.json';
import opytSet from './opyt.json';
import organizmSet from './organizm.json';
import primerSet from './primer.json';
import rolSet from './rol.json';
import romanSet from './roman.json';
import sistemaSet from './sistema.json';
import statyaSet from './statya.json';
import yazykSet from './yazyk.json';
import zanyatieSet from './zanyatie.json';
import zerkaloSet from './zerkalo.json';
import znanieSet from './znanie.json';

export const educationNounsFolderId = 'nouns-education-science';
const educationNounsData = [
  ...chudoSet,
  ...energiyaSet,
  ...igraSet,
  ...istoriyaSet,
  ...kartinaSet,
  ...klassSet,
  ...kulturaSet,
  ...literaturaSet,
  ...muzykaSet,
  ...naukaSet,
  ...obrazSet,
  ...obrazovanieSet,
  ...opytSet,
  ...organizmSet,
  ...primerSet,
  ...rolSet,
  ...romanSet,
  ...sistemaSet,
  ...statyaSet,
  ...yazykSet,
  ...zanyatieSet,
  ...zerkaloSet,
  ...znanieSet,
];

export const educationNounsFolder = {
  id: educationNounsFolderId,
  parentId: 'nouns',
  label: 'Education & Science',
  badge: 'EDU',
  description: 'Education & Science nouns — each a 10-sentence usage card with case practice.',
  missionCountLabel: `${educationNounsData.length} noun cards`,
  isFolder: true,
};

export const educationNounsLessonSets = educationNounsData.map((set) => ({ ...set, hiddenInMainMenu: true, groupId: educationNounsFolderId }));
