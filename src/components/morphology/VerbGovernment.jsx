'use client';

// Verb Government module — a guided exposé of Russian rection: the verb decides
// the case of its object(s), so swapping the verb re-inflects everything
// downstream. Two modes:
//   • Walkthrough — a four-act guided tour (verb → object case, two objects at
//     once, and the contrast with subject agreement).
//   • Free build  — pick any subject, verb, and object(s) and watch the sentence
//     assemble with the governed endings live.

import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Link2, Route, SlidersHorizontal } from 'lucide-react';
import { GOV_SCENES, GOV_SUBJECTS, GOV_VERBS, buildSentence, resolveScene } from '../../data/morphology/government';
import { CASE_BY_KEY, CASE_COLOR_CLASSES } from '../../data/morphology/cases';
import { NOUN_BANK, NOUN_GROUPS } from '../../data/morphology/decliner';

// Inline sentence text: subject + verb + governed objects, each object ending
// highlighted in its own case colour. In agreement scenes the VERB ending is the
// highlighted piece instead, and the (unchanging) objects are held steady.
function SentencePhrase({ sentence, highlightVerb = false, active = true, size = 'text-xl' }) {
  if (!sentence) return null;
  return (
    <span className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${size}`}>
      <span className={active ? 'text-slate-200' : 'text-slate-400'}>{sentence.subjectDisplay}</span>
      <span className={active ? 'font-semibold text-white' : 'text-slate-300'}>
        {highlightVerb ? (
          <>
            <span>{sentence.verbStem}</span>
            {sentence.verbEnding && (
              <span className="font-black text-emerald-300 underline decoration-2 underline-offset-4">
                {sentence.verbEnding}
              </span>
            )}
          </>
        ) : (
          sentence.verbForm
        )}
      </span>
      {sentence.objects.map((o, i) => {
        const color = CASE_COLOR_CLASSES[o.caseInfo.color];
        return (
          <React.Fragment key={i}>
            {o.prep && <span className={active ? 'text-slate-300' : 'text-slate-500'}>{o.prep}</span>}
            <span className={active ? 'text-slate-100' : 'text-slate-400'}>
              <span>{o.stem}</span>
              {o.ending && (
                <span
                  className={`font-black underline decoration-2 underline-offset-4 ${
                    highlightVerb && !active ? 'text-slate-500' : color.ending
                  }`}
                >
                  {o.ending}
                </span>
              )}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}

function CaseChips({ objects, useLabel = false }) {
  return (
    <span className="flex shrink-0 flex-wrap gap-1">
      {objects.map((o, i) => {
        const color = CASE_COLOR_CLASSES[o.caseInfo.color];
        return (
          <span
            key={i}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${color.chip}`}
          >
            {useLabel ? o.caseInfo.label : o.caseInfo.abbr}
          </span>
        );
      })}
    </span>
  );
}

// --- Walkthrough mode -------------------------------------------------------

