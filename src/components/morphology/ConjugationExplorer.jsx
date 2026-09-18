'use client';

// Verb Conjugation module — an exploratory verb trainer. Pick a verb and step
// through natural example sentences that show it in different forms, each with a
// subtle interlinear gloss and the verb form highlighted. The full paradigm table
// is kept as a collapsible reference underneath.

import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, ChevronDown, Table2 } from 'lucide-react';
import {
  VERB_BANK,
  VERB_BANK_BY_KEY,
  VERB_GROUPS,
  ASPECT_LABELS,
  CONJ_TYPE_LABELS,
  PERSON_ROWS,
  PAST_ROWS,
  stripAcute,
} from '../../data/morphology/conjugator';
import { VERB_EXAMPLES } from '../../data/morphology/verb-examples';
import Interlinear from './Interlinear';

const ASPECT_CHIP = {
  impf: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  perf: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
};

// Highlight the personal ending inside a conjugated form for the paradigm table.
function splitEnding(form, bareInfinitive) {
  if (!form || form.includes(' ')) return { stem: form, ending: '' };
  const bare = stripAcute(form);
  const infStem = bareInfinitive.replace(/(ться|ть|ти|чь)$/u, '');
  let i = 0;
  while (i < bare.length && i < infStem.length && bare[i] === infStem[i]) i += 1;
  if (i < 2) return { stem: form, ending: '' };
  let bareCount = 0;
  let cut = 0;
  for (; cut < form.length; cut += 1) {
    if (form[cut] === '́') continue;
    if (bareCount === i) break;
    bareCount += 1;
  }
  return { stem: form.slice(0, cut), ending: form.slice(cut) };
}

function FormCell({ form, bareInfinitive, endingClass = 'text-rose-300' }) {
  if (!form) return <span className="text-slate-600">—</span>;
  const { stem, ending } = splitEnding(form, bareInfinitive);
  return (
    <span className="font-medium tracking-wide text-slate-100">
      <span>{stem}</span>
      {ending && (
        <span className={`font-black ${endingClass} underline decoration-2 underline-offset-4`}>{ending}</span>
      )}
    </span>
  );
}

