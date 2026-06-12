'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Gamepad2,
  Keyboard,
  Layers3,
  ListTree,
  Mic,
  Sparkles,
  X,
} from 'lucide-react';

const guideSteps = [
  {
    icon: Layers3,
    label: 'Lesson sets',
    description:
      'Pick a set from the chooser at the top of this rail. Lessons are frequency-ordered, so you meet the most common Russian words first.',
  },
  {
    icon: Keyboard,
    label: 'Type the line',
    description:
      'A real Russian sentence shows in the center. Type it exactly, letter by letter. Input is positional, so it works on any keyboard layout.',
  },
  {
    icon: BookOpen,
    label: 'Meaning cards',
    description:
      'As your cursor reaches each word, the card above the typing surface shows its translation, part of speech, gender, and case.',
  },
  {
    icon: ListTree,
    label: 'Sentence breakdown',
    description:
      'Below the line, a structural analysis explains how the sentence is built — token by token — so the grammar clicks, not just the words.',
  },
  {
    icon: Mic,
    label: 'Voice & pronunciation',
    description:
      'Switch audio between model, echo, or silent. Tap the mic to record yourself and compare your pronunciation against the target.',
  },
  {
    icon: Sparkles,
    label: 'Phrase Lab (AI)',
    description:
      'Open the Phrase Lab to paste or compose your own Russian and turn it into a custom typing drill on the spot.',
  },
  {
    icon: Gamepad2,
    label: 'Morphology, chat & arcade',
    description:
      'Drill grammar in the Morphology Lab, practice live in the chatroom, or take a break with the built-in card game.',
  },
];

export default function SidebarQuickGuide({ isVisible, onDismiss }) {
  const [step, setStep] = useState(0);

  if (!isVisible) return null;

  const total = guideSteps.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const { icon: Icon, label, description } = guideSteps[step];

  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const goNext = () => {
    if (isLast) {
      onDismiss();
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  return (
    <div className="green-glow-pulse mx-2 rounded-2xl border bg-blue-500/10 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-300">
            Quick Guide
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
            {step + 1} / {total}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg border border-slate-700 p-1 text-slate-400 transition-colors hover:text-white"
          aria-label="Dismiss quick guide"
        >
          <X size={14} />
        </button>
      </div>

      {/* Current element */}
      <div className="mt-4 min-h-[7.5rem] rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-blue-300" />
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
            {label}
          </p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{description}</p>
      </div>

      {/* Progress dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {guideSteps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setStep(index)}
            aria-label={`Go to ${item.label}`}
            className={`h-1.5 rounded-full transition-all ${
              index === step ? 'w-4 bg-blue-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Nav */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            isFirst
              ? 'cursor-not-allowed border-slate-900 text-slate-700'
              : 'border-slate-800 text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          <ArrowLeft size={13} />
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          className="flex items-center gap-1.5 rounded-xl border border-blue-400/40 bg-blue-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-[0.99]"
        >
          {isLast ? (
            <>
              <Check size={13} />
              Got it
            </>
          ) : (
            <>
              Next
              <ArrowRight size={13} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
