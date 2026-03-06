'use client';

import React, { useState } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { AlertCircle, Activity, ShieldCheck } from 'lucide-react';

export default function TypingEngine({ 
  targetText, 
  onProgress = () => {}, 
  onWordComplete = () => {},
  voiceTranscript = "", // From Gemini Bridge
  voiceAnalysis = ""    // From Gemini Bridge
}) {
  const [userInput, setUserInput] = useState('');
  const [errorIndex, setErrorIndex] = useState(null);

  const handleKeyPress = (char) => {
    if (char === 'backspace') {
      const newPath = userInput.slice(0, -1);
      setUserInput(newPath);
      setErrorIndex(null);
      onProgress(newPath);
      return;
    }

    const nextIndex = userInput.length;
    if (nextIndex >= targetText.length) return; 

    const expectedChar = targetText[nextIndex];

    if (char === expectedChar) {
      const newPath = userInput + char;
      setUserInput(newPath);
      setErrorIndex(null);
      onProgress(newPath);

      if (char === ' ' || newPath.length === targetText.length) {
        const words = newPath.trim().split(' ');
        onWordComplete(words[words.length - 1]);
      }
    } else {
      setErrorIndex(nextIndex);
    }
  };

  useKeyboard(handleKeyPress);

 return (
    <div className="w-full max-w-4xl bg-slate-950/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* 1. TOP LINE: REPURPOSED FOR SIGNAL (Speech Recognition) */}
      <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">SIGNAL:</span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest italic">
            {voiceTranscript ? `"${voiceTranscript}"` : "AWAITING PHONETIC INPUT..."}
          </span>
        </div>
        
        {errorIndex !== null && (
          <div className="flex items-center text-red-500 animate-bounce">
            <AlertCircle size={14} className="mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Input Mismatch</span>
          </div>
        )}
      </div>

      {/* 3. ANALYSIS LINE: NOW DIRECTLY UNDER SIGNAL */}
      <div className="flex justify-between items-center py-3 border-b border-slate-800/20 mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} className="text-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">ANALYSIS:</span>
          <span className="text-[11px] font-mono text-blue-300 italic uppercase tracking-wider">
            {voiceAnalysis || "READY FOR PHONETIC INSTRUCTION"}
          </span>
        </div>
        
      </div>

      {/* 2. THE CORE TYPING FIELD */}
      <div className="relative text-4xl font-mono leading-relaxed tracking-[0.15em] whitespace-pre-wrap min-h-[120px]">
        <div className="relative z-10">
          {targetText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isError = index === errorIndex;

            return (
              <span key={index} className="relative inline-block">
                <span className={`transition-all duration-75 ${
                  isTyped 
                    ? "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.65)] font-mono"
                    : isError 
                      ? "text-red-500 bg-red-500/10" 
                      : "text-blue-900/60"
                }`}>
                  {char}
                </span>
                
                {isCurrent && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-700 uppercase tracking-[0.2em]">
          <span>POS: {userInput.length}/{targetText.length}</span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {Math.round((userInput.length / targetText.length) * 100)}%
          </span>
        </div>
      </div>
      
      {/* Corner "Hardware" Aesthetics */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700" />
    </div>
  );
}
