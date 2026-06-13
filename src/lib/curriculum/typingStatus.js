// Bridge from the typing tutor (useTypingProfile, localStorage key below) to the
// curriculum. "Graduated" = the learner has reached the adaptive phase AND has no keys
// left to unlock — i.e. the tutor has walked them through the whole layout. We reuse the
// tutor's own unlock logic (nextCodeToUnlock) so the definition stays in one place.

import { nextCodeToUnlock } from '../typing/mastery';

const TYPING_PROFILE_KEY = 'survival-russian-typing-v1';

export function readTypingGraduated() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(TYPING_PROFILE_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw);
    if (!p || p.phase !== 'adaptive') return false;
    // No more keys to unlock → they've been through the entire keyboard.
    return nextCodeToUnlock(p.unlockedCodes || [], !!p.includePunctuation) == null;
  } catch {
    return false;
  }
}
