'use client';

// Shared interlinear-gloss renderer for the Morphology Lab. Lays a sentence out
// word-by-word with a subtle English gloss beneath each token (sourced from
// vocabulary.json via gloss.js), and optionally highlights one target word.

import React from 'react';
import { glossSentence, normalizeVocabularyKey } from '../../data/morphology/gloss';

export default function Interlinear({
  sentence,
  highlight,
  highlightClass = 'text-rose-300',
  size = 'text-2xl',
}) {
  const tokens = glossSentence(sentence);
  const hl = highlight ? normalizeVocabularyKey(highlight) : null;

  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
      {tokens.map((t, i) => {
        const isHighlight = hl && t.key === hl;
        return (
          <span key={i} className="inline-flex flex-col items-center">
            <span className={`${size} leading-tight ${isHighlight ? `${highlightClass} font-black` : 'text-slate-100'}`}>
              {t.text}
            </span>
            {t.gloss && (
              <span className={`mt-1 text-[10px] leading-tight tracking-wide ${isHighlight ? 'text-slate-300' : 'text-slate-500'}`}>
                {t.gloss}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
