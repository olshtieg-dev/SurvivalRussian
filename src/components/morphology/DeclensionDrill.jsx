'use client';

// Wildcards module — a declension drill built on the same engine as the Trees
// explorer. A random curated noun is thrown at you in a random case + number;
// pick the right form from four candidates (all drawn from that noun's own
// paradigm, so you have to actually tell the cases apart). Tracks a streak.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, RotateCcw, Trophy, X } from 'lucide-react';
import { NOUN_BANK } from '../../data/morphology/decliner';
import { CASES, CASE_BY_KEY, CASE_COLOR_CLASSES } from '../../data/morphology/cases';

const NUMBERS = [
  { key: 'sg', label: 'singular' },
  { key: 'pl', label: 'plural' },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function buildQuestion() {
  const noun = NOUN_BANK[Math.floor(Math.random() * NOUN_BANK.length)];
  const caseKey = CASES[Math.floor(Math.random() * CASES.length)].key;
  const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)].key;
  const answer = noun.paradigm[number][caseKey];

  // Distractors: other distinct forms from the same noun's full paradigm.
  const pool = new Set();
  ['sg', 'pl'].forEach((num) =>
    CASES.forEach((c) => {
      const f = noun.paradigm[num][c.key];
      if (f && f !== answer) pool.add(f);
    })
  );
  const distractors = shuffle([...pool]).slice(0, 3);
  const options = shuffle([answer, ...distractors]);

  return { noun, caseKey, number, answer, options };
}

export default function DeclensionDrill() {
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

  const answered = picked !== null;
  const caseInfo = question ? CASE_BY_KEY[question.caseKey] : null;
  const color = caseInfo ? CASE_COLOR_CLASSES[caseInfo.color] : null;

  const choose = (option) => {
    if (answered || !question) return;
    setPicked(option);
    const isCorrect = option === question.answer;
    setScore((s) => {
      const streak = isCorrect ? s.streak + 1 : 0;
      return {
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
        streak,
        best: Math.max(s.best, streak),
      };
    });
  };

  const numberLabel = useMemo(
    () => (question ? NUMBERS.find((n) => n.key === question.number).label : ''),
    [question]
  );

  if (!question) return null;

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
        <p className="text-sm text-slate-400">
          Put <span className="text-lg font-black text-white">{question.noun.paradigm.sg.nom}</span>
          {question.noun.gloss && <span className="text-slate-500"> ({question.noun.gloss})</span>} into the
        </p>
        <p className="mt-2 text-2xl font-black">
          <span className={color.text}>{caseInfo.label}</span>{' '}
          <span className="text-slate-300">{numberLabel}</span>
        </p>
        <p className="mt-1 text-sm italic text-slate-500">{caseInfo.role}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isAnswer = option === question.answer;
          const isPicked = option === picked;
          let cls = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-600 hover:bg-slate-900/70';
          if (answered && isAnswer) cls = 'border-emerald-500/60 bg-emerald-500/15 text-white';
          else if (answered && isPicked) cls = 'border-rose-500/60 bg-rose-500/15 text-white';
          else if (answered) cls = 'border-slate-800 bg-slate-950/40 text-slate-500';
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              disabled={answered}
              className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-xl font-medium transition-all ${cls}`}
            >
              <span>{option}</span>
              {answered && isAnswer && <Check size={20} className="text-emerald-300" />}
              {answered && isPicked && !isAnswer && <X size={20} className="text-rose-300" />}
            </button>
          );
        })}
      </div>

      {/* Feedback + next */}
      {answered && (
        <div
          className={`rounded-2xl border p-5 ${
            picked === question.answer
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-rose-500/30 bg-rose-500/10'
          }`}
        >
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white">
            {picked === question.answer ? 'Correct' : 'Not quite'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {caseInfo.label} {numberLabel} of{' '}
            <span className="font-semibold text-white">{question.noun.paradigm.sg.nom}</span> is{' '}
            <span className={`font-black ${color.text}`}>{question.answer}</span>. {caseInfo.role}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-emerald-500/50 hover:text-white"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
