'use client';

import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';

function parseFullAnalysis(rawAnalysis) {
  const text = typeof rawAnalysis === 'string' ? rawAnalysis.trim() : '';
  if (!text) return { mode: 'none' };

  const perTokenIdx = text.indexOf('Per-token:');
  if (perTokenIdx !== -1) {
    const opening = text.slice(0, perTokenIdx).trim();
    const focusBlurb = opening
      .replace(/^Focus word:\s*/i, '')
      .replace(/\.\s*$/, '')
      .trim();

    const afterPerToken = text.slice(perTokenIdx + 'Per-token:'.length).trim();
    const chunks = afterPerToken.split(/\s*\|\s*/);
    const tokens = [];
    let pedNote = '';

    chunks.forEach((chunk, idx) => {
      const isLast = idx === chunks.length - 1;
      if (isLast) {
        const breakMatch = chunk.match(/^(.+?\))\.\s*(.*)$/s);
        if (breakMatch) {
          tokens.push(parseTokenChunk(breakMatch[1]));
          pedNote = breakMatch[2].trim();
        } else {
          tokens.push(parseTokenChunk(chunk.replace(/\.\s*$/, '')));
        }
      } else {
        tokens.push(parseTokenChunk(chunk));
      }
    });

    return { mode: 'per-token', focusBlurb, tokens, pedNote };
  }

  if (/^Strategic focus:/i.test(text)) {
    return { mode: 'strategic', text };
  }

  const legacyMatch = text.match(/^Focus word:\s*([^.]+?)\.\s*Literal:\s*.+\.?\s*$/i);
  if (legacyMatch) {
    return { mode: 'legacy', focusBlurb: legacyMatch[1].trim() };
  }

  return { mode: 'prose', text };
}

function parseTokenChunk(rawChunk) {
  const chunk = rawChunk.trim();
  const m = chunk.match(/^(\S+)\s*\((.*)\)$/s);
  if (m) return { token: m[1], tags: m[2].trim() };
  return { token: chunk, tags: '' };
}

function classifyToken(tags) {
  const t = tags.toLowerCase();
  if (/\bverb\b|\b(1sg|2sg|3sg|1pl|2pl|3pl)\b|\bimpf\b|\bperf\b|\bpres\b|\bpast\b|\bfut\b|\binf\b|\bimp\b\.?/.test(t)) return 'verb';
  if (/proper noun|\bnoun\b/.test(t)) return 'noun';
  if (/\badj\b|adjective/.test(t)) return 'adj';
  if (/\bprep\b|preposition/.test(t)) return 'prep';
  if (/\bpron\b|pronoun/.test(t)) return 'pron';
  if (/\bconj\b|conjunction/.test(t)) return 'conj';
  if (/particle|\bptcl\b/.test(t)) return 'particle';
  if (/adverb|\badv\b/.test(t)) return 'adv';
  if (/numeral|\bnum\b/.test(t)) return 'num';
  return 'other';
}

const POS_STYLES = {
  verb:     'border-blue-500/40 bg-blue-950/40 text-blue-100',
  noun:     'border-emerald-500/40 bg-emerald-950/40 text-emerald-100',
  adj:      'border-amber-500/40 bg-amber-950/40 text-amber-100',
  prep:     'border-rose-500/40 bg-rose-950/40 text-rose-100',
  pron:     'border-purple-500/40 bg-purple-950/40 text-purple-100',
  conj:     'border-slate-500/40 bg-slate-800/50 text-slate-100',
  particle: 'border-fuchsia-500/40 bg-fuchsia-950/40 text-fuchsia-100',
  adv:      'border-cyan-500/40 bg-cyan-950/40 text-cyan-100',
  num:      'border-orange-500/40 bg-orange-950/40 text-orange-100',
  other:    'border-slate-600/40 bg-slate-900/50 text-slate-200',
};

const POS_LABELS = {
  verb: 'VERB', noun: 'NOUN', adj: 'ADJ', prep: 'PREP',
  pron: 'PRON', conj: 'CONJ', particle: 'PRTCL', adv: 'ADV',
  num: 'NUM', other: 'TOK',
};

