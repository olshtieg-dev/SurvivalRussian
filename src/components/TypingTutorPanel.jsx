'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Languages, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { charToCode, typingTutorLessons } from '../data/typingTutorLessons';

const speechModes = [
  { id: 'silent', label: 'Silent', icon: VolumeX },
  { id: 'letters', label: 'Letters' },
  { id: 'words', label: 'Words' },
];

function detectSpeechLang(text) {
  return /\p{Script=Cyrillic}/u.test(text) ? 'ru-RU' : 'en-US';
}

function getCurrentTokenInfo(drill, caretIndex) {
  const safeIndex = Math.max(0, Math.min(caretIndex, drill.length));
  let start = safeIndex;
  let end = safeIndex;

  while (start > 0 && drill[start - 1] !== ' ') {
    start -= 1;
  }

  while (end < drill.length && drill[end] !== ' ') {
    end += 1;
  }

  return {
    token: drill.slice(start, end),
    prefix: drill.slice(start, safeIndex),
  };
}

export default function TypingTutorPanel() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [drillIndex, setDrillIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [errorIndex, setErrorIndex] = useState(null);
  const [speechMode, setSpeechMode] = useState('letters');
  const [completedLessons, setCompletedLessons] = useState([]);
  const autoAdvanceTimeoutRef = useRef(null);
  const drillViewportRef = useRef(null);
  const currentCharRef = useRef(null);

  const currentLesson = typingTutorLessons[lessonIndex];
  const currentDrill = currentLesson.drills[drillIndex];
  const isMainLessonDrill = drillIndex >= currentLesson.introCount;
  const hasMainLessonDrills = currentLesson.customDrills.length > 0;
  const completionRatio = useMemo(
    () => (currentDrill ? typedText.length / currentDrill.length : 0),
    [currentDrill, typedText.length]
  );

  const clearAdvanceTimeout = useCallback(() => {
    if (autoAdvanceTimeoutRef.current) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  }, []);

  const speakSnippet = useCallback((snippet) => {
    if (!snippet || speechMode === 'silent') return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(snippet);
    utterance.lang = detectSpeechLang(snippet);
    utterance.rate = speechMode === 'letters' ? 0.72 : 0.84;
    window.speechSynthesis.speak(utterance);
  }, [speechMode]);

  const speakForProgress = useCallback((nextValue, latestChar) => {
    if (speechMode === 'silent') return;

    if (speechMode === 'letters') {
      if (latestChar !== ' ') {
        speakSnippet(latestChar);
      }
      return;
    }

    if (latestChar === ' ') return;

    const { prefix } = getCurrentTokenInfo(currentDrill, nextValue.length);
    speakSnippet(prefix);
  }, [currentDrill, speakSnippet, speechMode]);

  const replayCurrentCue = useCallback(() => {
    if (speechMode === 'silent') return;

    if (speechMode === 'letters') {
      const nextChar = currentDrill[typedText.length];

      if (nextChar && nextChar !== ' ') {
        speakSnippet(nextChar);
        return;
      }

      const previousChar = typedText.slice(-1);
      if (previousChar && previousChar !== ' ') {
        speakSnippet(previousChar);
      }
      return;
    }

    const activeIndex = currentDrill[typedText.length] === ' ' ? typedText.length : typedText.length + 1;
    const { token, prefix } = getCurrentTokenInfo(currentDrill, activeIndex);
    speakSnippet(prefix || token);
  }, [currentDrill, speakSnippet, speechMode, typedText]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const viewport = drillViewportRef.current;
    const currentChar = currentCharRef.current;

    if (!viewport || !currentChar) return;

    const viewportTop = viewport.scrollTop;
    const viewportBottom = viewportTop + viewport.clientHeight;
    const charTop = currentChar.offsetTop;
    const charBottom = charTop + currentChar.offsetHeight;
    const padding = 18;

    if (charTop < viewportTop + padding) {
      viewport.scrollTo({
        top: Math.max(0, charTop - padding),
        behavior: 'smooth',
      });
      return;
    }

    if (charBottom > viewportBottom - padding) {
      viewport.scrollTo({
        top: charBottom - viewport.clientHeight + padding,
        behavior: 'smooth',
      });
    }
  }, [typedText, currentDrill]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (!currentDrill) return;

      if (event.code === 'Backspace') {
        event.preventDefault();
        clearAdvanceTimeout();
        setTypedText((previous) => previous.slice(0, -1));
        setErrorIndex(null);
        return;
      }

      const expectedChar = currentDrill[typedText.length];
      if (!expectedChar) return;

      if (expectedChar === ' ') {
        if (event.code === 'Space') {
          event.preventDefault();
          setTypedText((previous) => previous + ' ');
          setErrorIndex(null);
        } else {
          setErrorIndex(typedText.length);
        }
        return;
      }

      const expectedCode = charToCode[expectedChar];
      const physicalMatch = expectedCode && event.code === expectedCode;
      const characterMatch = event.key?.toLowerCase() === expectedChar.toLowerCase();

      if (physicalMatch || characterMatch) {
        event.preventDefault();
        const nextValue = typedText + expectedChar;
        setTypedText(nextValue);
        setErrorIndex(null);
        speakForProgress(nextValue, expectedChar);

        if (nextValue === currentDrill) {
          clearAdvanceTimeout();
          autoAdvanceTimeoutRef.current = window.setTimeout(() => {
            const isLastDrill = drillIndex === currentLesson.drills.length - 1;

            if (isLastDrill) {
              setCompletedLessons((previous) => (
                previous.includes(currentLesson.id) ? previous : [...previous, currentLesson.id]
              ));
              setDrillIndex(currentLesson.customDrills.length > 0 ? currentLesson.introCount : 0);
              setTypedText('');
              setErrorIndex(null);
              return;
            }

            setDrillIndex((previous) => previous + 1);
            setTypedText('');
            setErrorIndex(null);
          }, 450);
        }
      } else {
        setErrorIndex(typedText.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearAdvanceTimeout();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    clearAdvanceTimeout,
    currentDrill,
    currentLesson.customDrills.length,
    currentLesson.drills.length,
    currentLesson.id,
    currentLesson.introCount,
    drillIndex,
    speakForProgress,
    typedText,
  ]);

  const selectLesson = (index) => {
    clearAdvanceTimeout();
    setLessonIndex(index);
    setDrillIndex(0);
    setTypedText('');
    setErrorIndex(null);
  };

  const resetDrill = () => {
    clearAdvanceTimeout();
    setTypedText('');
    setErrorIndex(null);
    replayCurrentCue();
  };

  const jumpToCustom = () => {
    if (!hasMainLessonDrills) return;
    clearAdvanceTimeout();
    setDrillIndex(currentLesson.introCount);
    setTypedText('');
    setErrorIndex(null);
  };

  const jumpToIntro = () => {
    clearAdvanceTimeout();
    setDrillIndex(0);
    setTypedText('');
    setErrorIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">
              Physical Key Tutor
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              This tutor scores the physical key, so QWERTY and Russian layout both work at the same time while you build the mapping.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Assumption: you already know how to touch type in QWERTY or another layout. This teaches position mapping, not first-time typing mechanics. We personally recommend `keybr.com`.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 p-1">
            <Languages size={14} className="ml-2 text-slate-500" />
            {speechModes.map((mode) => {
              const Icon = mode.icon;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSpeechMode(mode.id)}
                  title={`${mode.label} speech mode`}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
                    speechMode === mode.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {Icon ? <Icon size={12} /> : null}
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {currentLesson.title}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              {currentLesson.coach}
            </p>
          </div>

          <div className="flex gap-2">
            {hasMainLessonDrills ? (
              <button
                type="button"
                onClick={isMainLessonDrill ? jumpToIntro : jumpToCustom}
                className="flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300 transition-all hover:border-amber-400 hover:text-amber-200"
              >
                {isMainLessonDrill ? 'Back to Intro' : 'Jump to Main Lesson'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={replayCurrentCue}
              disabled={speechMode === 'silent'}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300 transition-all hover:border-blue-500 hover:text-white disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:text-slate-300"
            >
              <Volume2 size={14} />
              Replay
            </button>
            <button
              type="button"
              onClick={resetDrill}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300 transition-all hover:border-slate-500 hover:text-white"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {currentLesson.focus.map((pair) => (
            <div
              key={pair.code}
              className="rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300"
            >
              <span className="font-black text-white">{pair.latin}</span>
              <span className="mx-2 text-slate-600">/</span>
              <span className="font-black text-blue-300">{pair.cyrillic}</span>
              <span className="ml-2 text-slate-500">{pair.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-500">
                Drill {drillIndex + 1} of {currentLesson.drills.length}
              </p>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                isMainLessonDrill
                  ? 'border-amber-500/25 bg-amber-500/10 text-amber-300'
                  : 'border-blue-500/25 bg-blue-500/10 text-blue-300'
              }`}>
                {isMainLessonDrill ? 'Main Lesson' : 'Intro Drill'}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
              {Math.round(completionRatio * 100)}% matched
            </p>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-150"
              style={{ width: `${completionRatio * 100}%` }}
            />
          </div>

          <div
            ref={drillViewportRef}
            className="mt-6 max-h-[8.5rem] overflow-y-auto pr-2 custom-scrollbar"
          >
            <div className="break-words font-mono text-3xl leading-relaxed tracking-[0.18em]">
            {Array.from(currentDrill).map((char, index) => {
              const isTyped = index < typedText.length;
              const isCurrent = index === typedText.length;
              const isError = index === errorIndex;

              return (
                <span
                  key={`${char}-${index}`}
                  ref={isCurrent ? currentCharRef : null}
                  className="relative inline-block"
                >
                  <span
                    className={`transition-all duration-100 ${
                      isTyped
                        ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                        : isError
                          ? 'text-red-400 bg-red-500/10'
                          : 'text-slate-500'
                    }`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                  {isCurrent ? (
                    <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-blue-500 animate-pulse" />
                  ) : null}
                </span>
              );
            })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>English or Russian layout both count here.</span>
            <span>The tutor key lookup is global, not limited to the lesson focus list.</span>
            <span>Letters mode speaks one key at a time.</span>
            <span>Words mode only speaks the active word fragment.</span>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Lesson Ladder
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Twelve generous steps. Pick any lesson, and the typing window stays pinned above.
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
            {completedLessons.length} / {typingTutorLessons.length} complete
          </p>
        </div>

        <div className="mt-5 max-h-[24rem] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {typingTutorLessons.map((lesson, index) => {
              const isActive = index === lessonIndex;
              const isComplete = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => selectLesson(index)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-600/15 shadow-[0_0_22px_rgba(37,99,235,0.18)]'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white">
                      {lesson.title}
                    </p>
                    {isComplete ? <CheckCircle2 size={14} className="text-emerald-400" /> : null}
                  </div>
                  <p className="mt-2 text-xs font-mono text-blue-300">
                    {lesson.badge}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    {lesson.coach}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
