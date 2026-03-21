'use client';

import React from 'react';
import { Bot, ChevronDown, ChevronRight, Layers3, Lock } from 'lucide-react';

export default function LessonSetSelector({
  lessonSets,
  selectedLessonSetId,
  isOpen,
  onToggle,
  onSelectLessonSet,
}) {
  return (
    <div className="w-full px-2">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-left transition-all hover:bg-slate-800/80"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Layers3 size={14} className="text-blue-400 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 truncate">
            Lesson Sets
          </span>
        </span>
        {isOpen ? (
          <ChevronDown size={14} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-slate-400 shrink-0" />
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-h-[32rem] overflow-y-auto overscroll-contain pr-1 scroll-smooth snap-y snap-mandatory custom-scrollbar">
            <div className="flex flex-col gap-2">
            {lessonSets.map((lessonSet) => {
              const isSelected = lessonSet.id === selectedLessonSetId;

              return (
                <button
                  key={lessonSet.id}
                  type="button"
                  onClick={() => onSelectLessonSet(lessonSet.id)}
                  className={`snap-start rounded-xl border px-3 py-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/15 text-white shadow-[0_0_18px_rgba(37,99,235,0.18)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] truncate">
                      {lessonSet.label}
                    </span>
                    <span className={`text-[10px] font-black ${isSelected ? 'text-blue-300' : 'text-slate-500'}`}>
                      {lessonSet.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                    {lessonSet.description}
                  </p>
                  <p className={`mt-2 text-[10px] font-black uppercase tracking-[0.25em] ${isSelected ? 'text-blue-300' : 'text-slate-600'}`}>
                    {lessonSet.missions.length} missions
                  </p>
                </button>
              );
            })}
            <button
              type="button"
              disabled
              title="AI lessons: access with Premium"
              aria-label="AI lessons locked until premium access"
              className="snap-start rounded-xl border border-red-500/25 bg-red-950/20 px-3 py-3 text-left opacity-75 cursor-not-allowed"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 min-w-0">
                  <Bot size={14} className="text-red-300 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-200 truncate">
                    AI Lessons
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-300">
                  <Lock size={10} />
                  Premium
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                Custom AI-built missions will live here once premium access is enabled.
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-red-300">
                Access with Premium
              </p>
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
