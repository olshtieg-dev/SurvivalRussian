'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Bot, Keyboard, Lock, MessageSquare, X } from 'lucide-react';
import TypingTutorPanel from './TypingTutorPanel';
import ChatroomPanel from './ChatroomPanel';

const featureDefinitions = [
  {
    id: 'typing',
    label: 'Typing Tutor',
    shortLabel: 'Tutor',
    title: 'Open typing tutor',
    icon: Keyboard,
    accent: 'blue',
    description:
      'The built-in typing tutor will be gloriously basic: it says each letter, then says the word, and walks the student through a primary-school-tier lesson one tiny step at a time.',
    details: [
      'Letter-first pacing so the student hears what they are pressing.',
      'Word replay after each small success to reinforce rhythm and recall.',
      'Designed to be simple on purpose, not clever.',
    ],
  },
  {
    id: 'ai',
    label: 'AI Input',
    shortLabel: 'AI',
    title: 'AI input: premium access',
    icon: Bot,
    accent: 'red',
    isPremium: true,
    description:
      'This window is the future home for AI-built phrases, guided prompts, and custom lesson generation before those phrases graduate into the main lesson system.',
    details: [
      'Generate phrase sets from a topic or scenario.',
      'Save useful results locally as a stopgap before the full database arrives.',
      'Turn rough ideas into drills without leaving the app.',
    ],
  },
  {
    id: 'chat',
    label: 'Chatroom',
    shortLabel: 'Chat',
    title: 'Open chatroom',
    icon: MessageSquare,
    accent: 'amber',
    description:
      'The live chatroom is now the shared practice box: collaborative drafts, commits, quick replies, and room-wide chatter without leaving the app.',
    details: [
      'Drafts show up live before a message is committed.',
      'Click a user label to inject a fast reply tag.',
      'Presence, room history, and a built-in RU helper now make the room usable right away.',
    ],
  },
];

const accentClasses = {
  blue: {
    button: 'hover:border-blue-500 hover:text-blue-300',
    active: 'border-blue-500/40 bg-blue-600/15 text-blue-200',
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  },
  emerald: {
    button: 'hover:border-emerald-500 hover:text-emerald-300',
    active: 'border-emerald-500/40 bg-emerald-600/15 text-emerald-200',
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  },
  amber: {
    button: 'hover:border-amber-500 hover:text-amber-300',
    active: 'border-amber-500/40 bg-amber-600/15 text-amber-200',
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  },
  red: {
    button: 'hover:border-red-500 hover:text-red-300',
    active: 'border-red-500/40 bg-red-600/15 text-red-200',
    badge: 'border-red-500/20 bg-red-500/10 text-red-300',
  },
};

export default function FeatureDock() {
  const [activeFeatureId, setActiveFeatureId] = useState(null);

  const activeFeature = useMemo(
    () => featureDefinitions.find((feature) => feature.id === activeFeatureId) || null,
    [activeFeatureId]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    if (activeFeatureId) {
      document.body.dataset.keyboardLock = 'true';
    } else {
      delete document.body.dataset.keyboardLock;
    }

    return () => {
      delete document.body.dataset.keyboardLock;
    };
  }, [activeFeatureId]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {featureDefinitions.map((feature) => {
          const Icon = feature.icon;
          const accent = accentClasses[feature.accent];

          return (
            <button
              key={feature.id}
              type="button"
              title={feature.title}
              aria-label={feature.title}
              onClick={() => setActiveFeatureId(feature.id)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800 bg-slate-900 text-slate-500 transition-all duration-300 shadow-inner ${accent.button} ${activeFeatureId === feature.id ? accent.active : ''}`}
            >
              <Icon size={18} />
              {feature.isPremium && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-red-500/40 bg-slate-950 text-red-300">
                  <Lock size={9} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeFeature && (
        <div
          className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveFeatureId(null);
            }
          }}
        >
          <div className={`mx-auto mt-4 mb-8 w-full rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden ${
            activeFeature.id === 'typing'
              ? 'max-w-6xl'
              : activeFeature.id === 'chat'
                ? 'max-w-6xl'
                : 'max-w-lg'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${accentClasses[activeFeature.accent].badge}`}>
                  <activeFeature.icon size={12} />
                  {activeFeature.shortLabel}
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.24em] text-white">
                  {activeFeature.label}
                </h2>
                {activeFeature.isPremium && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-red-300">
                    <Lock size={10} />
                    Access With Premium
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveFeatureId(null)}
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:text-white"
                aria-label={`Close ${activeFeature.label}`}
              >
                <X size={16} />
              </button>
            </div>

            {activeFeature.id === 'typing' ? (
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar p-6">
                <TypingTutorPanel />
              </div>
            ) : activeFeature.id === 'chat' ? (
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                <ChatroomPanel />
              </div>
            ) : (
              <div className="space-y-5 p-6">
                <p className="text-sm leading-relaxed text-slate-300">
                  {activeFeature.description}
                </p>

                {activeFeature.isPremium && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-slate-300">
                    This one stays visible on purpose, but the real controls will unlock with Premium once purchase access is wired in.
                  </div>
                )}

                <div className="space-y-3">
                  {activeFeature.details.map((detail) => (
                    <div
                      key={detail}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm leading-relaxed text-slate-400"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
