'use client';

import React from 'react';
import { Blocks, GitBranchPlus, Sparkles, TreePine, X } from 'lucide-react';
import { morphologyModules } from '../data/morphologyModules';

const accentClasses = {
  emerald: {
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    card: 'hover:border-emerald-500/50 hover:bg-emerald-500/10',
    active: 'border-emerald-500/50 bg-emerald-500/15 shadow-[0_0_24px_rgba(16,185,129,0.12)]',
  },
  amber: {
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    card: 'hover:border-amber-500/50 hover:bg-amber-500/10',
    active: 'border-amber-500/50 bg-amber-500/15 shadow-[0_0_24px_rgba(245,158,11,0.12)]',
  },
  blue: {
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    card: 'hover:border-blue-500/50 hover:bg-blue-500/10',
    active: 'border-blue-500/50 bg-blue-500/15 shadow-[0_0_24px_rgba(37,99,235,0.12)]',
  },
};

const iconMap = {
  trees: TreePine,
  rolodex: GitBranchPlus,
  wildcard: Sparkles,
};

export default function MorphologyModuleOverlay({
  isOpen,
  activeModuleId,
  onClose,
  onSelectModule,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[115] overflow-y-auto bg-slate-950/88 backdrop-blur-sm p-4 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto mt-4 mb-8 w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
              <Blocks size={12} />
              Morphology Lab
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.24em] text-white">
              Module Picker
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:text-white"
            aria-label="Close morphology module picker"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed text-slate-300">
              Pick the kind of non-typing grammar surface you want to sketch next. This lab is built
              to hold case maps, morpheme rollers, and whatever other strange machinery you want to bolt on later.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {morphologyModules.map((module) => {
              const Icon = iconMap[module.id];
              const accent = accentClasses[module.accent];
              const isActive = module.id === activeModuleId;

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => onSelectModule(module.id)}
                  className={`rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5 text-left transition-all ${accent.card} ${
                    isActive ? accent.active : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${accent.badge}`}>
                      <Icon size={12} />
                      {module.badge}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-white">
                    {module.label}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {module.description}
                  </p>

                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                      Prototype Hook
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {module.prototype}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.focusAreas.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
