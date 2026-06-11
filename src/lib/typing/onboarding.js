// The classic home-row beginner lessons (фыва / олдж) — kept up front so a
// true beginner gets oriented, but deliberately short: three drills, then the
// learner is "pushed out of the nest" into the adaptive engine with the whole
// home row unlocked.

import { KEY_BY_CODE, HOME_ROW_CODES } from '../../data/jcukenKeymap';

const LEFT_HOME = ['KeyA', 'KeyS', 'KeyD', 'KeyF']; // ф ы в а
const RIGHT_HOME = ['KeyJ', 'KeyK', 'KeyL', 'Semicolon']; // о л д ж

function glyphs(codes) {
  return codes.map((c) => KEY_BY_CODE[c]?.cyrillic).filter(Boolean);
}

function rep(codes) {
  return glyphs(codes)
    .map((g) => g + g + g)
    .join(' ');
}

export const ONBOARDING_DRILLS = [
  {
    id: 'home-left',
    coach: 'Left hand, home row. Rest your fingers on ф ы в а and tap each three times.',
    codes: LEFT_HOME,
    text: `${rep(LEFT_HOME)} ${glyphs(LEFT_HOME).join('')}`,
  },
  {
    id: 'home-right',
    coach: 'Right hand, home row. Rest on о л д ж and tap each three times.',
    codes: RIGHT_HOME,
    text: `${rep(RIGHT_HOME)} ${glyphs(RIGHT_HOME).join('')}`,
  },
  {
    id: 'home-both',
    coach: 'Both hands together. This is the full home row — after this you go adaptive.',
    codes: HOME_ROW_CODES,
    text: 'фыва олдж фыва олдж аоао влвл паор лдлд',
  },
];

// Codes unlocked when onboarding completes — the full home row.
export const POST_ONBOARDING_UNLOCKED = HOME_ROW_CODES;
