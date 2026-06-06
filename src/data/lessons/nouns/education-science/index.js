import istoriyaSet from './istoriya.json';
import yazykSet from './yazyk.json';
import obrazSet from './obraz.json';
import sistemaSet from './sistema.json';
import naukaSet from './nauka.json';
import romanSet from './roman.json';
import kartinaSet from './kartina.json';
import literaturaSet from './literatura.json';
import opytSet from './opyt.json';
import muzykaSet from './muzyka.json';
import rolSet from './rol.json';
import statyaSet from './statya.json';
import primerSet from './primer.json';
import klassSet from './klass.json';
import igraSet from './igra.json';
import zerkaloSet from './zerkalo.json';

export const educationNounsFolderId = 'nouns-education-science';
const educationNounsData = [
  ...istoriyaSet,
  ...yazykSet,
  ...obrazSet,
  ...sistemaSet,
  ...naukaSet,
  ...romanSet,
  ...kartinaSet,
  ...literaturaSet,
  ...opytSet,
  ...muzykaSet,
  ...rolSet,
  ...statyaSet,
  ...primerSet,
  ...klassSet,
  ...igraSet,
  ...zerkaloSet,
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
