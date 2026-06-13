'use client';

// Curriculum panel — the learner's "what next" surface. Shows the single recommended
// lesson (no catalogue browsing), the stage roadmap with progress, and a record of what
// they've drilled including repetitions. Driven entirely by useCurriculum.

import { getLessonSet } from '../data/lessons';

function setLabel(id) {
  if (!id) return '';
  return getLessonSet(id)?.label || id;
}

export default function CurriculumPanel({
  recommendation,
  reviewRecommendation,
  progress,
  records,
  onStart,
  onFreePlay,
  onRedoQuestionnaire,
  onReset,
  onClose,
}) {
  const rec = recommendation;
  const review = typeof reviewRecommendation === 'function' ? reviewRecommendation() : null;

  const worked = Object.entries(records || {})
    .map(([id, r]) => {
      const missions = r.missions || {};
      const distinct = Object.keys(missions).length;
      const reps = Object.values(missions).reduce((a, b) => a + b, 0);
      return { id, label: setLabel(id), distinct, reps, lastSeen: r.lastSeen || 0 };
    })
    .sort((a, b) => b.lastSeen - a.lastSeen);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Your plan</p>
            <p className="mt-1 text-sm text-slate-400">We pick what&apos;s next — just hit start.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-white text-lg leading-none px-2"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Recommendation */}
        <div className="px-6 py-5">
          {rec ? (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
                {rec.allComplete ? 'All caught up — review' : 'Up next'}
              </p>
              {rec.kind === 'typing' ? (
                <>
                  <p className="mt-2 text-base font-bold text-white">Typing foundations</p>
                  <p className="mt-1 text-xs text-slate-300">
                    Build keyboard muscle memory first. You can still start with the gentlest
                    word set below while you get comfortable.
                  </p>
                  <button
                    type="button"
                    onClick={() => onStart('essentials', rec.stageIndexResolved)}
                    className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white hover:bg-blue-500 transition-all"
                  >
                    Start with Essentials
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-2 text-base font-bold text-white">{setLabel(rec.lessonSetId)}</p>
                  <p className="mt-1 text-xs text-slate-300">{rec.reason}</p>
                  <button
                    type="button"
                    onClick={() => onStart(rec.lessonSetId, rec.stageIndexResolved)}
                    className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white hover:bg-blue-500 transition-all"
                  >
                    Start
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No recommendation yet.</p>
          )}

          <div className="mt-3 flex gap-2">
            {review?.lessonSetId && (
              <button
                type="button"
                onClick={() => onStart(review.lessonSetId)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                Review · {setLabel(review.lessonSetId)}
              </button>
            )}
            <button
              type="button"
              onClick={onFreePlay}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              Free play
            </button>
          </div>
        </div>

        {/* Stage roadmap */}
        <div className="px-6 py-4 border-t border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 mb-3">Roadmap</p>
          <div className="flex flex-col gap-2">
            {progress.map((s) => {
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <div key={s.stageId} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{s.label}</span>
                      <span className="text-slate-500">
                        {s.kind === 'lessons' ? `${s.done}/${s.total}` : 'tutor'}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500/70" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What you've worked on */}
        <div className="px-6 py-4 border-t border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 mb-3">
            What you&apos;ve worked on
          </p>
          {worked.length ? (
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {worked.map((w) => (
                <div key={w.id} className="flex justify-between text-[11px]">
                  <span className="text-slate-300 truncate pr-2">{w.label}</span>
                  <span className="text-slate-500 shrink-0">
                    {w.distinct} done · {w.reps} reps
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600">Nothing yet — start a lesson above.</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRedoQuestionnaire}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300"
          >
            Redo questionnaire
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500/70 hover:text-rose-400"
          >
            Reset progress
          </button>
        </div>
      </div>
    </div>
  );
}
