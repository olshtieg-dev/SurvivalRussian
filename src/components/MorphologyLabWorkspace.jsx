'use client';

import React from 'react';
import { ArrowRight, Blocks, GitBranchPlus, Sparkles, TreePine } from 'lucide-react';

const accentClasses = {
  emerald: {
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    panel: 'border-emerald-500/20 bg-emerald-500/10',
    glow: 'shadow-[0_0_45px_rgba(16,185,129,0.08)]',
  },
  amber: {
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    panel: 'border-amber-500/20 bg-amber-500/10',
    glow: 'shadow-[0_0_45px_rgba(245,158,11,0.08)]',
  },
  blue: {
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    panel: 'border-blue-500/20 bg-blue-500/10',
    glow: 'shadow-[0_0_45px_rgba(37,99,235,0.08)]',
  },
};

const iconMap = {
  trees: TreePine,
  rolodex: GitBranchPlus,
  wildcard: Sparkles,
};

export default function MorphologyLabWorkspace({
  activeModule,
  onOpenModuleSelector,
  onReturnToTyping,
}) {
  const accent = accentClasses[activeModule.accent];
  const Icon = iconMap[activeModule.id] || Blocks;

  return (
    <div className="w-full max-w-5xl px-8">
      <div className={`overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 ${accent.glow}`}>
        <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.95))] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${accent.badge}`}>
                <Icon size={12} />
                {activeModule.label}
              </div>

              <h1 className="mt-4 text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
                Morphology Lab
              </h1>

              <p className="mt-4 text-base leading-relaxed text-slate-300">
                {activeModule.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenModuleSelector}
                className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-slate-200 transition-all hover:border-slate-500 hover:text-white"
              >
                Switch Module
              </button>
              <button
                type="button"
                onClick={onReturnToTyping}
                className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-blue-300 transition-all hover:bg-blue-500/20"
              >
                Return To Lessons
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
          <div className={`rounded-[1.5rem] border px-5 py-5 ${accent.panel}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
              Core Interaction
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              {activeModule.prototype}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 px-5 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
              Example Surface
            </p>
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 font-mono text-sm text-white">
              {activeModule.example}
            </div>
            <div className="mt-3 space-y-2">
              {activeModule.focusAreas.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <ArrowRight size={14} className="text-slate-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 px-5 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
              Expansion Rail
            </p>
            <div className="mt-3 space-y-3">
              {activeModule.futureIdeas.map((idea) => (
                <div
                  key={idea}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm leading-relaxed text-slate-300"
                >
                  {idea}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-6 py-5 sm:px-8">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
              Lab Status
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              This is the module scaffold, not the finished learning mechanic yet. It gives each idea a real home now so you can keep adding trees, rollers, mashups, and future oddballs without tangling them into the typing lane.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