function stripFocusWordPrefix(blurb, focusWord) {
  if (!blurb || !focusWord) return blurb;
  const escaped = focusWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${escaped}\\s+`, 'i');
  return blurb.replace(re, '').trim();
}

function ProseAnalysis({ text }) {
  // Detect numbered list ("1. ... 2. ... 3. ...") and render as ordered list
  const numberedMatches = text.match(/\d+\.\s+[^]+?(?=\s+\d+\.\s+|$)/g);
  if (numberedMatches && numberedMatches.length >= 2) {
    const intro = text.slice(0, text.indexOf(numberedMatches[0])).trim();
    return (
      <div className="space-y-3">
        {intro && (
          <p className="text-slate-300 leading-relaxed text-sm">{intro}</p>
        )}
        <ol className="space-y-2 text-slate-300 leading-relaxed text-sm list-none">
          {numberedMatches.map((item, i) => {
            const cleaned = item.replace(/^\d+\.\s+/, '').replace(/\s+$/, '');
            return (
              <li key={i} className="flex gap-3">
                <span className="text-emerald-400 font-mono text-[10px] mt-1 flex-none font-black">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{cleaned}</span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
  return <p className="text-slate-300 leading-relaxed text-sm">{text}</p>;
}

function SectionLabel({ children, color = 'emerald' }) {
  const colorClass = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    slate: 'text-slate-400',
  }[color] || 'text-emerald-400';
  return (
    <h5 className={`${colorClass} font-black uppercase text-[10px] tracking-[0.3em] mb-2`}>
      {children}
    </h5>
  );
}

function PosLegend({ tokens }) {
  const seen = new Set(tokens.map((tk) => classifyToken(tk.tags)));
  const order = ['noun', 'verb', 'adj', 'pron', 'prep', 'conj', 'particle', 'adv', 'num', 'other'];
  const present = order.filter((pos) => seen.has(pos));
  if (present.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 px-1">
      {present.map((pos) => (
        <span key={pos} className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider opacity-60">
          <span className={`inline-block w-2 h-2 rounded-sm border ${POS_STYLES[pos]}`} />
          {POS_LABELS[pos]}
        </span>
      ))}
    </div>
  );
}

export default function SentenceStructuralAnalysis({ sentenceData }) {
  const rawAnalysis = sentenceData?.fullAnalysis || '';
  const parsed = useMemo(() => parseFullAnalysis(rawAnalysis), [rawAnalysis]);

  if (!sentenceData) return null;

  const focusWord = sentenceData.focusWord || sentenceData.word || '';
  const literal = sentenceData.literal || '';
  const blurb = stripFocusWordPrefix(parsed.focusBlurb || '', focusWord);

  return (
    <div className="w-full max-w-4xl mt-12 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center gap-2 mb-3 px-2">
        <BookOpen size={16} className="text-emerald-400" />
        <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-[0.3em]">
          Mission Structural Intel
        </h4>
      </div>

      <div className="bg-emerald-900/5 border border-emerald-500/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">

        {(focusWord || blurb) && (
          <section>
            <SectionLabel color="emerald">Focus word</SectionLabel>
            <div className="flex items-baseline gap-3 flex-wrap">
              {focusWord && (
                <span className="text-3xl font-mono text-emerald-200 leading-none">
                  {focusWord}
                </span>
              )}
              {blurb && (
                <span className="text-xs font-mono text-slate-400 italic leading-snug">
                  {blurb}
                </span>
              )}
            </div>
          </section>
        )}

        {parsed.mode === 'per-token' && parsed.tokens.length > 0 && (
          <section>
            <SectionLabel color="blue">Per-token gloss</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {parsed.tokens.map((tk, i) => {
                const pos = classifyToken(tk.tags);
                return (
                  <div
                    key={i}
                    className={`flex flex-col px-3 py-2 rounded-lg border max-w-[260px] ${POS_STYLES[pos]}`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-base font-mono font-bold leading-tight break-words">
                        {tk.token}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider opacity-60 flex-none">
                        {POS_LABELS[pos]}
                      </span>
                    </div>
                    {tk.tags && (
                      <span className="text-[10px] font-mono leading-snug mt-1 opacity-80">
                        {tk.tags}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <PosLegend tokens={parsed.tokens} />
          </section>
        )}

        {parsed.mode === 'per-token' && parsed.pedNote && (
          <section>
            <SectionLabel color="amber">Structural note</SectionLabel>
            <p className="text-slate-300 leading-relaxed text-sm italic">
              {parsed.pedNote}
            </p>
          </section>
        )}

        {(parsed.mode === 'strategic' || parsed.mode === 'prose') && (
          <section>
            <SectionLabel color="amber">Analysis</SectionLabel>
            <ProseAnalysis text={parsed.text} />
          </section>
        )}

        {literal && (
          <section>
            <SectionLabel color="slate">Literal</SectionLabel>
            <p className="text-slate-200 leading-relaxed text-base font-mono italic">
              {literal}
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
