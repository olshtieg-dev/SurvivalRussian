import { useEffect, useState } from 'react';
import alphabetData from '../data/alphabet.json';

export const useKeyboard = (onKeyPress) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // 1. Get the character from the English key pressed
      const key = event.key.toLowerCase();
      const isSpace = key === ' ' || key === 'spacebar' || event.code === 'Space';
      
      // 2. Look it up in our JCUKEN map
      const mappedChar = alphabetData[key];

      // 3. If it exists, send the Cyrillic char back to our component
      if (mappedChar) {
        if (!isEditable) event.preventDefault();
        onKeyPress(mappedChar.cyrillic);
      } else if (isSpace) {
        if (!isEditable) event.preventDefault();
        onKeyPress(' '); // Handle spaces separately
      } else if (key === 'backspace') {
        if (!isEditable) event.preventDefault();
        onKeyPress('backspace');
      }
    };

    // Attach the listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup to prevent memory leaks
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);
};
