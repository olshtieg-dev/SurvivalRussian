'use client';

// Passage Reader — a long-form typing surface for whole paragraphs, book
// passages, and Russian Orthodox prayers. Unlike the single-phrase TypingEngine
// on the main page, this shows a lot of text at once with an interlinear gloss
// (English under each Russian word) so the reader sees the meaning as they go.
//
// Input is captured with a self-contained positional keydown listener (mirrors
// useKeyboard's alphabet.json resolution) rather than the useKeyboard hook,
// because this panel lives inside FeatureDock, which sets a body-level
// keyboardLock while any overlay is open. Punctuation the JCUKEN map can't type
// (;, :, «», …) auto-advances so long passages stay typeable — the learner only
// types letters and spaces.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gauge, RotateCcw, ScrollText } from 'lucide-react';
import alphabetData from '../data/alphabet.json';
import vocabularyData from '../data/vocabulary.json';

// --- Vocabulary lookup (mirrors normalizeVocabularyKey in page.js) ----------

function normalizeVocabularyKey(text) {
  if (typeof text !== 'string') return '';
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const vocabularyLookup = new Map(
  Object.keys(vocabularyData).map((key) => [normalizeVocabularyKey(key), key])
);

function lookupGloss(surface) {
  const norm = normalizeVocabularyKey(surface);
  if (!norm) return '';
  const key = vocabularyLookup.get(norm);
  const entry = key ? vocabularyData[key] : null;
  if (!entry) return '';
  // First sense of a multi-gloss literal keeps the interlinear line compact.
  const raw = entry.literal || entry.natural || '';
  return String(raw).split(/[;,/]/)[0].trim();
}

// --- Positional key resolution (mirrors useKeyboard) ------------------------

const codeToKeyMap = {
  Semicolon: 'Semicolon', Quote: 'Quote', Comma: 'Comma',
  Period: 'Period', Slash: 'Slash', Minus: 'Minus',
  BracketLeft: 'BracketLeft', BracketRight: 'BracketRight',
  Backquote: 'Backquote',
  Digit1: 'Digit1', Digit2: 'Digit2', Digit3: 'Digit3',
  Digit4: 'Digit4', Digit5: 'Digit5', Digit6: 'Digit6', Digit7: 'Digit7',
};

function resolveChar(event) {
  const { code, shiftKey } = event;
  if (code === 'Space') return ' ';
  const lookupKey = code.startsWith('Key')
    ? code.replace('Key', '').toLowerCase()
    : codeToKeyMap[code];
  const mapped = alphabetData[lookupKey];
  if (mapped) {
    return shiftKey ? mapped.shifted || mapped.cyrillic.toUpperCase() : mapped.cyrillic;
  }
  if (event.key?.length === 1) return event.key;
  return null;
}

// --- Typing helpers ---------------------------------------------------------

const IS_LETTER = /\p{L}/u;

// The set of letters the JCUKEN keyboard can actually produce. Anything outside
// it — punctuation plus archaic Church Slavonic glyphs (ѣ, ї, ѡ, combining
// accents…) — auto-advances so the learner only types modern Russian letters.
const TYPEABLE_LETTERS = new Set(
  Object.values(alphabetData)
    .map((entry) => entry?.cyrillic)
    .filter((ch) => typeof ch === 'string' && IS_LETTER.test(ch))
    .map((ch) => ch.toLowerCase())
);

const isTypeable = (ch) => ch === ' ' || TYPEABLE_LETTERS.has(ch.toLowerCase());
const normalizeChar = (value) =>
  typeof value === 'string' ? value.toLocaleLowerCase() : value;

// Advance the caret over any character the keyboard can't type (punctuation and
// archaic glyphs) starting at i.
function skipPunctuation(text, i) {
  let next = i;
  while (next < text.length && !isTypeable(text[next])) next += 1;
  return next;
}

// --- Built-in library -------------------------------------------------------

const PASSAGES = [
  {
    id: 'otche-nash-cs',
    label: 'Отче наш (ц.-сл.)',
    category: 'Prayer',
    text:
      'Отче нашъ, иже еси на небесѣхъ, да святится имя Твое, да приидетъ Царствие Твое, да будетъ воля Твоя, яко на небеси и на земли. Хлѣбъ нашъ насущный даждь намъ днесь, и остави намъ долги наша, якоже и мы оставляемъ должникомъ нашымъ, и не введи насъ во искушение, но избави насъ от лукаваго.',
  },
  {
    id: 'otche-nash',
    label: 'Отче наш (рус.)',
    category: 'Prayer',
    text:
      'Отче наш, сущий на небесах! Да святится имя Твоё; да приидет Царствие Твоё; да будет воля Твоя и на земле, как на небе. Хлеб наш насущный дай нам на сей день; и прости нам долги наши, как и мы прощаем должникам нашим; и не введи нас в искушение, но избавь нас от лукавого.',
  },
  {
    id: 'jesus-prayer',
    label: 'Иисусова молитва',
    category: 'Prayer',
    text: 'Господи Иисусе Христе, Сыне Божий, помилуй мя грешного.',
  },
  {
    id: 'anna-karenina',
    label: 'Анна Каренина',
    category: 'Literature',
    text:
      'Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему. Всё смешалось в доме Облонских.',
  },
  {
    id: 'pushkin',
    label: 'Пушкин',
    category: 'Literature',
    text:
      'Я помню чудное мгновенье: передо мной явилась ты, как мимолётное виденье, как гений чистой красоты.',
  },
];

// --- Interlinear rendering --------------------------------------------------

// Split the passage into word tokens (word + trailing punctuation) with their
// global start offsets, so we can colour each character by typed state and hang
// the English gloss beneath each word.
function tokenize(text) {
  const tokens = [];
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({ text: match[0], start: match.index });
  }
  return tokens;
}

