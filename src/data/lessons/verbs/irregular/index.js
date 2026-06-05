import bytSet from './byt.json';
import datSet from './dat.json';
import estSet from './est.json';
import idtiSet from './idti.json';
import poitiSet from './poiti.json';
import vyitiSet from './vyiti.json';
import naitiSet from './naiti.json';
import priitiSet from './priiti.json';
import uitiSet from './uiti.json';
import proitiSet from './proiti.json';
import podoitiSet from './podoiti.json';
import voitiSet from './voiti.json';
import sestSet from './sest.json';
import poslatSet from './poslat.json';
import priekhatSet from './priekhat.json';
import ekhatSet from './ekhat.json';

export const irregularVerbFolderId = 'verbs-irregular';
const irregularVerbData = [
  ...bytSet,
  ...datSet,
  ...estSet,
  ...idtiSet,
  ...poitiSet,
  ...vyitiSet,
  ...naitiSet,
  ...priitiSet,
  ...uitiSet,
  ...proitiSet,
  ...podoitiSet,
  ...voitiSet,
  ...sestSet,
  ...poslatSet,
  ...priekhatSet,
  ...ekhatSet,
];

export const irregularVerbFolder = {
  id: irregularVerbFolderId,
  parentId: 'verbs',
  label: 'Irregular Verbs',
  badge: 'IRR',
  description: 'Irregular and high-frequency verbs that need their own dedicated conjugation cards.',
  missionCountLabel: `${irregularVerbData.length} verb cards`,
  isFolder: true,
};

export const irregularVerbSets = irregularVerbData.map((set) => ({
  ...set,
  hiddenInMainMenu: true,
  groupId: irregularVerbFolderId,
}));
