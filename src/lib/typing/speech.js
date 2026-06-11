// Thin, SSR-safe wrapper over the Web Speech API. Mirrors the approach already
// used in TypingTutorPanel.jsx (cancel-then-speak, lang autodetect).

export function speechAvailable() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

function detectLang(text) {
  return /\p{Script=Cyrillic}/u.test(text) ? 'ru-RU' : 'en-US';
}

export function speak(text, { rate = 0.8 } = {}) {
  if (!speechAvailable() || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = detectLang(text);
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export function cancelSpeech() {
  if (speechAvailable()) window.speechSynthesis.cancel();
}