function SentenceRow({ resolved, vary, active, onClick }) {
  const s = resolved.sentence;
  if (!s) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left transition-all ${
        active ? 'border-sky-500/50 bg-sky-500/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-600'
      }`}
    >
      <span className="flex-1">
        <SentencePhrase sentence={s} highlightVerb={vary === 'subject'} active={active} />
      </span>
      <CaseChips objects={s.objects} />
    </button>
  );
}

function Walkthrough() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const scene = GOV_SCENES[sceneIdx];
  const resolved = useMemo(() => resolveScene(scene), [scene]);
  const active = resolved[stepIdx];
  const activeSentence = active?.sentence;

  const gotoScene = (i) => {
    setSceneIdx(i);
    setStepIdx(0);
  };

  const step = (dir) => {
    const nextStep = stepIdx + dir;
    if (nextStep >= 0 && nextStep < resolved.length) {
      setStepIdx(nextStep);
    } else if (dir > 0 && sceneIdx < GOV_SCENES.length - 1) {
      setSceneIdx(sceneIdx + 1);
      setStepIdx(0);
    } else if (dir < 0 && sceneIdx > 0) {
      setSceneIdx(sceneIdx - 1);
      setStepIdx(GOV_SCENES[sceneIdx - 1].steps.length - 1);
    }
  };

  const isFirst = sceneIdx === 0 && stepIdx === 0;
  const isLast = sceneIdx === GOV_SCENES.length - 1 && stepIdx === resolved.length - 1;

  return (
    <div className="space-y-6">
      {/* Scene tabs */}
      <div className="flex flex-wrap gap-2">
        {GOV_SCENES.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => gotoScene(i)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-black uppercase tracking-[0.16em] transition-all ${
              i === sceneIdx
                ? 'border-sky-500/50 bg-sky-500/15 text-white'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {i + 1}. {sc.title}
          </button>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-slate-300">{scene.lede}</p>

      {/* The ladder of sentences */}
      <div className="space-y-2">
        {resolved.map((r, i) => (
          <SentenceRow key={i} resolved={r} vary={scene.vary} active={i === stepIdx} onClick={() => setStepIdx(i)} />
        ))}
      </div>

      {/* Active beat */}
      {activeSentence && (
        <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-white">{activeSentence.verbInfinitive}</span>
            <span className="text-xs text-slate-500">({activeSentence.verbGloss}) governs</span>
            <CaseChips objects={activeSentence.objects} useLabel />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{active.beat}</p>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={isFirst}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-black uppercase tracking-[0.16em] text-slate-300 transition-all hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft size={15} /> Prev
        </button>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Act {sceneIdx + 1} · step {stepIdx + 1} / {resolved.length}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={isLast}
          className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-sm font-black uppercase tracking-[0.16em] text-sky-200 transition-all hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// --- Free-build mode --------------------------------------------------------

// Group the government verbs for the picker: one bucket per governed case, then a
// "Two objects" bucket for the ditransitives.
const CASE_GROUP_ORDER = ['acc', 'dat', 'gen', 'ins', 'pre'];
const CASE_GROUP_LABEL = {
  acc: '+ Accusative',
  dat: '+ Dative',
  gen: '+ Genitive',
  ins: '+ Instrumental',
  pre: '+ Prepositional',
};

const VERB_GROUPS = (() => {
  const singles = GOV_VERBS.filter((v) => v.slots === 1);
  const groups = CASE_GROUP_ORDER.map((c) => ({
    label: CASE_GROUP_LABEL[c],
    verbs: singles.filter((v) => v.cases[0] === c),
  })).filter((g) => g.verbs.length);
  const two = GOV_VERBS.filter((v) => v.slots === 2);
  if (two.length) groups.push({ label: 'Two objects', verbs: two });
  return groups;
})();

function FreeBuild() {
  const [person, setPerson] = useState('sg1');
  const [verbKey, setVerbKey] = useState('давать');
  const [nouns, setNouns] = useState(['брат', 'книга']);

  const verb = GOV_VERBS.find((v) => v.key === verbKey) || GOV_VERBS[0];
  const usedNouns = nouns.slice(0, verb.slots);
  const sentence = buildSentence({ person, verb: verbKey, nouns: usedNouns });

  const setNoun = (i, key) => setNouns((prev) => prev.map((n, idx) => (idx === i ? key : n)));

  return (
    <div className="space-y-6">
      {/* Subject */}
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Subject</p>
        <div className="flex flex-wrap gap-2">
          {GOV_SUBJECTS.map((s) => (
            <button
              key={s.person}
              type="button"
              onClick={() => setPerson(s.person)}
              className={`rounded-xl border px-3.5 py-1.5 text-sm transition-all ${
                person === s.person
                  ? 'border-sky-500/50 bg-sky-500/15 text-white'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              {s.display}
            </button>
          ))}
        </div>
      </div>

      {/* Verb */}
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Verb (and the case it governs)</p>
        <div className="flex flex-col gap-3">
          {VERB_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.verbs.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setVerbKey(v.key)}
                    title={v.gloss}
                    className={`rounded-xl border px-3 py-1.5 text-sm transition-all ${
                      verbKey === v.key
                        ? 'border-sky-500/50 bg-sky-500/15 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {v.infinitive}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Object slots — one select per governed slot, with its case shown. */}
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          {verb.slots === 2 ? 'Objects' : 'Object'}
        </p>
        <div className="flex flex-wrap gap-4">
          {verb.frame.map((slot, i) => {
            const caseInfo = CASE_BY_KEY[slot.case];
            const color = CASE_COLOR_CLASSES[caseInfo.color];
            return (
              <div key={i} className="flex flex-col gap-1.5">
                <span className={`text-[11px] font-black uppercase tracking-wide ${color.text}`}>
                  {slot.prep ? `${slot.prep} + ` : ''}
                  {caseInfo.label}
                </span>
                <select
                  value={usedNouns[i]}
                  onChange={(e) => setNoun(i, e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
                >
                  {NOUN_GROUPS.map((grp) => (
                    <optgroup key={grp} label={grp}>
                      {NOUN_BANK.filter((n) => n.group === grp).map((n) => (
                        <option key={n.key} value={n.key}>
                          {n.key} — {n.gloss}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live sentence */}
      {sentence && (
        <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SentencePhrase sentence={sentence} size="text-3xl" />
            <CaseChips objects={sentence.objects} />
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4 text-sm leading-relaxed text-slate-300">
            <span className="font-black text-white">{sentence.verbInfinitive}</span>
            <span className="text-slate-500">({sentence.verbGloss}) forces</span>
            {sentence.objects.map((o, i) => (
              <span key={i} className="text-slate-300">
                <span className="text-white">{o.nounNom}</span> →{' '}
                <span className={`font-semibold ${CASE_COLOR_CLASSES[o.caseInfo.color].text}`}>
                  {o.prep ? `${o.prep} ` : ''}
                  {o.form}
                </span>
                <span className="text-slate-500"> ({o.caseInfo.label.toLowerCase()})</span>
                {i < sentence.objects.length - 1 ? ',' : '.'}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Shell ------------------------------------------------------------------

export default function VerbGovernment() {
  const [mode, setMode] = useState('walkthrough');

  return (
    <div className="space-y-6">
      {/* Concept header */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-sky-300" />
          <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Verb government</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          A Russian verb dictates the <span className="text-white">case</span> of its object(s). Change the verb and
          the endings downstream change with it — the noun follows orders.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
        {[
          { id: 'walkthrough', label: 'Walkthrough', Icon: Route },
          { id: 'free', label: 'Free build', Icon: SlidersHorizontal },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-[0.2em] transition-all ${
              mode === id ? 'bg-sky-500/20 text-sky-200' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {mode === 'walkthrough' ? <Walkthrough /> : <FreeBuild />}
    </div>
  );
}
