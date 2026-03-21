const keyPairsByCode = {
  Backquote: { code: 'Backquote', latin: '`', cyrillic: 'ё', name: 'Yo' },
  Digit1: { code: 'Digit1', latin: '1', shifted: '!', name: 'One' },
  Digit2: { code: 'Digit2', latin: '2', shifted: '"', name: 'Two' },
  Digit3: { code: 'Digit3', latin: '3', shifted: '№', name: 'Three' },
  Digit4: { code: 'Digit4', latin: '4', shifted: ';', name: 'Four' },
  Digit5: { code: 'Digit5', latin: '5', shifted: '%', name: 'Five' },
  Digit6: { code: 'Digit6', latin: '6', shifted: ':', name: 'Six' },
  Digit7: { code: 'Digit7', latin: '7', shifted: '?', name: 'Seven' },
  KeyQ: { code: 'KeyQ', latin: 'q', cyrillic: 'й', name: 'Short I' },
  KeyW: { code: 'KeyW', latin: 'w', cyrillic: 'ц', name: 'Tse' },
  KeyE: { code: 'KeyE', latin: 'e', cyrillic: 'у', name: 'U' },
  KeyR: { code: 'KeyR', latin: 'r', cyrillic: 'к', name: 'Ka' },
  KeyT: { code: 'KeyT', latin: 't', cyrillic: 'е', name: 'Ye' },
  KeyY: { code: 'KeyY', latin: 'y', cyrillic: 'н', name: 'En' },
  KeyU: { code: 'KeyU', latin: 'u', cyrillic: 'г', name: 'Ge' },
  KeyI: { code: 'KeyI', latin: 'i', cyrillic: 'ш', name: 'Sha' },
  KeyO: { code: 'KeyO', latin: 'o', cyrillic: 'щ', name: 'Shcha' },
  KeyP: { code: 'KeyP', latin: 'p', cyrillic: 'з', name: 'Ze' },
  BracketLeft: { code: 'BracketLeft', latin: '[', cyrillic: 'х', name: 'Ha' },
  BracketRight: { code: 'BracketRight', latin: ']', cyrillic: 'ъ', name: 'Hard Sign' },
  KeyA: { code: 'KeyA', latin: 'a', cyrillic: 'ф', name: 'Ef' },
  KeyS: { code: 'KeyS', latin: 's', cyrillic: 'ы', name: 'Yeri' },
  KeyD: { code: 'KeyD', latin: 'd', cyrillic: 'в', name: 'Ve' },
  KeyF: { code: 'KeyF', latin: 'f', cyrillic: 'а', name: 'A' },
  KeyG: { code: 'KeyG', latin: 'g', cyrillic: 'п', name: 'Pe' },
  KeyH: { code: 'KeyH', latin: 'h', cyrillic: 'р', name: 'Er' },
  KeyJ: { code: 'KeyJ', latin: 'j', cyrillic: 'о', name: 'O' },
  KeyK: { code: 'KeyK', latin: 'k', cyrillic: 'л', name: 'El' },
  KeyL: { code: 'KeyL', latin: 'l', cyrillic: 'д', name: 'De' },
  Semicolon: { code: 'Semicolon', latin: ';', cyrillic: 'ж', name: 'Zhe' },
  Quote: { code: 'Quote', latin: '\'', cyrillic: 'э', name: 'E' },
  KeyZ: { code: 'KeyZ', latin: 'z', cyrillic: 'я', name: 'Ya' },
  KeyX: { code: 'KeyX', latin: 'x', cyrillic: 'ч', name: 'Che' },
  KeyC: { code: 'KeyC', latin: 'c', cyrillic: 'с', name: 'Es' },
  KeyV: { code: 'KeyV', latin: 'v', cyrillic: 'м', name: 'Em' },
  KeyB: { code: 'KeyB', latin: 'b', cyrillic: 'и', name: 'I' },
  KeyN: { code: 'KeyN', latin: 'n', cyrillic: 'т', name: 'Te' },
  KeyM: { code: 'KeyM', latin: 'm', cyrillic: 'ь', name: 'Soft Sign' },
  Comma: { code: 'Comma', latin: ',', cyrillic: 'б', shifted: '<', name: 'Be' },
  Period: { code: 'Period', latin: '.', cyrillic: 'ю', shifted: '>', name: 'Yu' },
  Slash: { code: 'Slash', latin: '/', cyrillic: '.', shifted: ',', name: 'Period' },
};

function repeatedChunk(pair) {
  return `${pair.latin}${pair.latin} ${pair.cyrillic}${pair.cyrillic}`;
}

function forwardChunk(codes) {
  const latin = codes.map((code) => keyPairsByCode[code].latin).join('');
  const cyrillic = codes.map((code) => keyPairsByCode[code].cyrillic).join('');
  return `${latin} ${cyrillic}`;
}

