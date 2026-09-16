'use client';

import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import vocabularyData from '../data/vocabulary.json';

// --- Vocabulary lookup (mirrors normalizeVocabularyKey in page.js) ---------

function normalizeVocabularyKey(text) {
  if (typeof text !== 'string') return '';
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const vocabularyLookup = new Map(
  Object.keys(vocabularyData).map((key) => [normalizeVocabularyKey(key), key])
);

function lookupVocabulary(surface) {
  const norm = normalizeVocabularyKey(surface);
  if (!norm) return null;
  const key = vocabularyLookup.get(norm);
  return key ? vocabularyData[key] : null;
}

// Trim surrounding punctuation for display while keeping internal hyphens.
function cleanSurface(surface) {
  return surface.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '');
}

// --- fullAnalysis parsing (curated per-token gloss + strategic prose) -------

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

// --- POS classification -----------------------------------------------------
// Works on both curated per-token tags and vocabulary analysis prose, which
// often name other parts of speech incidentally ("intensifies adjectives",
// "with infinitive", "after prepositions"). Two rules keep it honest:
//   1. Nominal / function-word keywords win over verb person-tense markers,
//      so "1sg pers. pron." is a pronoun, not a verb. Among tier-1 keywords the
//      earliest one in the text wins, since an entry leads with its own POS.
//   2. An inflected form ("<case> of LEMMA") is classified by its lemma's own
//      entry, so "Nom. f. sg. of хороший" is an adjective even though the rest
//      of the sentence says "Modifies feminine nouns".

function scanPos(text) {
  const t = (text || '').toLowerCase();
  const tier1 = [
    ['conj', /\bconj\b|conjunction/],
    ['pron', /\bpron\b|pronoun/],
    ['particle', /\bparticle\b|\bptcl\b/],
    ['num', /\bnum\b|numeral/],
    ['prep', /preposition|\bprep\b/],
    ['adv', /\badv\b|adverb/],
    ['adj', /\badj\b|adjective/],
    ['noun', /proper noun|\bnoun\b/],
  ];
  let best = null;
  let bestIdx = Infinity;
  for (const [pos, re] of tier1) {
    const m = t.match(re);
    if (m && m.index < bestIdx) {
      bestIdx = m.index;
      best = pos;
    }
  }
  if (best) return best;
  if (/\bverb\b|\b(1sg|2sg|3sg|1pl|2pl|3pl)\b|\bimpf\b|\bperf\b|present|\bpres\b|past|future|\bfut\b|infinitive|\binf\b|imperative|\bimp\b/.test(t)) {
    return 'verb';
  }
  return null;
}

