'use client';
import React, { useState } from 'react';
import { Gamepad2, X } from 'lucide-react';

export default function GameOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Configuration for each game's unique dimensions
  const gameConfigs = {
    asteroids: {
      path: 'asteroids/index.html',
      width: 800,
      height: 600,
      title: '🚀 ASTEROIDS'
    },
    bricklayer: {
      path: 'bricklayer/index.html',
      width: 400, // Narrower
      height: 700, // Taller
      title: '🧱 BRICK LAYER'
    }
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
        <div className="p-3 rounded-xl border bg-slate-900 border-slate-700 hover:border-green-500 transition-all duration-300 shadow-inner">
          <Gamepad2 size={20} className="text-slate-500 group-hover:text-green-400 transition-colors" />
        </div>
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.target.id === 'modal-overlay' && closeGame()}
          id="modal-overlay"
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300 ease-in-out"
            style={{ 
              width: activeGame ? `${currentConfig.width}px` : '500px',
              height: activeGame ? 'auto' : '400px' 
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
              <h2 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase">
                {activeGame ? currentConfig.title : 'System Arcade'}
              </h2>
              <button onClick={closeGame} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center">
              {!activeGame ? (
                <div className="grid grid-cols-2 gap-4 p-8 w-full">
                  <button 
                    onClick={() => setActiveGame('asteroids')}
                    className="group bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-blue-600/20 hover:border-blue-500 transition-all"
                  >
                    <span className="text-3xl block mb-2">🚀</span>
                    <span className="font-bold text-xs tracking-widest uppercase">Asteroids</span>
                  </button>
                  <button 
                    onClick={() => setActiveGame('bricklayer')}
                    className="group bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-orange-600/20 hover:border-orange-500 transition-all"
                  >
                    <span className="text-3xl block mb-2">🧱</span>
                    <span className="font-bold text-xs tracking-widest uppercase">Brick Layer</span>
                  </button>
                </div>
              ) : (
                <div 
                  className="bg-black relative"
                  style={{ 
                    width: `${currentConfig.width}px`, 
                    height: `${currentConfig.height}px` 
                  }}
                >
                  <iframe 
                    src={`/games/${currentConfig.path}`}
                    className="w-full h-full"
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
