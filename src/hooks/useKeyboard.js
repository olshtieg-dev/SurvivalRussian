import { useEffect } from 'react'; 
import alphabetData from '../data/alphabet.json';

export const useKeyboard = (onKeyPress) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const { code, shiftKey } = event;

      // Helper for symbol/number mapping
      const codeToKeyMap = {
        "Semicolon": "Semicolon", "Quote": "Quote", "Comma": "Comma",
        "Period": "Period", "Slash": "Slash", "BracketLeft": "BracketLeft",
        "BracketRight": "BracketRight", "Backquote": "Backquote",
        "Digit1": "Digit1", "Digit2": "Digit2", "Digit3": "Digit3",
        "Digit4": "Digit4", "Digit5": "Digit5", "Digit6": "Digit6", "Digit7": "Digit7"
      };

      let lookupKey = code.startsWith("Key") 
        ? code.replace("Key", "").toLowerCase() 
        : codeToKeyMap[code];

      const mappedData = alphabetData[lookupKey];

      if (mappedData) {
        event.preventDefault();
        
        let charToSend;
        if (shiftKey) {
          // If it's a symbol with a specific 'shifted' version (like ! or ?)
          // otherwise, just uppercase the letter
          charToSend = mappedData.shifted || mappedData.cyrillic.toUpperCase();
        } else {
          charToSend = mappedData.cyrillic;
        }
        
        onKeyPress(charToSend);
      } else if (code === 'Space') {
        event.preventDefault();
        onKeyPress(' ');
      } else if (code === 'Backspace') {
        event.preventDefault();
        onKeyPress('backspace');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);
};