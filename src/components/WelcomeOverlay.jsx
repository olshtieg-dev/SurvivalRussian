'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BrainCircuit,
  Gamepad2,
  Keyboard,
  Layers3,
  Mic,
  Play,
  Sparkles,
  Type,
} from 'lucide-react';

// --- Step content -----------------------------------------------------------

const learningLoop = [
  {
    icon: Keyboard,
    label: 'Read / Write',
    description: 'See Cyrillic, type it exactly, and lock in symbol recall plus muscle memory.',
  },
  {
    icon: AudioLines,
    label: 'Listen / Speak',
    description: 'Hear the target, say it aloud, and get instant phonetic feedback.',
  },
  {
    icon: BrainCircuit,
    label: 'See / Think',
    description: 'Attach each word to meaning, image, and grammar so it becomes usable language.',
  },
];

const lessonFlow = [
  {
    icon: Type,
    title: 'A real sentence appears',
    body: 'Every drill is a short, natural Russian sentence — not isolated words. You type it out exactly as shown, letter by letter, with live character feedback.',
  },
  {
    icon: Keyboard,
    title: 'Type on any keyboard',
    body: 'Input is positional, so it works the same on QWERTY, Dvorak, or a JCUKEN layout. Press where the Russian letter lives — no OS keyboard switching required.',
  },
  {
    icon: BrainCircuit,
    title: 'Meaning unlocks as you go',
    body: 'As your cursor reaches each word, a card shows its translation, part of speech, gender, and case. A full breakdown explains how the sentence is built.',
  },
];

const toolkit = [
  {
    icon: Layers3,
    label: 'Frequency-ordered lessons',
    description: 'Thousands of words across nouns, verbs, adjectives, and adverbs — sorted so you meet the most common Russian first.',
  },
  {
    icon: Mic,
    label: 'Voice & pronunciation',
    description: 'Hear native-style audio in model, echo, or silent mode. Tap the mic to record yourself and compare against the target.',
  },
  {
    icon: Sparkles,
    label: 'Phrase Lab (AI)',
    description: 'Paste or compose your own Russian and turn it into a custom typing drill on the fly.',
  },
  {
    icon: Gamepad2,
    label: 'Chatroom & arcade',
    description: 'Practice live with others, or take a break with the built-in card game when you need to breathe.',
  },
];

// --- Live typing demo -------------------------------------------------------

const demoSentences = [
  { ru: 'Маша поёт и танцует.', en: 'Masha sings and dances.' },
  { ru: 'Я люблю горячий чай.', en: 'I love hot tea.' },
  { ru: 'Где находится вокзал?', en: 'Where is the station?' },
  { ru: 'Сегодня очень холодно.', en: 'It is very cold today.' },
];

const TYPE_SPEED = 90; // ms per character
const SPACE_PAUSE = 70; // extra ms after a space
const HOLD_COMPLETE = 1900; // ms to admire the finished line before clearing

