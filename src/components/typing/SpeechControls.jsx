'use client';

import React from 'react';
import { VolumeX, Volume2 } from 'lucide-react';

// Stage-aware speech-mode toggle. Modes mirror how the practice unit grows:
// letters early, whole words at the word stage, sentences later.
const MODES = [
  { id: 'silent', label: 'Silent', icon: VolumeX },
  { id: 'letters', label: 'Letters' },
  { id: 'words', label: 'Words' },
  { id: 'sentences', label: 'Sentences' },
];

export default function SpeechControls({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 p-1">
      <Volume2 size={14} className="ml-2 text-slate-500" />
      {MODES.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            title={`${mode.label} speech`}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] transition-all ${
              value === mode.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {Icon ? <Icon size={12} /> : null}
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
