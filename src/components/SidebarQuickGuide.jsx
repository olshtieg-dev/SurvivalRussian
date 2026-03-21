'use client';

import React from 'react';
import { Gamepad2, Layers3, Mic, Volume2, X } from 'lucide-react';

const guideItems = [
  {
    icon: Layers3,
    label: 'Lessons',
    description: 'Choose the mission set you want to work through.',
  },
  {
    icon: Mic,
    label: 'Mic',
    description: 'Record yourself and compare your pronunciation to the target.',
  },
  {
    icon: Volume2,
    label: 'Modes',
    description: 'Switch between model, echo, or silent audio support.',
  },
  {
    icon: Gamepad2,
    label: 'Extras',
    description: 'Open the arcade or leave feedback whenever you want a break.',
  },
];

export default function SidebarQuickGuide({ isVisible, onDismiss }) {
  if (!isVisible) return null;

  return (
    <div className="mx-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 shadow-inner shadow-slate-950/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-300">
            Quick Guide
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Your taskbar is the control deck. Pick a lesson, type the line, then use voice tools when you want audio support.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            It is also a clean home for the built-in tutor, AI input, and chatroom as those systems come online.
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

      <div className="mt-4 flex flex-col gap-3">
        {guideItems.map(({ icon: Icon, label, description }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2">
              <Icon size={14} className="text-blue-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                {label}
              </p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
