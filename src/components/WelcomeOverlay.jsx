'use client';

import React from 'react';
import { AudioLines, BrainCircuit, Keyboard, PanelLeftOpen, Play, Sparkles } from 'lucide-react';

const learningLoop = [
  {
    icon: Keyboard,
    label: 'Read / Write',
    description: 'See Cyrillic, type it exactly, and lock in symbol recall plus muscle memory.',
  },
  {
    icon: AudioLines,
    label: 'Listen / Speak',
    description: 'Hear the target, say it aloud, and get instant phonetic feedback.',
  },
  {
    icon: BrainCircuit,
    label: 'See / Think',
    description: 'Attach each word to meaning, image, and grammar so it becomes usable language.',
  },
];

const quickStart = [
  'Pick a lesson set on the left rail.',
  'Type the mission exactly as shown.',
  'Use the mic to test pronunciation when you are ready.',
];

export default function WelcomeOverlay({ onStart }) {
  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/92 backdrop-blur-md">
      <div className="relative min-h-screen px-6 py-10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_35%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8 shadow-[0_0_60px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-blue-300">
                  <Sparkles size={12} />
                  Triple-Threat Learning Loop
                </div>

                <h1 className="mt-5 max-w-xl text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
                  Read it. Write it. Hear it. Say it. See it. Think it.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  This app teaches Russian by hitting multiple dimensions of learning in unison, so every mission trains recognition, motor memory, pronunciation, meaning, and structure at the same time.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {learningLoop.map(({ icon: Icon, label, description }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40"
                    >
                      <Icon size={18} className="text-blue-400" />
                      <h2 className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-white">
                        {label}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-md rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_0_30px_rgba(37,99,235,0.08)]">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
                  <PanelLeftOpen size={12} />
                  Jump Right In
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
                      Free
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      FREE w/ ads
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      Keeps hosting afloat and gets people in the door.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
                      Premium
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      $X.YZ
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      Unlocks the heavier AI features that cost real money to run.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">
                    Premium Hook
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    Your speech is analyzed with modern Google AI speech-and-language tooling from the same world as live transcription, auto-dubbing, and translated media experiences.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Premium can lean into richer voice feedback, while the ad tier can still use browser speech-to-text handed off to AI for transcript-based coaching.
                  </p>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                  The simple version is honest: ads can help carry hosting, and premium helps cover the AI bill without turning the whole app into a pitch.
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  After you hit <span className="font-black text-white">Start / Старт</span>, the left taskbar opens with the lesson chooser, mic control, voice modes, and bonus tools so you can begin immediately.
                </p>

                <p className="mt-3 text-xs leading-relaxed uppercase tracking-[0.18em] text-slate-500">
                  Built to expand with your typing tutor, AI input, and chatroom.
                </p>

                <div className="mt-5 space-y-3">
                  {quickStart.map((step, index) => (
                    <div key={step} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-black text-blue-300">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onStart}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-400/40 bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] active:scale-[0.99]"
                >
                  <Play size={16} fill="currentColor" />
                  Start / Старт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