function classifyPos(rawTags) {
  const text = rawTags || '';
  const inflected = text.match(/\bof\s+([а-яё][а-яё-]*)/i);
  if (inflected) {
    const lemma = lookupVocabulary(inflected[1]);
    if (lemma && lemma.analysis && lemma.analysis !== text) {
      const fromLemma = scanPos(lemma.analysis);
      if (fromLemma) return fromLemma;
    }
  }
  return scanPos(text) || 'other';
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

// Build per-token chips from the raw phrase via the vocabulary. Used for every
// lesson that does not ship a curated Per-token gloss.
function buildTokensFromPhrase(phrase, focusNorm, senses) {
  if (typeof phrase !== 'string') return [];
  return phrase
    .split(/\s+/)
    .map((surface) => {
      const norm = normalizeVocabularyKey(surface);
      if (!norm) return null; // pure punctuation
      // Stress-homograph override: use the mission's chosen sense entry.
      const senseKey = senses && senses[norm];
      const entry = (senseKey && vocabularyData[senseKey]) || lookupVocabulary(surface);
      const display = entry?.cyrillic || cleanSurface(surface) || surface;
      return {
        token: display,
        tags: entry?.literal || '',
        pos: classifyPos(entry?.analysis || ''),
        isFocus: Boolean(focusNorm) && norm === focusNorm,
      };
    })
    .filter(Boolean);
}

// Word-by-word literal, joined from each token's gloss. Used as a fallback for
// lessons that ship no authored `literal` field (everything but the gulag set).
// Takes the first sense of multi-gloss entries ("still/more" -> "still").
function buildLiteralFromTokens(tokens) {
  const parts = tokens
    .map((tk) => (tk.tags || '').split(/\s*\/\s*/)[0].trim())
    .filter(Boolean);
  if (!parts.length) return '';
  const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
  const capped = joined.charAt(0).toUpperCase() + joined.slice(1);
  return /[.?!]$/.test(capped) ? capped : `${capped}.`;
}

function stripFocusWordPrefix(blurb, focusWord) {
  if (!blurb || !focusWord) return blurb;
  const escaped = focusWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${escaped}\\s+`, 'i');
  return blurb.replace(re, '').trim();
}

// --- Sub-renderers ----------------------------------------------------------

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
  const seen = new Set(tokens.map((tk) => tk.pos));
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

function TokenChip({ tk }) {
  return (
    <div
      className={`flex flex-col px-3 py-2 rounded-lg border max-w-[260px] ${POS_STYLES[tk.pos]} ${
        tk.isFocus ? 'ring-2 ring-emerald-400/70 shadow-lg shadow-emerald-500/10' : ''
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-base font-mono font-bold leading-tight break-words">
          {tk.token}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider opacity-60 flex-none">
          {POS_LABELS[tk.pos]}
        </span>
      </div>
      {tk.tags && (
        <span className="text-[10px] font-mono leading-snug mt-1 opacity-80">
          {tk.tags}
        </span>
      )}
    </div>
  );
}

// --- Main -------------------------------------------------------------------

export default function SentenceStructuralAnalysis({ sentenceData, lessonLabel, lessonDescription }) {
  const rawAnalysis = sentenceData?.fullAnalysis || '';
  const phrase = sentenceData?.phrase || '';
  const parsed = useMemo(() => parseFullAnalysis(rawAnalysis), [rawAnalysis]);

  // Focus word: per-mission first, else the lesson card's target word (label),
  // but only when the label is an actual Russian word we can gloss.
  const missionFocus = sentenceData?.focusWord || sentenceData?.word || '';
  const lessonFocus = useMemo(() => {
    if (!lessonLabel || !/[а-яё]/i.test(lessonLabel)) return '';
    const inVocab = lessonLabel
      .split(/\s*\/\s*/)
      .some((part) => lookupVocabulary(part));
    return inVocab ? lessonLabel : '';
  }, [lessonLabel]);
  const focusWord = missionFocus || lessonFocus;
  const focusNorm = normalizeVocabularyKey(focusWord.split(/\s*\/\s*/)[0] || '');

  // Per-token chips: prefer the curated gloss, otherwise generate from vocab.
  const tokens = useMemo(() => {
    if (parsed.mode === 'per-token' && parsed.tokens.length > 0) {
      return parsed.tokens.map((tk) => ({
        token: tk.token,
        tags: tk.tags,
        pos: classifyPos(tk.tags),
        isFocus: normalizeVocabularyKey(tk.token) === focusNorm && Boolean(focusNorm),
      }));
    }
    return buildTokensFromPhrase(phrase, focusNorm, sentenceData?.senses);
  }, [parsed, phrase, focusNorm, sentenceData?.senses]);

  if (!sentenceData) return null;

  const curatedBlurb = stripFocusWordPrefix(parsed.focusBlurb || '', focusWord);
  const focusEntry = focusWord ? lookupVocabulary(focusWord) : null;
  const blurb = curatedBlurb || focusEntry?.natural || focusEntry?.literal || lessonDescription || '';
  const literal =
    sentenceData.literal ||
    (parsed.mode !== 'per-token' ? buildLiteralFromTokens(tokens) : '');

  const hasDeeperAnalysis =
    (parsed.mode === 'per-token' && parsed.pedNote) ||
    ((parsed.mode === 'strategic' || parsed.mode === 'prose') && parsed.text);

  return (
    <div className="w-full max-w-4xl mt-12 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center gap-2 mb-3 px-2">
        <BookOpen size={16} className="text-emerald-400" />
        <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-[0.3em]">
          Sentence Breakdown
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

        {tokens.length > 0 && (
          <section>
            <SectionLabel color="blue">Per-token gloss</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {tokens.map((tk, i) => (
                <TokenChip key={i} tk={tk} />
              ))}
            </div>
            <PosLegend tokens={tokens} />
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

        {(parsed.mode === 'strategic' || parsed.mode === 'prose') && parsed.text && (
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
