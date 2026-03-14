'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen, AlertCircle } from 'lucide-react';

export default function MeaningCard({ activeWord }) {
  const [thumbError, setThumbError] = useState(false);
  // Fallback for missing vocabulary data
  if (!activeWord) return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-slate-800/20 p-6 rounded-3xl border border-dashed border-slate-700 w-full max-w-md h-[450px]">
      <AlertCircle size={32} className="text-slate-600 animate-pulse" />
      <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
        Vocabulary Intel Missing
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4 bg-slate-950/40 p-8 rounded-3xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-500 backdrop-blur-md">
      
      {/* 1. Literal Meaning */}
      <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
        <p className="text-green-400 font-mono text-[10px] tracking-widest uppercase">
          Literal: {activeWord.literal}
        </p>
      </div>

      {/* 2. Tactical Cyrillic Display */}
      <h2 className="text-8xl font-black text-white tracking-tighter font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {activeWord.cyrillic}
      </h2>

      {/* 3. Natural Translation */}
      <p className="text-sm text-emerald-400 italic max-w-[240px] text-center font-sans border-b border-slate-800 pb-4">
       Natural: &apos;{activeWord.natural}&apos;
      </p>

      {/* 4. Visual Asset */}
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all"></div>
        <div className="relative w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-inner">
          {activeWord.thumbnail && activeWord.thumbnail !== 'null' && !thumbError ? (
            <Image
              src={activeWord.thumbnail}
              alt={activeWord.cyrillic}
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 invert brightness-200 opacity-80"
              onError={() => setThumbError(true)}
            />
          ) : (
            <div className="w-20 h-20 rounded-full border border-slate-700/70" />
          )}
        </div>
      </div>

      {/* 5. Intensive Analysis */}
      <div className="w-full max-w-xs mt-6 animate-in slide-in-from-bottom duration-700">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="h-[1px] flex-1 bg-blue-900/50"></div>
          <BookOpen size={12} className="text-blue-500" />
          <h4 className="text-blue-500 font-bold uppercase text-[9px] tracking-[0.3em]">
            Linguistic Intel
          </h4>
          <div className="h-[1px] flex-1 bg-blue-900/50"></div>
        </div>
        
        <div className="bg-slate-900/80 border border-blue-500/20 p-4 rounded-2xl">
          <p className="text-amber-300 leading-relaxed text-sm font-mono">
            {activeWord.analysis || "Parsing grammatical structure..."}
          </p>
        </div>
      </div>

    </div>
  );
}
