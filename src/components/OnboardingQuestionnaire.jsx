'use client';

// Onboarding questionnaire — three required questions (plus an optional goal) that tell
// the curriculum planner where to drop the learner in, so they never have to browse the
// catalogue. Answers are handed to useCurriculum.submitQuestionnaire.

import { useState } from 'react';

const QUESTIONS = [
  {
    key: 'qwertyTouchType',
    prompt: 'Can you touch-type on a QWERTY keyboard without looking?',
    options: [
      { value: 'yes', label: 'Yes, easily' },
      { value: 'some', label: 'Sort of' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'russianType',
    prompt: 'Can you type Russian (ЙЦУКЕН layout)?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'some', label: 'A little' },
      { value: 'no', label: 'Not yet' },
    ],
  },
  {
    key: 'russianLevel',
    prompt: 'How is your Russian?',
    options: [
      { value: 'beginner', label: 'Complete beginner' },
      { value: 'some', label: 'Know some words' },
      { value: 'intermediate', label: 'Intermediate or higher' },
    ],
  },
  {
    key: 'goal',
    prompt: 'What are you here for? (optional)',
    optional: true,
    options: [
      { value: 'survival', label: 'Survival / travel' },
      { value: 'fluency', label: 'General fluency' },
      { value: 'grammar', label: 'Grammar mastery' },
    ],
  },
];

export default function OnboardingQuestionnaire({ onSubmit, onClose, initial = {} }) {
  const [answers, setAnswers] = useState({
    qwertyTouchType: null,
    russianType: null,
    russianLevel: null,
    goal: null,
    ...initial,
  });

  const required = QUESTIONS.filter((q) => !q.optional);
  const complete = required.every((q) => answers[q.key]);

  const pick = (key, value) => setAnswers((a) => ({ ...a, [key]: value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="px-6 py-5 border-b border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Let&apos;s build your plan</p>
          <p className="mt-1 text-sm text-slate-400">
            A few questions so we feed you the right lessons — no need to browse the catalogue.
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {QUESTIONS.map((q) => (
            <div key={q.key}>
              <p className="text-sm font-semibold text-white mb-2">{q.prompt}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const active = answers[q.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => pick(q.key, active && q.optional ? null : opt.value)}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                        active
                          ? 'border-blue-500 bg-blue-600/20 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={!complete}
            onClick={() => complete && onSubmit(answers)}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Build my plan
          </button>
        </div>
      </div>
    </div>
  );
}
