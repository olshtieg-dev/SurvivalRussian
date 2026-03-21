'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

export default function SentenceStructuralAnalysis({ sentenceData }) {
  // Only show the intensive breakdown if we have the data for the full sentence
  if (!sentenceData) return null;

  return (
    <div className="w-full max-w-3xl mt-12 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center gap-2 mb-3 px-2">
        <BookOpen size={16} className="text-emerald-400" />
        <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-[0.3em]">
          Mission Structural Intel
        </h4>
      </div>
      
      <div className="bg-emerald-900/5 border border-emerald-500/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <p className="text-slate-300 leading-relaxed text-sm font-mono italic">
          {sentenceData.fullAnalysis || "Sentence structure data is loading for this mission."}
        </p>
      </div>
    </div>
  );
}
