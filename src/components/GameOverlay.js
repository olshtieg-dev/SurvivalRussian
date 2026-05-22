'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Gamepad2, X } from 'lucide-react';

const DurakBoard = dynamic(() => import('./DurakBoard'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-8 text-sm text-slate-400">
      Loading Durak...
    </div>
  ),
});

export default function GameOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const gameConfigs = {
    asteroids: {
      path: 'asteroids/index.html',
      width: 800,
      height: 600,
      title: 'ASTEROIDS',
    },
    bricklayer: {
      path: 'bricklayer/index.html',
      width: 400,
      height: 700,
      title: 'BRICK LAYER',
    },
    cardclash: {
      width: 1080,
      height: 840,
      title: 'DURAK',
    },
  };

  const closeGame = () => {
    setIsOpen(false);
    setActiveGame(null);
  };

  const currentConfig = activeGame ? gameConfigs[activeGame] : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col items-center"
        title="Play Games"
      >
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-inner transition-all duration-300 hover:border-green-500">
          <Gamepad2 size={20} className="text-slate-500 transition-colors group-hover:text-green-400" />
        </div>
      </button>

      {isOpen && (
        <div
          id="modal-overlay"
          onClick={(e) => e.target.id === 'modal-overlay' && closeGame()}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 ease-in-out flex flex-col"
            style={{
              width: activeGame
                ? activeGame === 'cardclash'
                  ? 'min(1100px, calc(100vw - 2rem))'
                  : `${currentConfig.width}px`
                : '500px',
              height: activeGame
                ? activeGame === 'cardclash'
                  ? 'min(92vh, 900px)'
                  : `${currentConfig.height}px`
                : '400px',
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-4 shrink-0">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                {activeGame ? currentConfig.title : 'System Arcade'}
              </h2>
              <button onClick={closeGame} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-stretch justify-stretch overflow-hidden">
              {!activeGame ? (
                <div className="grid w-full grid-cols-1 gap-4 overflow-y-auto p-8 pb-10 sm:grid-cols-3">
                  <button
                    onClick={() => setActiveGame('asteroids')}
                    className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-blue-500 hover:bg-blue-600/20"
                  >
                    <span className="mb-2 block text-3xl">🚀</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Asteroids</span>
                  </button>
                  <button
                    onClick={() => setActiveGame('bricklayer')}
                    className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-orange-500 hover:bg-orange-600/20"
                  >
                    <span className="mb-2 block text-3xl">🧱</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Brick Layer</span>
                  </button>
                  <button
                    onClick={() => setActiveGame('cardclash')}
                    className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-emerald-500 hover:bg-emerald-600/20"
                  >
                    <span className="mb-2 block text-3xl">🃏</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Durak</span>
                    <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-300">
                      Multiplayer websocket
                    </span>
                  </button>
                </div>
              ) : activeGame === 'cardclash' ? (
                <div className="flex-1 min-h-0 w-full overflow-y-auto p-6 pb-20 sm:p-8">
                  <div className="min-h-full pb-16">
                    <DurakBoard />
                  </div>
                </div>
              ) : (
                <div
                  className="relative bg-black overflow-y-auto"
                  style={{
                    width: `${currentConfig.width}px`,
                    height: `${currentConfig.height}px`,
                  }}
                >
                  <iframe
                    src={`/games/${currentConfig.path}`}
                    className="h-full w-full"
                    frameBorder="0"
                    scrolling="no"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
