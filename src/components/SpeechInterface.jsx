'use client';
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function SpeechInterface({ targetWord, fullPhrase, onFeedbackReceived }) {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.speechRecognition)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.speechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = 'ru-RU';
      rec.continuous = false;
      
      rec.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsAnalyzing(true);
        
        try {
          const response = await fetch('/api/tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              target: targetWord, 
              transcript: transcript,
              fullPhrase: fullPhrase // Context added here
            }),
          });
          
          const data = await response.json();
          onFeedbackReceived(transcript, data.feedback);
        } catch (error) {
          console.error("Analysis Error:", error);
          onFeedbackReceived(transcript, "SIGNAL INTERFERENCE");
        } finally {
          setIsAnalyzing(false);
        }
      };

      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, [targetWord, fullPhrase, onFeedbackReceived]); // Added fullPhrase to dependencies

  const toggleMic = () => {
    if (isListening) { 
      recognition?.stop(); 
    } else { 
      // Reset state before starting to clear old feedback
      onFeedbackReceived('', 'Analyzing...'); 
      recognition?.start(); 
      setIsListening(true); 
    }
  };

  return (
    <button 
      onClick={toggleMic} 
      disabled={isAnalyzing} 
      className="group relative flex flex-col items-center"
      title={isListening ? "Stop Recording" : "Start Voice Analysis"}
    >
      <div className={`p-3 rounded-xl border transition-all duration-300 ${
        isListening 
          ? 'bg-red-500/20 border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
          : 'bg-slate-900 border-slate-700 hover:border-blue-500'
      }`}>
        {isAnalyzing ? (
          <Loader2 className="animate-spin text-blue-400" size={20} />
        ) : isListening ? (
          <Mic className="text-red-500" size={20} />
        ) : (
          <MicOff className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
        )}
      </div>

      {/* Optional: Visual cue for active word context */}
      {isListening && (
        <span className="absolute -top-8 text-[10px] text-red-400 font-bold tracking-widest uppercase animate-bounce">
          Rec: {targetWord}
        </span>
      )}
    </button>
  );
}