export default function ConjugationExplorer() {
  const [selectedKey, setSelectedKey] = useState('писать');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const verb = useMemo(() => VERB_BANK_BY_KEY[selectedKey] || VERB_BANK[0], [selectedKey]);
  const examples = VERB_EXAMPLES[verb.key] || [];
  const example = examples[Math.min(exampleIdx, Math.max(examples.length - 1, 0))];

  const pick = (key) => {
    setSelectedKey(key);
    setExampleIdx(0);
  };

  const { forms } = verb;
  const bareInf = stripAcute(verb.infinitive);
  const partner = verb.partner ? VERB_BANK_BY_KEY[verb.partner] : null;
  const conjugatedLabel = verb.aspect === 'perf' ? 'Future (simple)' : 'Present';
  const conjugatedSet = verb.aspect === 'perf' ? forms.future : forms.present;

  return (
    <div className="space-y-6">
      {/* Verb picker */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-4">
          {VERB_GROUPS.map((group) => (
            <div key={group}>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{group}</p>
              <div className="flex flex-wrap gap-2">
                {VERB_BANK.filter((v) => v.group === group).map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => pick(v.key)}
                    title={v.gloss}
                    className={`rounded-xl border px-3 py-1.5 text-sm transition-all ${
                      v.key === selectedKey
                        ? 'border-rose-500/50 bg-rose-500/15 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active verb header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-3xl font-black text-white">{verb.infinitive}</h3>
          {verb.gloss && <span className="text-lg text-slate-300">{verb.gloss}</span>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className={`rounded-full border px-3 py-1 uppercase tracking-wide ${ASPECT_CHIP[verb.aspect]}`}>
            {ASPECT_LABELS[verb.aspect]}
          </span>
          {CONJ_TYPE_LABELS[verb.type] && (
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 uppercase tracking-wide text-slate-300">
              {CONJ_TYPE_LABELS[verb.type]}
            </span>
          )}
          {partner && (
            <button
              type="button"
              onClick={() => pick(partner.key)}
              title={`Aspect partner (${ASPECT_LABELS[partner.aspect]})`}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 uppercase tracking-wide text-slate-300 transition-colors hover:border-rose-500/40 hover:text-white"
            >
              <ArrowLeftRight size={11} />
              {partner.infinitive}
            </button>
          )}
        </div>
        {verb.note && <p className="mt-3 text-sm leading-relaxed text-slate-400">{verb.note}</p>}
      </div>

      {/* Example-sentence explorer — the primary surface */}
      {example && (
        <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-6">
          <div className="flex items-center justify-between">
            <span className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-rose-200">
              {example.formLabel}
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {exampleIdx + 1} / {examples.length}
            </span>
          </div>

          <div className="mt-5">
            <Interlinear sentence={example.ru} highlight={example.target} highlightClass="text-rose-300" />
          </div>
          <p className="mt-4 border-t border-slate-800 pt-3 text-sm italic text-slate-400">{example.en}</p>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setExampleIdx((i) => Math.max(0, i - 1))}
              disabled={exampleIdx === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-slate-300 transition-all hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={15} /> Prev
            </button>
            {/* Dots for the forms */}
            <div className="flex gap-1.5">
              {examples.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setExampleIdx(i)}
                  aria-label={`Example ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === exampleIdx ? 'bg-rose-400' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setExampleIdx((i) => Math.min(examples.length - 1, i + 1))}
              disabled={exampleIdx >= examples.length - 1}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-rose-200 transition-all hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Full paradigm — collapsible reference */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          className="flex w-full items-center justify-between bg-slate-900/70 px-4 py-3 text-left transition-colors hover:bg-slate-900"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
            <Table2 size={14} /> Full paradigm
          </span>
          <ChevronDown size={16} className={`text-slate-500 transition-transform ${showTable ? 'rotate-180' : ''}`} />
        </button>

        {showTable && (
          <div className="space-y-4 p-4">
            {/* Present / simple-future */}
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <div className="flex items-center justify-between bg-slate-900/60 px-4 py-2">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">{conjugatedLabel}</span>
                {verb.aspect === 'perf' && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">perfective — no present</span>
                )}
              </div>
              <table className="w-full border-collapse text-left">
                <tbody>
                  {conjugatedSet ? (
                    PERSON_ROWS.map((r) => (
                      <tr key={r.key} className="border-t border-slate-800/70 bg-slate-950/40">
                        <td className="w-32 px-4 py-2 text-sm text-slate-400">
                          <span className="text-slate-200">{r.pronoun}</span>
                        </td>
                        <td className="px-4 py-2 text-lg">
                          <FormCell form={conjugatedSet[r.key]} bareInfinitive={bareInf} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-slate-800/70 bg-slate-950/40">
                      <td className="px-4 py-3 text-sm italic text-slate-500">Defective present — only future and past exist.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Past */}
              <div className="overflow-hidden rounded-xl border border-slate-800">
                <div className="bg-slate-900/60 px-4 py-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Past</span>
                </div>
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {PAST_ROWS.map((r) => (
                      <tr key={r.key} className="border-t border-slate-800/70 bg-slate-950/40">
                        <td className="w-32 px-4 py-2 text-sm text-slate-400">
                          <span className="text-slate-200">{r.pronoun}</span>
                        </td>
                        <td className="px-4 py-2 text-lg">
                          <FormCell form={forms.past[r.key]} bareInfinitive={bareInf} endingClass="text-amber-300" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Future */}
              <div className="overflow-hidden rounded-xl border border-slate-800">
                <div className="flex items-center justify-between bg-slate-900/60 px-4 py-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">Future</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {forms.futureCompound ? 'compound' : 'simple'}
                  </span>
                </div>
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {PERSON_ROWS.map((r) => (
                      <tr key={r.key} className="border-t border-slate-800/70 bg-slate-950/40">
                        <td className="w-24 px-4 py-2 text-sm text-slate-400">
                          <span className="text-slate-200">{r.pronoun}</span>
                        </td>
                        <td className="px-4 py-2 text-lg">
                          {forms.futureCompound ? (
                            <span className="text-slate-100">{forms.future[r.key]}</span>
                          ) : (
                            <FormCell form={forms.future[r.key]} bareInfinitive={bareInf} endingClass="text-emerald-300" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Imperative */}
            {forms.imperative && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">Imperative</span>
                <div className="mt-2 flex flex-wrap gap-6 text-lg">
                  <div>
                    <span className="text-sm text-slate-500">ты — </span>
                    <FormCell form={forms.imperative.sg} bareInfinitive={bareInf} />
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">вы — </span>
                    <FormCell form={forms.imperative.pl} bareInfinitive={bareInf} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
