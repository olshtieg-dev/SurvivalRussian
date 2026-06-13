'use client';

// Right rail — mirror of the left sidebar's collapsed dimensions, always visible.
// Holds placeholders for the future Google login and curriculum systems.
// Buttons are intentionally inert (disabled) until those systems are wired in.

import { LogIn, GraduationCap } from 'lucide-react';

export default function RightRail({ onOpenCurriculum }) {
  return (
    <aside className="w-20 border-l border-slate-800 bg-slate-950 flex flex-col items-center py-6 gap-6 z-50 shadow-2xl overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="text-[10px] font-black rotate-180 [writing-mode:vertical-lr] tracking-[0.5em] opacity-70 text-slate-500">
        ACCOUNT
      </div>

      <div className="flex flex-col gap-3 w-full items-center py-4 border-y border-slate-900/50">
        <button
          type="button"
          disabled
          title="Sign in with Google (coming soon)"
          aria-label="Sign in with Google (coming soon)"
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500 transition-all opacity-60 cursor-not-allowed"
        >
          <LogIn size={18} />
        </button>

        <button
          type="button"
          onClick={onOpenCurriculum}
          title="Your curriculum plan"
          aria-label="Open your curriculum plan"
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-white"
        >
          <GraduationCap size={18} />
        </button>
      </div>

      <div className="mt-auto text-[8px] text-slate-700 uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr]">
        Soon
      </div>
    </aside>
  );
}
