// Single source of truth for the JCUKEN physical layout.
// Keyed by `event.code` so input is OS-layout-independent (matches useKeyboard.js).
// Merges what alphabet.json (phonetic/label) and typingTutorLessons.js
// (code/name) each held separately, and adds touch-typing metadata: finger,
// hand, row, and curriculum order. alphabet.json / typingTutorLessons.js are
// left untouched — they are still consumed elsewhere.

// Finger ids (standard ten-finger touch typing). Thumbs handle Space.
export const FINGERS = {
  LPinky: 'LPinky', LRing: 'LRing', LMiddle: 'LMiddle', LIndex: 'LIndex',
  RIndex: 'RIndex', RMiddle: 'RMiddle', RRing: 'RRing', RPinky: 'RPinky',
};

// Row definitions. Each tuple: [code, cyrillic, phonetic, label, finger, shifted?]
// `cyrillic: null` marks a non-letter key (digits / punctuation) — gated out of
// the letter curriculum.
const ROWS = {
  number: [
    ['Backquote', 'ё', 'yo', 'Yo', FINGERS.LPinky],
    ['Digit1', null, '', 'One', FINGERS.LPinky, '!'],
    ['Digit2', null, '', 'Two', FINGERS.LRing, '"'],
    ['Digit3', null, '', 'Three', FINGERS.LMiddle, '№'],
    ['Digit4', null, '', 'Four', FINGERS.LIndex, ';'],
    ['Digit5', null, '', 'Five', FINGERS.LIndex, '%'],
    ['Digit6', null, '', 'Six', FINGERS.RIndex, ':'],
    ['Digit7', null, '', 'Seven', FINGERS.RIndex, '?'],
    ['Digit8', null, '', 'Eight', FINGERS.RMiddle, '*'],
    ['Digit9', null, '', 'Nine', FINGERS.RRing, '('],
    ['Digit0', null, '', 'Zero', FINGERS.RPinky, ')'],
    ['Minus', '-', 'dash', 'Hyphen/Em-dash', FINGERS.RPinky, '—'],
  ],
  top: [
    ['KeyQ', 'й', 'yuh', 'Short I', FINGERS.LPinky],
    ['KeyW', 'ц', 'ts', 'Tse', FINGERS.LRing],
    ['KeyE', 'у', 'oo', 'U', FINGERS.LMiddle],
    ['KeyR', 'к', 'k', 'Ka', FINGERS.LIndex],
    ['KeyT', 'е', 'ye', 'Ye', FINGERS.LIndex],
    ['KeyY', 'н', 'n', 'En', FINGERS.RIndex],
    ['KeyU', 'г', 'g', 'Ge', FINGERS.RIndex],
    ['KeyI', 'ш', 'sh', 'Sha', FINGERS.RMiddle],
    ['KeyO', 'щ', 'shch', 'Shcha', FINGERS.RRing],
    ['KeyP', 'з', 'z', 'Ze', FINGERS.RPinky],
    ['BracketLeft', 'х', 'kh', 'Ha', FINGERS.RPinky],
    ['BracketRight', 'ъ', '', 'Hard Sign', FINGERS.RPinky],
  ],
  home: [
    ['KeyA', 'ф', 'f', 'Ef', FINGERS.LPinky],
    ['KeyS', 'ы', 'yery', 'Yeri', FINGERS.LRing],
    ['KeyD', 'в', 'v', 'Ve', FINGERS.LMiddle],
    ['KeyF', 'а', 'a', 'A', FINGERS.LIndex],
    ['KeyG', 'п', 'p', 'Pe', FINGERS.LIndex],
    ['KeyH', 'р', 'r', 'Er', FINGERS.RIndex],
    ['KeyJ', 'о', 'o', 'O', FINGERS.RIndex],
    ['KeyK', 'л', 'l', 'El', FINGERS.RMiddle],
    ['KeyL', 'д', 'd', 'De', FINGERS.RRing],
    ['Semicolon', 'ж', 'zh', 'Zhe', FINGERS.RPinky],
    ['Quote', 'э', 'e', 'E', FINGERS.RPinky],
  ],
  bottom: [
    ['KeyZ', 'я', 'ya', 'Ya', FINGERS.LPinky],
    ['KeyX', 'ч', 'ch', 'Che', FINGERS.LRing],
    ['KeyC', 'с', 's', 'Es', FINGERS.LMiddle],
    ['KeyV', 'м', 'm', 'Em', FINGERS.LIndex],
    ['KeyB', 'и', 'i', 'I', FINGERS.LIndex],
    ['KeyN', 'т', 't', 'Te', FINGERS.RIndex],
    ['KeyM', 'ь', '', 'Soft Sign', FINGERS.RIndex],
    ['Comma', 'б', 'b', 'Be', FINGERS.RMiddle, '<'],
    ['Period', 'ю', 'yu', 'Yu', FINGERS.RRing, '>'],
    ['Slash', '.', 'dot', 'Period/Comma', FINGERS.RPinky, ','],
  ],
};

