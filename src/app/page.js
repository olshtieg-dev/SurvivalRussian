'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronUp, ChevronDown, Dice5, GitBranchPlus, VolumeX } from 'lucide-react';
import TypingEngine from '../components/TypingEngine';
import MeaningCard from '../components/MeaningCard';
import SentenceStructuralAnalysis from '../components/SentenceStructuralAnalysis';
import SpeechInterface from '../components/SpeechInterface';
import vocabularyData from '../data/vocabulary.json';
import { defaultLessonSetId, getLessonSet, lessonSets } from '../data/lessonSets';
import LessonSetSelector from '../components/LessonSetSelector';
import SuggestionShredder from '../components/SuggestionShredder';
import GameOverlay from '../components/GameOverlay';
import WelcomeOverlay from '../components/WelcomeOverlay';
import SidebarQuickGuide from '../components/SidebarQuickGuide';
import FeatureDock from '../components/FeatureDock';
import MorphologyModuleOverlay from '../components/MorphologyModuleOverlay';
import MorphologyLabWorkspace from '../components/MorphologyLabWorkspace';
import { defaultMorphologyModuleId, getMorphologyModule } from '../data/morphologyModules';

const APP_STATE_STORAGE_KEY = 'survival-russian-app-state-v1';

function getStartingWordKey(missions) {
  const phrase = missions[0]?.phrase || '';
  const firstWord = phrase.split(' ')[0];
  return firstWord && vocabularyData[firstWord] ? firstWord : '';
}

function clampMissionIndex(index, missionCount) {
  if (!Number.isInteger(index)) return 0;
  if (missionCount <= 0) return 0;
  return Math.min(Math.max(index, 0), missionCount - 1);
}

function readPersistedAppState() {
  if (typeof window === 'undefined') return null;

  try {
    const rawState = window.localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!rawState) return null;

    const parsedState = JSON.parse(rawState);
    return parsedState && typeof parsedState === 'object' ? parsedState : null;
  } catch (error) {
    return null;
  }
}