function CharSpan({ char, index, caret, errorIndex }) {
  const isTyped = index < caret;
  const isCurrent = index === caret;
  const isError = index === errorIndex;

  return (
    <span className="relative inline-block">
      <span
        className={
          isTyped
            ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.65)]'
            : isError
              ? 'text-red-500 bg-red-500/10'
              : 'text-slate-200'
        }
      >
        {char}
      </span>
      {isCurrent && (
        <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse" />
      )}
    </span>
  );
}

function WordUnit({ token, caret, errorIndex }) {
  const surface = token.text.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '');
  const gloss = useMemo(() => lookupGloss(surface), [surface]);

  return (
    <span className="inline-flex flex-col items-center align-top mx-[0.35rem] mb-3">
      <span className="text-2xl font-mono tracking-wide leading-tight">
        {token.text.split('').map((char, i) => (
          <CharSpan
            key={i}
            char={char}
            index={token.start + i}
            caret={caret}
            errorIndex={errorIndex}
          />
        ))}
      </span>
      <span className="mt-1 text-[10px] leading-tight text-slate-500 max-w-[10rem] text-center">
        {gloss || ' '}
      </span>
    </span>
  );
}

export default function PassageReader() {
  const [customText, setCustomText] = useState('');
  const [passage, setPassage] = useState(PASSAGES[0]);
  const [caret, setCaret] = useState(() => skipPunctuation(PASSAGES[0].text, 0));
  const [errorIndex, setErrorIndex] = useState(null);

  // Timing for WPM. startTime is stamped on the first correct keystroke;
  // endTime on completion; `now` ticks while typing so the live figure updates.
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [now, setNow] = useState(0);
  const startCaretRef = useRef(0);

  const text = passage?.text || '';
  const tokens = useMemo(() => tokenize(text), [text]);
  const isComplete = caret >= text.length && text.length > 0;
  const progress = text.length ? Math.round((caret / text.length) * 100) : 0;

  // WPM = (chars typed / 5) / minutes elapsed, standard-word convention.
  const clock = endTime ?? Math.max(now, startTime ?? 0);
  const elapsedMs = startTime == null ? 0 : Math.max(0, clock - startTime);
  const charsTyped = Math.max(0, caret - startCaretRef.current);
  const wpm = elapsedMs > 0 ? Math.round(charsTyped / 5 / (elapsedMs / 60000)) : 0;

  const resetTiming = useCallback(() => {
    setStartTime(null);
    setEndTime(null);
    setNow(0);
    startCaretRef.current = 0;
  }, []);

  const loadPassage = useCallback((next) => {
    setPassage(next);
    setCaret(skipPunctuation(next.text, 0));
    setErrorIndex(null);
    resetTiming();
  }, [resetTiming]);

  const restart = useCallback(() => {
    setCaret(skipPunctuation(text, 0));
    setErrorIndex(null);
    resetTiming();
  }, [text, resetTiming]);

  // Tick the live clock only while a run is in progress.
  useEffect(() => {
    if (startTime == null || endTime != null) return undefined;
    const id = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(id);
  }, [startTime, endTime]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      // Let the custom-passage textarea receive normal input.
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (!text || caret >= text.length) return;

      if (event.code === 'Backspace') {
        event.preventDefault();
        setErrorIndex(null);
        setCaret((prev) => {
          let p = prev;
          while (p > 0 && !isTypeable(text[p - 1])) p -= 1; // step back over auto-advanced punctuation
          if (p > 0) p -= 1; // remove one typeable char
          return p;
        });
        return;
      }

      const char = resolveChar(event);
      if (char == null) return;
      event.preventDefault();

      const expected = text[caret];
      const matches =
        char === ' '
          ? expected === ' '
          : IS_LETTER.test(expected) && normalizeChar(char) === normalizeChar(expected);

      if (matches) {
        setErrorIndex(null);
        if (startTime == null) {
          startCaretRef.current = caret;
          setStartTime(performance.now());
        }
        const nextCaret = skipPunctuation(text, caret + 1);
        if (nextCaret >= text.length) setEndTime(performance.now());
        setCaret(nextCaret);
      } else {
        setErrorIndex(caret);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, caret, startTime]);

  return (
    <div className="p-6 space-y-6">
      {/* Passage picker */}
      <div className="flex flex-wrap gap-2">
        {PASSAGES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => loadPassage(item)}
            className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
              passage?.id === item.id
                ? 'border-blue-500/50 bg-blue-600/20 text-blue-200'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span className="mr-2 text-slate-500">{item.category}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Progress + restart */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-green-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-slate-500 tabular-nums">{progress}%</span>
        <div
          title={isComplete ? 'Gross words per minute for the run' : 'Current words per minute'}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 tabular-nums transition-colors ${
            isComplete
              ? 'border-green-500/40 bg-green-500/10 text-green-400'
              : 'border-slate-800 bg-slate-900/60 text-slate-400'
          }`}
        >
          <Gauge size={12} />
          <span className="text-[11px] font-mono font-bold">{wpm}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-70">
            {isComplete ? 'wpm gross' : 'wpm'}
          </span>
        </div>
        <button
          type="button"
          onClick={restart}
          title="Restart passage"
          aria-label="Restart passage"
          className="rounded-lg border border-slate-800 p-2 text-slate-400 transition-colors hover:text-white"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Interlinear typing surface */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 min-h-[220px] max-h-[45vh] overflow-y-auto custom-scrollbar leading-loose">
        {tokens.map((token) => (
          <WordUnit
            key={token.start}
            token={token}
            caret={caret}
            errorIndex={errorIndex}
          />
        ))}
      </div>

      {isComplete && (
        <div className="flex items-center justify-center gap-3 text-green-400">
          <ScrollText size={14} />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            Passage complete
          </span>
        </div>
      )}

      {/* Custom passage */}
      <div className="space-y-3 border-t border-slate-800 pt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Paste your own
        </p>
        <textarea
          value={customText}
          onChange={(event) => setCustomText(event.target.value)}
          placeholder="Paste a paragraph, book passage, or prayer in Russian…"
          rows={3}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
        />
        <button
          type="button"
          disabled={!customText.trim()}
          onClick={() =>
            loadPassage({ id: 'custom', label: 'Custom', category: 'Yours', text: customText.trim() })
          }
          className="rounded-xl border border-blue-500/30 bg-blue-600/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-200 transition-all hover:bg-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Load passage
        </button>
      </div>
    </div>
  );
}
