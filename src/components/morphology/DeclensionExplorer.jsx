'use client';

// Trees module — an interactive Russian noun decliner. Pick a curated noun (or
// type any noun) and see the full 6-case × singular/plural paradigm with the
// case ending highlighted, stress marked, and the case's job spelled out.

import React, { useMemo, useState } from 'react';
import { Search, Sparkles, TriangleAlert } from 'lucide-react';
import {
  NOUN_BANK,
  NOUN_GROUPS,
  PATTERN_LABELS,
  STRESS_LABELS,
  declineCitation,
  splitStemEnding,
} from '../../data/morphology/decliner';
import { CASES, CASE_COLOR_CLASSES } from '../../data/morphology/cases';

const GENDER_LABEL = { m: 'masculine', f: 'feminine', n: 'neuter' };

function EndingCell({ form, bareStem, colorClass, active }) {
  if (!form) return <span className="text-slate-600">—</span>;
  const { stem, ending } = splitStemEnding(form, bareStem);
  return (
    <span className={`font-medium tracking-wide ${active ? 'text-white' : 'text-slate-200'}`}>
      <span>{stem}</span>
      {ending && (
        <span className={`font-black ${colorClass.ending} underline decoration-2 underline-offset-4`}>
          {ending}
        </span>
      )}
    </span>
  );
}

export default function DeclensionExplorer() {
  const [selectedKey, setSelectedKey] = useState('дом');
  const [customEntry, setCustomEntry] = useState(null);
  const [typed, setTyped] = useState('');
  const [genderHint, setGenderHint] = useState('f');
  const [animate, setAnimate] = useState(false);
  const [activeCase, setActiveCase] = useState('gen');

  const active = useMemo(() => {
    if (customEntry) return customEntry;
    return NOUN_BANK.find((n) => n.key === selectedKey) || NOUN_BANK[0];
  }, [customEntry, selectedKey]);

  const runCustom = () => {
    const word = typed.trim();
    if (!word) return;
    const result = declineCitation(word, { genderHint, animate });
    if (result) {
      setCustomEntry(result);
      setActiveCase('gen');
    }
  };

  const pickCurated = (key) => {
    setCustomEntry(null);
    setSelectedKey(key);
    setActiveCase('gen');
  };

  return (
    <div className="space-y-6">
      {/* Noun picker — curated chips grouped by gender, plus free input. */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-4">
          {NOUN_GROUPS.map((group) => (
            <div key={group}>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                {group}
              </p>
              <div className="flex flex-wrap gap-2">
                {NOUN_BANK.filter((n) => n.group === group).map((n) => {
                  const isActive = !customEntry && n.key === selectedKey;
                  return (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => pickCurated(n.key)}
                      className={`rounded-xl border px-3 py-1.5 text-sm transition-all ${
                        isActive
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                      title={n.gloss}
                    >
                      {n.key}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Free input */}
        <div className="mt-5 border-t border-slate-800 pt-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Decline any noun
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[12rem]">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runCustom()}
                placeholder="e.g. телефон, газета, письмо…"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
            <div className="flex overflow-hidden rounded-xl border border-slate-800">
              {['f', 'm'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderHint(g)}
                  title="Resolves nouns ending in -ь"
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    genderHint === g ? 'bg-slate-700 text-white' : 'bg-slate-950/70 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {g === 'f' ? 'fem' : 'masc'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAnimate((a) => !a)}
              title="Animate nouns take accusative = genitive"
              className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                animate
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                  : 'border-slate-800 bg-slate-950/70 text-slate-500 hover:text-slate-300'
              }`}
            >
              animate
            </button>
            <button
              type="button"
              onClick={runCustom}
              className="rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-200 transition-all hover:bg-emerald-600/30"
            >
              Decline
            </button>
          </div>
        </div>
      </div>

      {/* Active noun header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-3xl font-black text-white">{active.paradigm.sg.nom}</h3>
          {active.gloss && <span className="text-lg text-slate-300">{active.gloss}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 uppercase tracking-wide text-slate-300">
            {GENDER_LABEL[active.gender]}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 uppercase tracking-wide text-slate-300">
            {PATTERN_LABELS[active.pattern]}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 uppercase tracking-wide text-slate-300">
            {STRESS_LABELS[active.stress]}
          </span>
          {active.animate && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 uppercase tracking-wide text-emerald-300">
              animate
            </span>
          )}
        </div>
        {active.note && (
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{active.note}</p>
        )}
        {active.auto && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-amber-200/90">
            <TriangleAlert size={14} className="mt-0.5 shrink-0" />
            Auto-generated from the regular pattern. Stress and fleeting vowels
            (e.g. genitive plurals) may differ for irregular nouns — the curated
            words above are hand-checked.
          </p>
        )}
      </div>

      {/* Paradigm table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-900/80 text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <th className="px-4 py-3 font-black">Case</th>
              <th className="px-4 py-3 font-black">Singular</th>
              <th className="px-4 py-3 font-black">Plural</th>
            </tr>
          </thead>
          <tbody>
            {CASES.map((c) => {
              const color = CASE_COLOR_CLASSES[c.color];
              const isActive = activeCase === c.key;
              return (
                <tr
                  key={c.key}
                  onMouseEnter={() => setActiveCase(c.key)}
                  onClick={() => setActiveCase(c.key)}
                  className={`cursor-pointer border-t border-slate-800/70 transition-colors ${
                    isActive ? color.bg : 'bg-slate-950/40 hover:bg-slate-900/60'
                  }`}
                >
                  <td className="px-4 py-3 align-top">
                    <div className={`text-sm font-black ${color.text}`}>{c.label}</div>
                    <div className="mt-0.5 text-[11px] italic text-slate-500">{c.question}</div>
                  </td>
                  <td className="px-4 py-3 text-lg">
                    <EndingCell form={active.paradigm.sg[c.key]} bareStem={active.bareStem} colorClass={color} active={isActive} />
                  </td>
                  <td className="px-4 py-3 text-lg">
                    <EndingCell form={active.paradigm.pl[c.key]} bareStem={active.bareStem} colorClass={color} active={isActive} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Active-case explainer */}
      {(() => {
        const c = CASES.find((x) => x.key === activeCase);
        const color = CASE_COLOR_CLASSES[c.color];
        return (
          <div className={`rounded-2xl border p-5 ${color.border} ${color.bg}`}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className={color.text} />
              <h4 className={`text-sm font-black uppercase tracking-[0.24em] ${color.text}`}>
                {c.label} — {c.question}
              </h4>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{c.role}</p>
            {c.triggers.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Common triggers
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.triggers.map((t) => (
                    <span
                      key={t}
                      className={`rounded-lg border px-2.5 py-1 text-sm ${color.chip}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  e.g. <span className="text-slate-400">{c.triggerHint.replace('…', '')}</span>
                  <span className={`font-semibold ${color.text}`}>{active.paradigm.sg[c.key]}</span>
                </p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
