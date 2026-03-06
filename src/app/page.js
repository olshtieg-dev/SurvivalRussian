'use client';
import React, { useState, useEffect, useCallback } from 'react';
// Import the sharp, reliable icons
import { ChevronUp, ChevronDown, Dice5 } from 'lucide-react'; 
import TypingEngine from '../components/TypingEngine';
import MeaningCard from '../components/MeaningCard';
import SentenceStructuralAnalysis from '../components/SentenceStructuralAnalysis';
import SpeechInterface from '../components/SpeechInterface'; 
import vocabularyData from '../data/vocabulary.json';
import missions from '../data/missions.json';

export default function Home() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [voiceMode, setVoiceMode] = useState('echo'); 
  const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);
  const [activeWordKey, setActiveWordKey] = useState("");
  const [voiceFeedback, setVoiceFeedback] = useState({ transcript: '', analysis: '' });

  const currentMission = missions[missionIndex];
  const currentPhrase = currentMission?.phrase || "";

  // Helper to extract the first word of any phrase
  const getFirstWord = useCallback((index) => {
    const phrase = missions[index]?.phrase || "";
    return phrase.split(' ')[0];
  }, []);

  const resetSystem = useCallback((index) => {
    setIsMissionComplete(false);
    setLastPlayedIndex(-1);
    setVoiceFeedback({ transcript: '', analysis: '' });
    
    // Auto-load the first word of the coordinate set
    const firstWord = getFirstWord(index);
    if (firstWord && vocabularyData[firstWord]) {
      setActiveWordKey(firstWord);
    } else {
      setActiveWordKey("");
    }
  }, [getFirstWord]);

  // Initial load effect
  useEffect(() => {
    resetSystem(0);
  }, [resetSystem]);

  const nextMission = useCallback(() => {
    if (missionIndex < missions.length - 1) {
      const newIndex = missionIndex + 1;
      setMissionIndex(newIndex);
      resetSystem(newIndex);
    }
  }, [missionIndex, resetSystem]);

  const prevMission = () => {
    if (missionIndex > 0) {
      const newIndex = missionIndex - 1;
      setMissionIndex(newIndex);
      resetSystem(newIndex);
    }
  };

  const randomMission = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * missions.length);
    } while (newIndex === missionIndex && missions.length > 1);
    
    setMissionIndex(newIndex);
    resetSystem(newIndex);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter' && isMissionComplete) nextMission();
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isMissionComplete, nextMission]);

  const handleSpeechFeedback = (transcript, analysis) => {
    setVoiceFeedback({ transcript, analysis });
  };

  const playAudio = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordComplete = (word) => {
    if (voiceMode === 'echo') playAudio(word);
  };

  const handleProgress = (currentInput) => {
    const wordsInPhrase = currentPhrase.split(' ');
    // Count the number of spaces/words typed to find the target word index
    const typedWordsCount = currentInput.match(/\S+/g)?.length || 0;
    
    // If the input ends with a space, the user is moving to the NEXT word
    const isTrailingSpace = currentInput.endsWith(' ');
    const currentWordIndex = isTrailingSpace ? typedWordsCount : Math.max(0, typedWordsCount - 1);
    
    const targetWord = wordsInPhrase[currentWordIndex];

    if (voiceMode === 'model' && currentWordIndex !== lastPlayedIndex) {
      if (targetWord) {
        playAudio(targetWord);
        setLastPlayedIndex(currentWordIndex);
      }
    }

    // Immediately update MeaningCard to target word
    if (targetWord && vocabularyData[targetWord]) {
      setActiveWordKey(targetWord);
    }

    if (currentInput === currentPhrase) {
      setIsMissionComplete(true);
    }
  };

  const activeData = vocabularyData[activeWordKey];

  return (
    <main className="flex h-screen w-full bg-slate-900 text-white overflow-hidden relative">
      
      {/* --- REPEATING HIGH-DENSITY WATERMARK --- */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.015] font-black italic uppercase leading-[0.7] flex flex-wrap content-start gap-x-4 gap-y-0 p-2 text-5xl tracking-tighter z-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <React.Fragment key={i}>
            <span className="whitespace-nowrap">readчитать</span>
            <span className="whitespace-nowrap">writeписать</span>
            <span className="whitespace-nowrap text-blue-500">thinkдумать</span>
            <span className="whitespace-nowrap">listenслушать</span>
            <span className="whitespace-nowrap">speakговорить</span>
            <span className="whitespace-nowrap">russianнарусском</span>
          </React.Fragment>
        ))}
      </div>

      {/* SIDEBAR */}
      <aside className="w-20 border-r border-slate-800 bg-slate-950 flex flex-col items-center py-6 gap-6 z-50 shadow-2xl">
        
        {/* MISSION COUNTER */}
        <div className="text-[10px] text-blue-500 font-black rotate-180 [writing-mode:vertical-lr] tracking-[0.5em] mb-2 opacity-70">
          MISSION {missionIndex + 1}
        </div>

        {/* FIXED NAVIGATION SET */}
        <div className="flex flex-col gap-3 w-full items-center py-4 border-y border-slate-900/50">
          <button 
            onClick={prevMission}
            disabled={missionIndex === 0}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-10 active:scale-90"
          >
            <ChevronUp size={20} />
          </button>
          
          <button 
            onClick={randomMission}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-inner active:rotate-12"
          >
            <Dice5 size={18} />
          </button>

          <button 
            onClick={nextMission}
            disabled={missionIndex === missions.length - 1}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-10 active:scale-90"
          >
            <ChevronDown size={20} />
          </button>
        </div>
        
        {/* VOICE MODES */}
        <div className="flex flex-col gap-3">
          {['model', 'echo', 'silent'].map((mode) => (
            <button
              key={mode}
              onClick={() => setVoiceMode(mode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                voiceMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'
              }`}
            >
              <span className="text-[10px] font-black uppercase">{mode[0]}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <SpeechInterface 
            targetWord={activeData?.cyrillic || ""} 
            fullPhrase={currentPhrase} 
            onFeedbackReceived={handleSpeechFeedback} 
          />
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto z-10 py-10">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8 px-8">
          
          <MeaningCard activeWord={activeData} />

          <TypingEngine 
            key={missionIndex} 
            targetText={currentPhrase} 
            onProgress={handleProgress} 
            onWordComplete={handleWordComplete}
            voiceTranscript={voiceFeedback.transcript} 
            voiceAnalysis={voiceFeedback.analysis}     
          />

          <div className={`transition-all duration-1000 w-full ${isMissionComplete ? 'opacity-100 scale-100' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <SentenceStructuralAnalysis sentenceData={currentMission} />
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-blue-500/50"></div>
              <p className="text-blue-400 font-mono text-[10px] animate-pulse tracking-[.5em] uppercase">
                Mission Complete: Press [Enter] or [Down]
              </p>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-blue-500/50"></div>
            </div>
          </div>
         
        </div>
      </div>
    </main>
  );
}