function reverseChunk(codes) {
  const reversed = [...codes].reverse();
  const latin = reversed.map((code) => keyPairsByCode[code].latin).join('');
  const cyrillic = reversed.map((code) => keyPairsByCode[code].cyrillic).join('');
  return `${latin} ${cyrillic}`;
}

function alternatingChunk(codes) {
  const [first, second] = codes;

  if (!second) {
    return repeatedChunk(keyPairsByCode[first]);
  }

  const left = keyPairsByCode[first];
  const right = keyPairsByCode[second];

  return `${left.latin}${right.latin} ${left.cyrillic}${right.cyrillic} ${right.latin}${left.latin} ${right.cyrillic}${left.cyrillic}`;
}

function buildIntroDrills(codes) {
  const repeated = codes.map((code) => repeatedChunk(keyPairsByCode[code])).join(' ');

  return [
    repeated,
    alternatingChunk(codes),
    forwardChunk(codes),
    reverseChunk(codes),
  ];
}

function normalizeCustomDrills(customDrills = []) {
  return customDrills
    .map((drill) => drill.trim())
    .filter(Boolean);
}

function buildLesson({ id, title, coach, focusCodes, customDrills = [] }) {
  const focus = focusCodes.map((code) => keyPairsByCode[code]);
  const introDrills = buildIntroDrills(focusCodes);
  const extraDrills = normalizeCustomDrills(customDrills);

  return {
    id,
    title,
    coach,
    focusCodes,
    focus,
    badge: focus.map((pair) => `${pair.latin}${pair.cyrillic}`).join(' '),
    introDrills,
    introCount: introDrills.length,
    customDrills: extraDrills,
    drills: [...introDrills, ...extraDrills],
  };
}

function addCharAlias(map, char, code) {
  if (!char) return;
  map[char] = code;
  map[char.toLowerCase?.() || char] = code;
  map[char.toUpperCase?.() || char] = code;
}

const typingTutorLessons = [
  buildLesson({
    id: 'lesson-1',
    title: 'Lesson 1',
    coach: 'Start with the left-hand anchors and bind the physical key to both alphabets.',
    focusCodes: ['KeyA', 'KeyS'],
    // Add any extra raw practice lines here after the generated intro drills.
    customDrills: [
      'as sa фы ыф jkl; олдж',
    ],
  }),
  buildLesson({
    id: 'lesson-2',
    title: 'Lesson 2',
    coach: 'Add the inner home-row keys so the left hand becomes a real cluster.',
    focusCodes: ['KeyD', 'KeyF', 'KeyA', 'KeyS'],
    customDrills: [
      'asdf фыва',
    ],
  }),
  buildLesson({
    id: 'lesson-3',
    title: 'Lesson 3',
    coach: 'Meet the right-hand anchors and mirror the same rhythm on the other side.',
    focusCodes: ['KeyJ', 'KeyK'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-4',
    title: 'Lesson 4',
    coach: 'Finish the right side of the home row, including the semicolon and zhe pair.',
    focusCodes: ['KeyL', 'Semicolon', 'KeyJ', 'KeyK'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-5',
    title: 'Lesson 5',
    coach: 'Bridge the center keys so both hands start crossing the gap together.',
    focusCodes: ['KeyG', 'KeyH', 'KeyF', 'KeyJ'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-6',
    title: 'Lesson 6',
    coach: 'Climb into the left side of the top row with the classic RT pair.',
    focusCodes: ['KeyR', 'KeyT', 'KeyE'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-7',
    title: 'Lesson 7',
    coach: 'Climb into the right side of the top row and keep the same physical memory.',
    focusCodes: ['KeyY', 'KeyU', 'KeyI'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-8',
    title: 'Lesson 8',
    coach: 'Bring in the outer top-row reach and widen the map.',
    focusCodes: ['KeyQ', 'KeyW', 'KeyO', 'KeyP'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-9',
    title: 'Lesson 9',
    coach: 'Drop to the lower left so the bottom row stops feeling foreign.',
    focusCodes: ['KeyZ', 'KeyX', 'KeyC', 'KeyV'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-10',
    title: 'Lesson 10',
    coach: 'Drop to the lower right and add the soft-sign lane.',
    focusCodes: ['KeyB', 'KeyN', 'KeyM'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-11',
    title: 'Lesson 11',
    coach: 'Grab the punctuation edge and make the far reaches less scary.',
    focusCodes: ['Comma', 'Period', 'Semicolon', 'KeyL'],
    customDrills: [''],
  }),
  buildLesson({
    id: 'lesson-12',
    title: 'Lesson 12',
    coach: 'Run a full review lap across the whole board and lock the association in.',
    focusCodes: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
    customDrills: [''],
  }),
];

const charToCode = Object.values(keyPairsByCode).reduce((map, pair) => {
  addCharAlias(map, pair.latin, pair.code);
  addCharAlias(map, pair.cyrillic, pair.code);
  addCharAlias(map, pair.shifted, pair.code);
  return map;
}, {});

export { typingTutorLessons, keyPairsByCode, charToCode };
