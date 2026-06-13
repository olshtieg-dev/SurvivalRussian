'use client';

// Knowledge-test & review overlay. Optional (encouraged, not mandatory): pick a test for
// a chunk of the curriculum, answer 20 multiple-choice questions, get scored, and review
// the correct answers with explanations. Past scores are shown in the list.

import { useState } from 'react';

function ListView({ quizzes, results, studiedChunkIds, onStart, onClose }) {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Knowledge tests</p>
          <p className="mt-1 text-sm text-slate-400">Optional checks — see what stuck. 20 questions each.</p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-500 hover:text-white text-lg leading-none px-2" aria-label="Close">
          &times;
        </button>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        {quizzes.map((q) => {
          const r = results[q.chunkId];
          const studied = studiedChunkIds?.has(q.chunkId);
          return (
            <div key={q.chunkId} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">{q.label}</span>
                  {studied && (
                    <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-300">
                      Studied
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  {q.questions.length} questions
                  {r ? ` · best ${r.bestScore}/${r.total} · ${r.attempts} attempt${r.attempts === 1 ? '' : 's'}` : ' · not taken'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStart(q)}
                className="shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 hover:bg-amber-500/20 hover:text-white transition-all"
              >
                {r ? 'Retake' : 'Start'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TakeView({ quiz, onFinish, onExit }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = quiz.questions;
  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);

  const submit = () => {
    setSubmitted(true);
    onFinish(quiz.chunkId, score, questions.length);
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">{quiz.label}</p>
          <p className="mt-1 text-sm text-slate-400">
            {submitted ? `Score: ${score} / ${questions.length}` : `${answeredCount} / ${questions.length} answered`}
          </p>
        </div>
        <button type="button" onClick={onExit} className="text-slate-500 hover:text-white text-lg leading-none px-2" aria-label="Back to list">
          &times;
        </button>
      </div>

      <div className="px-6 py-4 flex flex-col gap-5">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <div key={q.id}>
              <p className="text-sm text-white">
                <span className="text-slate-500 font-mono text-xs mr-2">{qi + 1}.</span>
                {q.prompt}
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = q.answer === oi;
                  let cls = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';
                  if (submitted) {
                    if (isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200';
                    else if (isChosen) cls = 'border-rose-500/50 bg-rose-500/15 text-rose-200';
                    else cls = 'border-slate-800 bg-slate-900/40 text-slate-500';
                  } else if (isChosen) {
                    cls = 'border-amber-500/50 bg-amber-500/15 text-white';
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`text-left rounded-xl border px-3 py-2 text-xs transition-all ${cls} ${submitted ? 'cursor-default' : ''}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-1.5 text-[11px] text-slate-400 italic">{q.explain}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3 sticky bottom-0 bg-slate-950">
        {submitted ? (
          <>
            <button
              type="button"
              onClick={() => { setAnswers({}); setSubmitted(false); }}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-white"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-2xl bg-amber-600 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white hover:bg-amber-500 transition-all"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <span className="text-[11px] text-slate-500">Unanswered count as wrong.</span>
            <button
              type="button"
              onClick={submit}
              className="rounded-2xl bg-amber-600 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white hover:bg-amber-500 transition-all"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function QuizOverlay({ quizzes, results, studiedChunkIds, onRecordResult, onClose }) {
  const [active, setActive] = useState(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      {active ? (
        <TakeView quiz={active} onFinish={onRecordResult} onExit={() => setActive(null)} />
      ) : (
        <ListView
          quizzes={quizzes}
          results={results}
          studiedChunkIds={studiedChunkIds}
          onStart={setActive}
          onClose={onClose}
        />
      )}
    </div>
  );
}
