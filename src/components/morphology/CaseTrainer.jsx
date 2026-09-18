'use client';

// Case Meanings module — the "what does the instrumental actually DO?" trainer.
// Two surfaces sharing the same case metadata:
//   • Learn — a card per case: its question, plain-English job, trigger words, and
//     a worked example sentence with the case form highlighted.
//   • Quiz  — recognition drill on the MEANING (not the ending): match a case to
//     its role, or a Russian case-question to its case. Streak-scored like the
//     declension drill.

import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Check, Dumbbell, RotateCcw, Trophy, X } from 'lucide-react';
import { CASES, CASE_COLOR_CLASSES } from '../../data/morphology/cases';
import { CASE_TRIGGER_EXAMPLES } from '../../data/morphology/case-examples';
import Interlinear from './Interlinear';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// One case card. Its trigger words are clickable — picking one swaps the example
// sentence to one built around that preposition (with an interlinear gloss);
// clicking the active trigger again returns to the case's baseline sentence.
function CaseCard({ c }) {
  const color = CASE_COLOR_CLASSES[c.color];
  const [trigger, setTrigger] = useState(null);
  const triggerExamples = CASE_TRIGGER_EXAMPLES[c.key] || {};
  const active = trigger && triggerExamples[trigger];
  const example = active || { ru: c.sentence, en: c.sentenceEn, focus: c.sentenceFocus };

  return (
    <div className={`rounded-2xl border p-5 ${color.border} ${color.bg}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h4 className={`text-lg font-black ${color.text}`}>{c.label}</h4>
        <span className="text-sm italic text-slate-400">{c.question}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{c.usage || c.role}</p>

      {c.triggers.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Trigger words — tap to see one in a sentence
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {c.triggers.map((t) => {
              const isActive = trigger === t;
              const hasExample = Boolean(triggerExamples[t]);
              return (
                <button
                  key={t}
                  type="button"
                  disabled={!hasExample}
                  onClick={() => setTrigger(isActive ? null : t)}
                  className={`rounded-lg border px-2.5 py-1 text-sm transition-all ${
                    isActive
                      ? 'border-white/40 bg-white/10 text-white'
                      : `${color.chip} hover:border-white/30 ${hasExample ? '' : 'opacity-40'}`
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {example.ru && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4">
          <Interlinear sentence={example.ru} highlight={example.focus} highlightClass={color.ending} size="text-xl" />
          <p className="mt-3 border-t border-slate-800/70 pt-2 text-xs italic text-slate-500">{example.en}</p>
        </div>
      )}
    </div>
  );
}

function LearnView() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {CASES.map((c) => (
        <CaseCard key={c.key} c={c} />
      ))}
    </div>
  );
}

// --- Quiz -------------------------------------------------------------------

function buildQuestion() {
  const target = CASES[Math.floor(Math.random() * CASES.length)];
  const others = shuffle(CASES.filter((c) => c.key !== target.key)).slice(0, 3);
  const mode = Math.random() < 0.5 ? 'role' : 'question';

  if (mode === 'role') {
    // Given the case, pick its job.
    const options = shuffle([target, ...others].map((c) => ({ text: c.usage || c.role, correct: c.key === target.key })));
    return {
      mode,
      target,
      promptLabel: 'What is the job of the',
      promptMain: target.label,
      promptSub: target.question,
      options,
    };
  }
  // Given the Russian case-question, pick the case name.
  const options = shuffle([target, ...others].map((c) => ({ text: c.label, correct: c.key === target.key })));
  return {
    mode,
    target,
    promptLabel: 'Which case answers',
    promptMain: target.question,
    promptSub: null,
    options,
  };
}

function QuizView() {
  const [question, setQuestion] = useState(null);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0, best: 0 });

  const next = useCallback(() => {
    setQuestion(buildQuestion());
    setPicked(null);
  }, []);

  useEffect(() => {
    next();
  }, [next]);

  if (!question) return null;

  const answered = picked !== null;
  const color = CASE_COLOR_CLASSES[question.target.color];

  const choose = (option) => {
    if (answered) return;
    setPicked(option);
    setScore((s) => {
      const streak = option.correct ? s.streak + 1 : 0;
      return {
        correct: s.correct + (option.correct ? 1 : 0),
        total: s.total + 1,
        streak,
        best: Math.max(s.best, streak),
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Trophy size={16} className="text-amber-300" />
          <span className="font-black text-white">{score.correct}</span>
          <span className="text-slate-500">/ {score.total} correct</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">
            streak <span className="font-black text-emerald-300">{score.streak}</span>
          </span>
          <span className="text-slate-400">
            best <span className="font-black text-amber-300">{score.best}</span>
          </span>
          <button
            type="button"
            onClick={() => setScore({ correct: 0, total: 0, streak: 0, best: 0 })}
            title="Reset score"
            className="rounded-lg border border-slate-700 p-1.5 text-slate-500 transition-colors hover:text-white"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Prompt */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-center">
        <p className="text-sm text-slate-400">{question.promptLabel}</p>
        <p className="mt-2 text-3xl font-black">
          <span className={color.text}>{question.promptMain}</span>
        </p>
        {question.promptSub && <p className="mt-1 text-sm italic text-slate-500">{question.promptSub}</p>}
        {question.mode === 'role' && <p className="mt-1 text-sm text-slate-400">case?</p>}
      </div>

      {/* Options */}
      <div className={`grid grid-cols-1 gap-3 ${question.mode === 'question' ? 'sm:grid-cols-2' : ''}`}>
        {question.options.map((option) => {
          const isPicked = option === picked;
          let cls = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-600 hover:bg-slate-900/70';
          if (answered && option.correct) cls = 'border-emerald-500/60 bg-emerald-500/15 text-white';
          else if (answered && isPicked) cls = 'border-rose-500/60 bg-rose-500/15 text-white';
          else if (answered) cls = 'border-slate-800 bg-slate-950/40 text-slate-500';
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => choose(option)}
              disabled={answered}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-base font-medium transition-all ${cls}`}
            >
              <span>{option.text}</span>
              {answered && option.correct && <Check size={20} className="shrink-0 text-emerald-300" />}
              {answered && isPicked && !option.correct && <X size={20} className="shrink-0 text-rose-300" />}
            </button>
          );
        })}
      </div>

      {/* Feedback + next */}
      {answered && (
        <div
          className={`rounded-2xl border p-5 ${
            picked.correct ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'
          }`}
        >
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white">
            {picked.correct ? 'Correct' : 'Not quite'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            <span className={`font-black ${color.text}`}>{question.target.label}</span>{' '}
            <span className="italic text-slate-400">({question.target.question})</span> — {question.target.usage || question.target.role}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-violet-500/50 hover:text-white"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default function CaseTrainer() {
  const [mode, setMode] = useState('learn');

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
        {[
          { id: 'learn', label: 'Learn', Icon: BookOpen },
          { id: 'quiz', label: 'Quiz', Icon: Dumbbell },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-[0.2em] transition-all ${
              mode === id
                ? 'bg-violet-500/20 text-violet-200'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {mode === 'learn' ? <LearnView /> : <QuizView />}
    </div>
  );
}