export default function Home() {
  const sidebarRef = useRef(null);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedLessonSetId, setSelectedLessonSetId] = useState(defaultLessonSetId);
  const [activeSurface, setActiveSurface] = useState('typing');
  const [isLessonSelectorOpen, setIsLessonSelectorOpen] = useState(false);
  const [isMorphologyModuleSelectorOpen, setIsMorphologyModuleSelectorOpen] = useState(false);
  const [isQuickGuideVisible, setIsQuickGuideVisible] = useState(true);
  const [missionIndex, setMissionIndex] = useState(0);
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [selectedMorphologyModuleId, setSelectedMorphologyModuleId] = useState(defaultMorphologyModuleId);
  const [voiceMode, setVoiceMode] = useState('echo');
  const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);
  const [voiceFeedback, setVoiceFeedback] = useState({ transcript: '', analysis: '' });
  const [activeWordKey, setActiveWordKey] = useState(() => {
    const initialLessonSet = getLessonSet(defaultLessonSetId);
    return getStartingWordKey(initialLessonSet?.missions || []);
  });

  const currentLessonSet = getLessonSet(selectedLessonSetId);
  const activeMorphologyModule = getMorphologyModule(selectedMorphologyModuleId);
  const isMorphologyActive = activeSurface === 'morphology';
  const canAdvanceMission = isMissionComplete && !isMorphologyActive;
  const missions = useMemo(() => currentLessonSet?.missions || [], [currentLessonSet]);
  const currentMission = missions[missionIndex];
  const currentPhrase = currentMission?.phrase || '';
  const currentLessonLabel = isMorphologyActive ? 'Morphology Lab' : currentLessonSet?.label || 'Lesson Set';

  const resetSystem = useCallback((missionList, index) => {
    setIsMissionComplete(false);
    setLastPlayedIndex(-1);
    setVoiceFeedback({ transcript: '', analysis: '' });

    const firstWord = getStartingWordKey(missionList.slice(index));
    if (firstWord) {
      setActiveWordKey(firstWord);
    } else {
      setActiveWordKey('');
    }
  }, []);

  const selectLessonSet = useCallback((lessonSetId) => {
    const nextLessonSet = getLessonSet(lessonSetId);
    setActiveSurface('typing');
    setSelectedLessonSetId(nextLessonSet.id);
    setMissionIndex(0);
    resetSystem(nextLessonSet.missions, 0);
    setIsLessonSelectorOpen(false);
  }, [resetSystem]);

  const openMorphologyModuleSelector = useCallback(() => {
    setIsLessonSelectorOpen(true);
    setIsMorphologyModuleSelectorOpen(true);
  }, []);

  const selectMorphologyModule = useCallback((moduleId) => {
    setSelectedMorphologyModuleId(moduleId);
    setActiveSurface('morphology');
    setIsMorphologyModuleSelectorOpen(false);
  }, []);

  const returnToTypingSurface = useCallback(() => {
    setActiveSurface('typing');
  }, []);

  const nextMission = useCallback(() => {
    if (missionIndex < missions.length - 1) {
      const newIndex = missionIndex + 1;
      setMissionIndex(newIndex);
      resetSystem(missions, newIndex);
    }
  }, [missionIndex, missions, resetSystem]);

  const prevMission = useCallback(() => {
    if (missionIndex > 0) {
      const newIndex = missionIndex - 1;
      setMissionIndex(newIndex);
      resetSystem(missions, newIndex);
    }
  }, [missionIndex, missions, resetSystem]);

  const randomMission = useCallback(() => {
    if (!missions.length) return;

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * missions.length);
    } while (newIndex === missionIndex && missions.length > 1);

    setMissionIndex(newIndex);
    resetSystem(missions, newIndex);
  }, [missionIndex, missions, resetSystem]);

  useEffect(() => {
    const persistedState = readPersistedAppState();
    const animationFrame = window.requestAnimationFrame(() => {
      if (persistedState) {
        const restoredLessonSet =
          getLessonSet(persistedState.selectedLessonSetId) || getLessonSet(defaultLessonSetId);
        const restoredMissionIndex = clampMissionIndex(
          persistedState.missionIndex,
          restoredLessonSet?.missions?.length || 0
        );
        const restoredMorphologyModule =
          getMorphologyModule(persistedState.selectedMorphologyModuleId) ||
          getMorphologyModule(defaultMorphologyModuleId);
        const restoredVoiceMode =
          ['model', 'echo', 'silent'].includes(persistedState.voiceMode)
            ? persistedState.voiceMode
            : 'echo';
        const restoredSurface =
          persistedState.activeSurface === 'morphology' ? 'morphology' : 'typing';

        setHasStarted(Boolean(persistedState.hasStarted));
        setSelectedLessonSetId(restoredLessonSet.id);
        setMissionIndex(restoredMissionIndex);
        setActiveSurface(restoredSurface);
        setSelectedMorphologyModuleId(restoredMorphologyModule.id);
        setVoiceMode(restoredVoiceMode);
        setIsQuickGuideVisible(
          typeof persistedState.isQuickGuideVisible === 'boolean'
            ? persistedState.isQuickGuideVisible
            : true
        );
        setActiveWordKey(getStartingWordKey(restoredLessonSet.missions.slice(restoredMissionIndex)));
      }

      setIsBootstrapped(true);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (!isBootstrapped || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        APP_STATE_STORAGE_KEY,
        JSON.stringify({
          hasStarted,
          selectedLessonSetId,
          missionIndex,
          activeSurface,
          selectedMorphologyModuleId,
          voiceMode,
          isQuickGuideVisible,
        })
      );
    } catch (error) {
      // Ignore storage failures so the lesson flow keeps working.
    }
  }, [
    activeSurface,
    hasStarted,
    isBootstrapped,
    isQuickGuideVisible,
    missionIndex,
    selectedLessonSetId,
    selectedMorphologyModuleId,
    voiceMode,
  ]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter' && canAdvanceMission) nextMission();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canAdvanceMission, nextMission]);

  useEffect(() => {
    if (!isLessonSelectorOpen) return;

    const handlePointerDown = (event) => {
      if (!sidebarRef.current?.contains(event.target)) {
        setIsLessonSelectorOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isLessonSelectorOpen]);

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

  const handleStart = useCallback(() => {
    setHasStarted(true);
    setIsLessonSelectorOpen(true);
    setIsQuickGuideVisible(true);
  }, []);

  const handleWordComplete = (word) => {
    if (voiceMode === 'echo') playAudio(word);
  };

  const handleProgress = (currentInput) => {
    const wordsInPhrase = currentPhrase.split(' ');
    const typedWordsCount = currentInput.match(/\S+/g)?.length || 0;
    const isTrailingSpace = currentInput.endsWith(' ');
    const currentWordIndex = isTrailingSpace ? typedWordsCount : Math.max(0, typedWordsCount - 1);

    const targetWord = wordsInPhrase[currentWordIndex];

    if (voiceMode === 'model' && currentWordIndex !== lastPlayedIndex) {
      if (targetWord) {
        playAudio(targetWord);
        setLastPlayedIndex(currentWordIndex);
      }
    }

    if (targetWord && vocabularyData[targetWord]) {
      setActiveWordKey(targetWord);
    }

    if (currentInput === currentPhrase) {
      setIsMissionComplete(true);
    }
  };

  const activeData = vocabularyData[activeWordKey];
  const voiceModeMeta = {
    model: {
      title: 'Model mode: plays the target word before you type it',
      label: 'M',
    },
    echo: {
      title: 'Echo mode: repeats each completed word back to you',
      label: 'E',
    },
    silent: {
      title: 'Silent mode: no audio playback',
      icon: VolumeX,
    },
  };

  if (!isBootstrapped) {
    return <main className="h-screen w-full bg-slate-900" />;
  }

  return (
    <main className="flex h-screen w-full bg-slate-900 text-white overflow-hidden relative">
      {!hasStarted && <WelcomeOverlay onStart={handleStart} />}
      <MorphologyModuleOverlay
        isOpen={isMorphologyModuleSelectorOpen}
        activeModuleId={selectedMorphologyModuleId}
        onClose={() => setIsMorphologyModuleSelectorOpen(false)}
        onSelectModule={selectMorphologyModule}
      />

      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.015] font-black italic uppercase leading-[0.7] flex flex-wrap content-start gap-x-4 gap-y-0 p-2 text-5xl tracking-tighter z-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <React.Fragment key={i}>
            <span className="whitespace-nowrap">read читать</span>
            <span className="whitespace-nowrap">write писать</span>
            <span className="whitespace-nowrap text-blue-500">think думать</span>
            <span className="whitespace-nowrap">listen слушать</span>
            <span className="whitespace-nowrap">speak говорить</span>
            <span className="whitespace-nowrap">russian на русском</span>
          </React.Fragment>
        ))}
      </div>

      <aside
        ref={sidebarRef}
        className={`border-r border-slate-800 bg-slate-950 flex flex-col items-center py-6 gap-6 z-50 shadow-2xl transition-all duration-300 overflow-y-auto overflow-x-hidden custom-scrollbar ${isLessonSelectorOpen ? 'w-80' : 'w-20'}`}
      >
        <div className="w-full flex items-center justify-center">
          {isLessonSelectorOpen ? (
            <div className="px-4 w-full">
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                isMorphologyActive ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                {currentLessonLabel}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {isMorphologyActive
                  ? activeMorphologyModule?.label || 'Module picker'
                  : `Mission ${missionIndex + 1} of ${missions.length}`}
              </div>
            </div>
          ) : (
            <div className={`text-[10px] font-black rotate-180 [writing-mode:vertical-lr] tracking-[0.5em] mb-2 opacity-70 ${
              isMorphologyActive ? 'text-emerald-400' : 'text-blue-500'
            }`}>
              {isMorphologyActive ? 'LAB' : `MISSION ${missionIndex + 1}`}
            </div>
          )}
        </div>

        <LessonSetSelector
          lessonSets={lessonSets}
          selectedLessonSetId={selectedLessonSetId}
          isOpen={isLessonSelectorOpen}
          isMorphologyActive={isMorphologyActive}
          activeMorphologyModuleLabel={activeMorphologyModule?.shortLabel || 'Open'}
          onToggle={() => setIsLessonSelectorOpen((open) => !open)}
          onSelectLessonSet={selectLessonSet}
          onOpenMorphologyLab={openMorphologyModuleSelector}
        />

        {isLessonSelectorOpen && !isMorphologyActive && (
          <SidebarQuickGuide
            isVisible={isQuickGuideVisible}
            onDismiss={() => setIsQuickGuideVisible(false)}
          />
        )}

        {isMorphologyActive ? (
          isLessonSelectorOpen ? (
            <div className="w-full px-4 py-4 border-y border-slate-900/50">
              <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  Active Module
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {activeMorphologyModule?.label}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
                  Swap modules whenever you want. This lane is for grammar contraptions, not typing drills.
                </p>
                <button
                  type="button"
                  onClick={openMorphologyModuleSelector}
                  className="mt-4 w-full rounded-2xl border border-emerald-500/30 bg-slate-950/70 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-300 transition-all hover:bg-slate-900"
                >
                  Switch Module
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full items-center py-4 border-y border-slate-900/50">
              <button
                type="button"
                onClick={openMorphologyModuleSelector}
                title={`Active morphology module: ${activeMorphologyModule?.label}`}
                aria-label={`Open morphology module picker. Active module: ${activeMorphologyModule?.label}`}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-white"
              >
                <GitBranchPlus size={16} />
              </button>
            </div>
          )
        ) : (
          <>
            <div className="flex flex-col gap-3 w-full items-center py-4 border-y border-slate-900/50">
              <button
                onClick={prevMission}
                disabled={missionIndex === 0}
                title="Previous lesson"
                aria-label="Previous lesson"
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-10 active:scale-90"
              >
                <ChevronUp size={20} />
              </button>

              <button
                onClick={randomMission}
                title="Random lesson"
                aria-label="Random lesson"
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-inner active:rotate-12"
              >
                <Dice5 size={18} />
              </button>

              <button
                onClick={nextMission}
                disabled={missionIndex === missions.length - 1}
                title="Next lesson"
                aria-label="Next lesson"
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-10 active:scale-90"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            <SpeechInterface
              targetWord={activeData?.cyrillic || ''}
              fullPhrase={currentPhrase}
              onFeedbackReceived={handleSpeechFeedback}
            />

            <div className="flex flex-col gap-3">
              {['model', 'echo', 'silent'].map((mode) => {
                const modeConfig = voiceModeMeta[mode];
                const Icon = modeConfig.icon;

                return (
                  <button
                    key={mode}
                    onClick={() => setVoiceMode(mode)}
                    title={modeConfig.title}
                    aria-label={modeConfig.title}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800 transition-all ${
                      voiceMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {Icon ? (
                      <Icon size={15} />
                    ) : (
                      <span className="text-[10px] font-black uppercase">{modeConfig.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <FeatureDock />

        <div className="mt-auto flex flex-col items-center gap-4">
          <GameOverlay />
          <SuggestionShredder />
        </div>
      </aside>

      <div className="flex-1 flex flex-col items-center overflow-y-auto z-10 py-10">
        {isMorphologyActive ? (
          <MorphologyLabWorkspace
            activeModule={activeMorphologyModule}
            onOpenModuleSelector={openMorphologyModuleSelector}
            onReturnToTyping={returnToTypingSurface}
          />
        ) : (
          <div className="w-full max-w-4xl flex flex-col items-center gap-8 px-8">
            <MeaningCard activeWord={activeData} />

            <TypingEngine
              key={`${selectedLessonSetId}-${missionIndex}`}
              targetText={currentPhrase}
              onProgress={handleProgress}
              onWordComplete={handleWordComplete}
              voiceTranscript={voiceFeedback.transcript}
              voiceAnalysis={voiceFeedback.analysis}
              activeData={activeData}
            />

            <div className="w-full">
              <SentenceStructuralAnalysis sentenceData={currentMission} />
              <div className={`transition-all duration-700 ${isMissionComplete ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden'}`}>
                <div className="flex justify-center items-center gap-4 mt-8">
                  <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-blue-500/50" />
                  <p className="text-blue-400 font-mono text-[10px] animate-pulse tracking-[.5em] uppercase">
                    Mission Complete: Press [Enter] or [Down]
                  </p>
                  <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-blue-500/50" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
