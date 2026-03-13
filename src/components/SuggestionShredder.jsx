'use client';
import React, { useState, useEffect } from 'react';
import { Trash2, X, Terminal } from 'lucide-react';

export default function SuggestionShredder() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [publicIp, setPublicIp] = useState("fetching...");
  
  // New states for the dramatic loading effect
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setPublicIp(data.ip))
      .catch(() => setPublicIp("127.0.0.1"));
  }, []);

  const generateFakeMac = () => {
    const hexDigits = "0123456789ABCDEF";
    let macAddress = "";
    for (let i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
      macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
      if (i !== 5) macAddress += ":";
    }
    return macAddress;
  };

  const handleShred = () => {
    if (!suggestion.trim()) return; // Don't shred empty air
    
    setIsProcessing(true);
    let currentProgress = 0;

    // The fake crunching interval
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5; // Random jumps
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        
        // Slight delay after 100% for maximum suspense
        setTimeout(() => {
          executeBan();
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, 200);
  };

  const executeBan = () => {
    const mac = generateFakeMac();
    
    alert(
      `THANK YOU FOR YOUR SUGGESTION!\n\n` +
      `System: DATA_NULLIFIED\n` +
      `Status: YOU ARE NOW IN GULAG\n\n` +
      `Your Public IP: ${publicIp}\n` +
      `Device MAC: ${mac}\n\n` +
      `ACCESS PERMANENTLY REVOKED.`
    );
    
    // The great reset
    setSuggestion("");
    setIsProcessing(false);
    setProgress(0);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col items-center"
        title="Submit Feedback"
      >
        <div className="p-3 rounded-xl border bg-slate-900 border-slate-700 hover:border-red-500 transition-all duration-300 shadow-inner">
          <img 
            src="/shredder-icon.png" 
            alt="shred" 
            className="w-5 h-5 invert opacity-60 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" 
          />
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            
            <div className="flex justify-between items-center mb-4 z-10 relative">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Feedback Terminal</h3>
              </div>
              {!isProcessing && (
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
            
            {!isProcessing ? (
              // Normal Input State
              <div className="animate-in fade-in duration-300">
                <textarea 
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Enter suggestion to be processed..."
                  className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-blue-400 focus:outline-none focus:border-red-500/50 transition-colors resize-none custom-scrollbar"
                />
                <button 
                  onClick={handleShred}
                  className="w-full mt-4 py-3 bg-red-950/30 border border-red-900/50 text-red-500 font-black uppercase text-[10px] tracking-[.2em] hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-400 transition-all rounded-lg"
                >
                  Submit to Shredder
                </button>
              </div>
            ) : (
              // Processing / Shredding State
              <div className="h-44 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
               {/* Replace <Trash2 size={32} ... /> with this: */}
<img 
  src="/shredder-icon.png" 
  alt="processing" 
  className="w-8 h-8 invert brightness-150 animate-pulse" 
/>
                <div className="w-full px-8">
                  <div className="flex justify-between text-[9px] font-mono text-red-400 mb-1 uppercase tracking-widest">
                    <span>Nullifying Data</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-red-500/70 font-mono uppercase tracking-widest animate-pulse mt-2">
                  Tracing network routes...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
