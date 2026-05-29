'use client';

// Phrase Lab — the working build of the former "AI Input" placeholder socket.
// Everything is client-side: drills and any staged vocab live in localStorage
// as plain JSON. Nothing is sent to a server, and stores are hard-capped.

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ClipboardCopy,
  Dice5,
  FlaskConical,
  Play,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import SentenceStructuralAnalysis from './SentenceStructuralAnalysis';
import {
  LIMITS,
  buildMissionFromPhrase,
  loadCustomDrillSets,
  loadTempVocabulary,
  sampleVocabulary,
  saveCustomDrillSets,
  saveTempVocabulary,
  searchVocabulary,
  tokenizePhrase,
  upsertTempVocabulary,
} from '../data/customDrills';

function makeSetId() {
  return `set-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;
}

function splitPhrases(draft) {
  return draft
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const TOKEN_STYLES = {
  deck: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100',
  temp: 'border-blue-500/40 bg-blue-950/40 text-blue-100',
  unknown: 'border-amber-500/40 bg-amber-950/30 text-amber-200 hover:bg-amber-900/40',
};

export default function AiInputPanel({ onPlaySet }) {
  // Panel only ever mounts client-side (inside the modal), so reading
  // localStorage in a lazy initializer is safe — no SSR hydration mismatch.
  const [savedSets, setSavedSets] = useState(loadCustomDrillSets);
  const [tempVocab, setTempVocab] = useState(loadTempVocabulary);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [staging, setStaging] = useState(null); // { cyrillic, literal, natural }
  const [copied, setCopied] = useState(false);

  const phrases = useMemo(() => splitPhrases(draft), [draft]);
  const previewMission = useMemo(
    () => (phrases[0] ? buildMissionFromPhrase(phrases[0], 0, 'PREVIEW', tempVocab) : null),
    [phrases, tempVocab]
  );
  const searchResults = useMemo(() => searchVocabulary(query, 18), [query]);

  const lineTokens = useMemo(
    () => phrases.slice(0, 8).map((line) => ({ line, tokens: tokenizePhrase(line, tempVocab) })),
    [phrases, tempVocab]
  );

  const unknownCount = useMemo(
    () =>
      lineTokens.reduce(
        (total, { tokens }) => total + tokens.filter((token) => !token.vocab).length,
        0
      ),
    [lineTokens]
  );

  // --- mutations (all persist to localStorage immediately) ---

  const appendWord = (word) => {
    setDraft((prev) => {
      if (!prev.trim()) return word;
      return prev.endsWith('\n') || prev.endsWith(' ') ? `${prev}${word}` : `${prev} ${word}`;
    });
  };

  const fillRandom = () => {
    const words = sampleVocabulary(8);
    setDraft((prev) => (prev.trim() ? `${prev.replace(/\s+$/, '')}\n${words.join(' ')}` : words.join(' ')));
  };

  const persistSets = (next) => setSavedSets(saveCustomDrillSets(next));

  const handleSave = () => {
    if (!phrases.length) return;
    const id = editingId || makeSetId();
    const set = { id, name: name.trim() || 'Untitled set', createdAt: Date.now(), phrases };
    const next = savedSets.some((s) => s.id === id)
      ? savedSets.map((s) => (s.id === id ? set : s))
      : [set, ...savedSets];
    persistSets(next.slice(0, LIMITS.sets));
    setEditingId(id);
  };

  const loadSet = (set) => {
    setEditingId(set.id);
    setName(set.name);
    setDraft(set.phrases.join('\n'));
  };

  const deleteSet = (id) => {
    persistSets(savedSets.filter((s) => s.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const newSet = () => {
    setEditingId(null);
    setName('');
    setDraft('');
  };

  const saveStaged = () => {
    if (!staging?.cyrillic?.trim()) return;
    const next = saveTempVocabulary(upsertTempVocabulary(tempVocab, staging));
    setTempVocab(next);
    setStaging(null);
  };

  const deleteStaged = (key) => {
    const next = { ...tempVocab };
    delete next[key];
    setTempVocab(saveTempVocabulary(next));
  };

  const exportJson = async () => {
    const usedTemp = {};
    phrases.forEach((line) =>
      tokenizePhrase(line, tempVocab).forEach((token) => {
        if (token.vocab?.isTemp) usedTemp[token.normalized] = token.vocab;
      })
    );
    const payload = JSON.stringify(
      { name: name.trim() || 'Untitled set', phrases, vocab: usedTemp },
      null,
      2
    );
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      // Clipboard may be blocked; ignore so the rest of the panel keeps working.
    }
  };

  const stagedEntries = Object.entries(tempVocab);

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2 text-blue-300">
          <FlaskConical size={18} />
        </div>
        <div>
          <p className="text-sm leading-relaxed text-slate-300">
            Compose custom drills from the vocabulary deck, or paste your own Russian. Everything
            stays on this device as JSON — sentences plus any words you stage by hand.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {savedSets.length}/{LIMITS.sets} sets · {stagedEntries.length}/{LIMITS.tempVocab} staged
            words · client-side only
          </p>
        </div>
      </header>

      {/* Builder */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={LIMITS.nameChars}
            placeholder="Set name (e.g. Café phrases)"
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={newSet}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-white"
          >
            <Plus size={13} /> New
          </button>
        </div>

        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={5}
          placeholder={'One phrase per line:\nЯ хочу кофе.\nГде метро?'}
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 font-mono text-sm text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fillRandom}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-blue-500/40 hover:text-blue-200"
          >
            <Dice5 size={13} /> Random 8
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!phrases.length}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-600/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 transition-colors hover:bg-emerald-600/25 disabled:opacity-30"
          >
            <Save size={13} /> {editingId ? 'Update set' : 'Save set'}
          </button>
          <button
            type="button"
            onClick={exportJson}
            disabled={!phrases.length}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white disabled:opacity-30"
          >
            {copied ? <Check size={13} className="text-emerald-300" /> : <ClipboardCopy size={13} />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <span className="ml-auto text-[10px] text-slate-500">
            {phrases.length}/{LIMITS.phrasesPerSet} phrases
          </span>
        </div>

        {/* Token validation */}
        {lineTokens.length > 0 && (
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              Coverage {unknownCount > 0 && <span className="text-amber-400">· {unknownCount} unmatched (click to stage)</span>}
            </p>
            <div className="space-y-1.5">
              {lineTokens.map(({ line, tokens }, lineIndex) => (
                <div key={lineIndex} className="flex flex-wrap gap-1.5">
                  {tokens.map((token, tokenIndex) => {
                    const kind = token.vocab ? (token.vocab.isTemp ? 'temp' : 'deck') : 'unknown';
                    return (
                      <button
                        key={tokenIndex}
                        type="button"
                        disabled={kind !== 'unknown'}
                        onClick={() => setStaging({ cyrillic: token.raw, literal: '', natural: '' })}
                        className={`rounded-md border px-2 py-0.5 font-mono text-xs ${TOKEN_STYLES[kind]} ${
                          kind === 'unknown' ? 'cursor-pointer' : 'cursor-default'
                        }`}
                        title={
                          kind === 'unknown'
                            ? 'Not in the deck — click to stage a quick gloss'
                            : token.vocab?.natural || token.vocab?.literal || ''
                        }
                      >
                        {token.raw}
                        {kind === 'unknown' && <AlertTriangle size={10} className="ml-1 inline" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            {phrases.length > 8 && (
              <p className="text-[10px] text-slate-600">Showing coverage for the first 8 phrases.</p>
            )}
          </div>
        )}

        {/* Inline stage-a-word form */}
        {staging && (
          <div className="space-y-2 rounded-xl border border-blue-500/30 bg-blue-950/20 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
              Stage word (saved locally as pending vocab)
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                value={staging.cyrillic}
                onChange={(event) => setStaging({ ...staging, cyrillic: event.target.value })}
                maxLength={LIMITS.fieldChars}
                placeholder="Cyrillic"
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5 font-mono text-sm text-white focus:border-blue-500/60 focus:outline-none"
              />
              <input
                value={staging.literal}
                onChange={(event) => setStaging({ ...staging, literal: event.target.value })}
                maxLength={LIMITS.fieldChars}
                placeholder="Literal"
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-white focus:border-blue-500/60 focus:outline-none"
              />
              <input
                value={staging.natural}
                onChange={(event) => setStaging({ ...staging, natural: event.target.value })}
                maxLength={LIMITS.fieldChars}
                placeholder="Natural"
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-white focus:border-blue-500/60 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveStaged}
                className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 hover:bg-blue-600/30"
              >
                <Check size={13} /> Stage
              </button>
              <button
                type="button"
                onClick={() => setStaging(null)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Word picker */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2">
          <Search size={14} className="text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the deck (Cyrillic prefix or English meaning)…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchResults.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => appendWord(entry.cyrillic)}
                title={entry.natural || entry.literal || ''}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-200 transition-colors hover:border-blue-500/40 hover:text-blue-200"
              >
                <span className="font-mono">{entry.cyrillic}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-500">{entry.literal || entry.natural}</span>
                <Plus size={11} className="text-slate-600" />
              </button>
            ))}
          </div>
        )}
        {query.trim() && searchResults.length === 0 && (
          <p className="text-[11px] text-slate-500">No deck matches. Type the word into a phrase and stage it above.</p>
        )}
      </section>

      {/* Live preview */}
      {previewMission && (
        <section>
          <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
            Preview — first phrase
          </p>
          <div className="scale-[0.96] origin-top">
            <SentenceStructuralAnalysis sentenceData={previewMission} />
          </div>
        </section>
      )}

      {/* Staged vocab */}
      {stagedEntries.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
            Pending vocab ({stagedEntries.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {stagedEntries.map(([key, entry]) => (
              <span
                key={key}
                className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-950/20 px-2.5 py-1 text-xs"
              >
                <span className="font-mono text-blue-100">{entry.cyrillic}</span>
                <span className="text-slate-500">{entry.natural || entry.literal}</span>
                <button
                  type="button"
                  onClick={() => deleteStaged(key)}
                  className="text-slate-600 hover:text-red-300"
                  aria-label={`Remove staged word ${entry.cyrillic}`}
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Saved sets */}
      <section className="space-y-2">
        <p className="px-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
          Saved sets ({savedSets.length})
        </p>
        {savedSets.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-[11px] text-slate-600">
            No saved sets yet. Compose phrases above and hit Save.
          </p>
        ) : (
          <div className="space-y-2">
            {savedSets.map((set) => (
              <div
                key={set.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                  editingId === set.id
                    ? 'border-blue-500/40 bg-blue-950/20'
                    : 'border-slate-800 bg-slate-950/50'
                }`}
              >
                <button type="button" onClick={() => loadSet(set)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-white">{set.name}</p>
                  <p className="text-[10px] text-slate-500">{set.phrases.length} phrases</p>
                </button>
                {onPlaySet && (
                  <button
                    type="button"
                    onClick={() => onPlaySet(set)}
                    title="Load into the typing surface"
                    className="rounded-lg border border-emerald-500/40 bg-emerald-600/15 p-1.5 text-emerald-300 hover:bg-emerald-600/25"
                  >
                    <Play size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteSet(set.id)}
                  title="Delete set"
                  className="rounded-lg border border-slate-700 p-1.5 text-slate-500 hover:text-red-300"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