const ROW_ORDER = ['number', 'top', 'home', 'bottom'];

// Letters introduced to the learner in this order: home row first (inner index/
// middle fingers outward to pinkies), then top, then bottom. Frequency emphasis
// is handled at drill-generation time, so this stays a clean ergonomic ramp.
const CURRICULUM_LETTERS = [
  // home row — seed first (index + middle), then outward
  'KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyG', 'KeyH', 'KeyS', 'KeyL', 'KeyA', 'Semicolon', 'Quote',
  // top row
  'KeyR', 'KeyU', 'KeyE', 'KeyI', 'KeyW', 'KeyO', 'KeyT', 'KeyY', 'KeyQ', 'KeyP', 'BracketLeft', 'BracketRight',
  // bottom row
  'KeyV', 'KeyN', 'KeyB', 'KeyC', 'KeyM', 'KeyX', 'Comma', 'KeyZ', 'Period',
  // rare
  'Backquote', // ё
];

function buildKeys() {
  const orderIndex = new Map(CURRICULUM_LETTERS.map((code, i) => [code, i]));
  const keys = [];
  for (const rowName of ROW_ORDER) {
    for (const [code, cyrillic, phonetic, label, finger, shifted] of ROWS[rowName]) {
      const isLetter = cyrillic != null && /\p{Script=Cyrillic}/u.test(cyrillic);
      keys.push({
        code,
        cyrillic: cyrillic ?? null,
        phonetic: phonetic ?? '',
        label,
        finger,
        hand: finger.startsWith('L') ? 'left' : 'right',
        row: rowName,
        isLetter,
        shifted: shifted ?? undefined,
        curriculumOrder: orderIndex.has(code) ? orderIndex.get(code) : Infinity,
      });
    }
  }
  return keys;
}

export const KEYS = buildKeys();

export const KEY_BY_CODE = Object.fromEntries(KEYS.map((k) => [k.code, k]));
export const KEY_BY_CYR = Object.fromEntries(
  KEYS.filter((k) => k.cyrillic).map((k) => [k.cyrillic, k]),
);
export const CODE_BY_CYR = Object.fromEntries(
  KEYS.filter((k) => k.cyrillic).map((k) => [k.cyrillic, k.code]),
);
export const LETTER_KEYS = KEYS.filter((k) => k.isLetter);

// Letter codes in introduction order (excludes digits/punctuation).
export const CURRICULUM = [...LETTER_KEYS]
  .sort((a, b) => a.curriculumOrder - b.curriculumOrder)
  .map((k) => k.code);

// Rows of codes for the on-screen keyboard render.
export const KEYBOARD_ROWS = ROW_ORDER.map((rowName) => ROWS[rowName].map((r) => r[0]));

// Adaptive seed: home-row index + middle fingers. Glyphs в а о л — includes the
// vowels а/о so pronounceable pseudo-words are possible from the very first drill.
export const SEED_CODES = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'];

// The full home row, unlocked once the scripted onboarding (фыва / олдж) is done.
export const HOME_ROW_CODES = ROWS.home.map((r) => r[0]);

// Vowels / signs for phonotactic generation.
export const VOWELS = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я']);
export const SIGNS = new Set(['ь', 'ъ']); // never word-initial, never doubled

export function isPunctCode(code) {
  const k = KEY_BY_CODE[code];
  return !k || !k.isLetter;
}