function TypingDemoCard() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);

  const current = demoSentences[index];
  const full = current.ru.length;
  const isComplete = typed >= full;

  useEffect(() => {
    if (!isComplete) {
      const lastChar = current.ru[typed - 1];
      const delay = TYPE_SPEED + (lastChar === ' ' ? SPACE_PAUSE : 0);
      const timer = setTimeout(() => setTyped((n) => n + 1), delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTyped(0);
      setIndex((i) => (i + 1) % demoSentences.length);
    }, HOLD_COMPLETE);
    return () => clearTimeout(timer);
  }, [typed, isComplete, current.ru]);

  return (
    <div className="green-glow-pulse mx-auto mt-8 max-w-md rounded-2xl border bg-slate-900/70 p-5 text-left">
      <p className="font-mono text-lg leading-relaxed">
        <span className="text-emerald-400">{current.ru.slice(0, typed)}</span>
        <span
          className={`mx-px inline-block h-[1.05em] w-0.5 translate-y-[0.18em] bg-emerald-400 ${
            isComplete ? 'caret-blink' : ''
          }`}
        />
        <span className="text-slate-600">{current.ru.slice(typed)}</span>
      </p>
      <p
        className={`mt-2 text-sm text-slate-400 transition-opacity duration-500 ${
          isComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {current.en}
      </p>
    </div>
  );
}

// --- Reusable shells --------------------------------------------------------

function StepBadge({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-blue-300">
      <Icon size={12} />
      {children}
    </div>
  );
}

function Steps({ steps }) {
  // Welcome / hero
  const Welcome = (
    <div className="text-center">
      <div className="flex justify-center">
        <StepBadge icon={Sparkles}>Multimodal Russian</StepBadge>
      </div>
      <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-black uppercase tracking-[0.06em] text-white sm:text-5xl">
        Read it. Type it. Hear it. Say it.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
        Most apps drill one channel at a time. Here, every lesson is a short, real
        Russian sentence you <span className="font-semibold text-white">type, hear, speak, and understand</span> together —
        so the alphabet, vocabulary, pronunciation, and grammar all stick at once.
      </p>
      <TypingDemoCard />
    </div>
  );

  // The learning loop
  const Loop = (
    <div>
      <div className="flex justify-center">
        <StepBadge icon={BrainCircuit}>The learning loop</StepBadge>
      </div>
      <h2 className="mx-auto mt-5 max-w-xl text-center text-3xl font-black uppercase tracking-[0.05em] text-white sm:text-4xl">
        Six skills, one sentence
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-slate-300 sm:text-base">
        Each drill trains recognition, motor memory, pronunciation, meaning, and
        structure at the same time. That overlap is what makes it stick.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {learningLoop.map(({ icon: Icon, label, description }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40"
          >
            <Icon size={18} className="text-blue-400" />
            <h3 className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-white">{label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // How a lesson works
  const Flow = (
    <div>
      <div className="flex justify-center">
        <StepBadge icon={Type}>How a lesson works</StepBadge>
      </div>
      <h2 className="mx-auto mt-5 max-w-xl text-center text-3xl font-black uppercase tracking-[0.05em] text-white sm:text-4xl">
        Type the line, learn the line
      </h2>
      <div className="mt-8 flex flex-col gap-4">
        {lessonFlow.map(({ icon: Icon, title, body }, index) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-black text-blue-300">
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Icon size={15} className="text-blue-400" />
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">{title}</h3>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // What's inside
  const Toolkit = (
    <div>
      <div className="flex justify-center">
        <StepBadge icon={Layers3}>What&apos;s inside</StepBadge>
      </div>
      <h2 className="mx-auto mt-5 max-w-xl text-center text-3xl font-black uppercase tracking-[0.05em] text-white sm:text-4xl">
        More than a typing drill
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {toolkit.map(({ icon: Icon, label, description }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40"
          >
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-blue-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white">{label}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Plans + start
  const Plans = (
    <div className="text-center">
      <div className="flex justify-center">
        <StepBadge icon={Play}>Ready when you are</StepBadge>
      </div>
      <h2 className="mx-auto mt-5 max-w-xl text-3xl font-black uppercase tracking-[0.05em] text-white sm:text-4xl">
        Start free, today
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
        Hit start and the left taskbar opens with the lesson chooser, voice modes,
        mic control, and bonus tools — so you can begin in seconds.
      </p>
      <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">Free</p>
          <p className="mt-1 text-sm font-semibold text-white">Free with ads</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            The full typing trainer, lessons, audio, and browser-based pronunciation
            coaching. Ads help keep hosting afloat.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Premium</p>
          <p className="mt-1 text-sm font-semibold text-white">Coming soon</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Richer AI speech analysis powered by modern Google speech-and-language
            tooling — the heavier features that cost real money to run.
          </p>
        </div>
      </div>
    </div>
  );

  return [Welcome, Loop, Flow, Toolkit, Plans][steps];
}

// --- Overlay ----------------------------------------------------------------

const STEP_COUNT = 5;

export default function WelcomeOverlay({ onStart }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEP_COUNT - 1;
  const isFirst = step === 0;

  const goNext = () => {
    if (isLast) {
      onStart();
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/92 backdrop-blur-md">
      <div className="relative min-h-screen px-6 py-10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_35%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-slate-800 bg-slate-950/80 p-7 shadow-[0_0_60px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-10">
            {/* Top row: step counter + skip */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Step {step + 1} / {STEP_COUNT}
              </p>
              {!isLast && (
                <button
                  type="button"
                  onClick={onStart}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 transition-colors hover:text-slate-300"
                >
                  Skip
                </button>
              )}
            </div>

            {/* Step body */}
            <div className="mt-7 min-h-[22rem] sm:min-h-[24rem]">
              <Steps steps={step} />
            </div>

            {/* Progress dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: STEP_COUNT }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setStep(index)}
                  aria-label={`Go to step ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === step ? 'w-6 bg-blue-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Nav row */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={isFirst}
                className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-xs font-black uppercase tracking-[0.25em] transition-all ${
                  isFirst
                    ? 'cursor-not-allowed border-slate-900 text-slate-700'
                    : 'border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <ArrowLeft size={15} />
                Back
              </button>

              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-3 rounded-2xl border border-blue-400/40 bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] active:scale-[0.99]"
              >
                {isLast ? (
                  <>
                    <Play size={15} fill="currentColor" />
                    Start / Старт
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
