'use client';

// Rolodex module — a three-reel morpheme slot-machine: PREFIX × ROOT × SUFFIX.
// Spin the ROOT reel to switch word family; spin PREFIX to bend the meaning;
// spin SUFFIX to turn the root into a verb, an agent noun, an action noun, a
// result noun, an adjective… Any reel can be pinned. Combinations that form a
// real Russian word show the word + gloss + part of speech; combinations that
// don't are flagged, so productive vs. dead morphology stays visible. "Spin"
// always lands on an attested word.

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Dices, Pin, PinOff } from 'lucide-react';
import {
  WORD_FAMILIES,
  PREFIX_GLOSSES,
  lookupBuild,
  familyBuilds,
} from '../../data/morphology/morphemes';

const wrap = (i, n) => ((i % n) + n) % n;

const POS_BADGE = {
  verb: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  noun: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  adj: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
};
const POS_LABEL = { verb: 'verb', noun: 'noun', adj: 'adjective' };

function Reel({ label, value, sub, onPrev, onNext, pinned, onTogglePin, accent }) {
  return (
    <div className={`flex-1 rounded-2xl border ${accent.border} ${accent.bg} p-4`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${accent.text}`}>{label}</span>
        <button
          type="button"
          onClick={onTogglePin}
          title={pinned ? 'Unpin this reel' : 'Pin this reel'}
          className={`rounded-lg p-1.5 transition-colors ${pinned ? accent.text : 'text-slate-600 hover:text-slate-300'}`}
        >
          {pinned ? <Pin size={14} /> : <PinOff size={14} />}
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5 text-slate-400 transition-all hover:text-white"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-3 text-center">
          <div className="text-2xl font-black text-white">{value}</div>
          {sub && <div className="mt-1 text-[11px] leading-tight text-slate-400">{sub}</div>}
        </div>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5 text-slate-400 transition-all hover:text-white"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function MorphemeRolodex() {
  const [familyIdx, setFamilyIdx] = useState(0);
  const [prefixIdx, setPrefixIdx] = useState(0);
  const [suffixIdx, setSuffixIdx] = useState(0);
  const [pinPrefix, setPinPrefix] = useState(false);
  const [pinRoot, setPinRoot] = useState(false);
  const [pinSuffix, setPinSuffix] = useState(false);

  const family = WORD_FAMILIES[familyIdx];
  const prefix = family.prefixes[wrap(prefixIdx, family.prefixes.length)];
  const suffixObj = family.suffixes[wrap(suffixIdx, family.suffixes.length)];
  const suffix = suffixObj.s;
  const build = lookupBuild(family, prefix, suffix);
  const builds = useMemo(() => familyBuilds(family), [family]);

  const prefixDisplay = prefix ? `${prefix}-` : '∅';
  const prefixGloss = prefix ? PREFIX_GLOSSES[`${prefix}-`] || '' : 'no prefix';
  const suffixDisplay = suffix === 'Ø' ? 'Ø' : `-${suffix}`;

  // Jump the reels to a specific (family, prefix, suffix) build.
  const setToBuild = (fi, p, s) => {
    const fam = WORD_FAMILIES[fi];
    setFamilyIdx(fi);
    const pi = fam.prefixes.indexOf(p);
    const si = fam.suffixes.findIndex((x) => x.s === s);
    setPrefixIdx(pi >= 0 ? pi : 0);
    setSuffixIdx(si >= 0 ? si : 0);
  };

  const changeFamily = (dir) => {
    const fi = wrap(familyIdx + dir, WORD_FAMILIES.length);
    const fam = WORD_FAMILIES[fi];
    setFamilyIdx(fi);
    // Preserve the current prefix / suffix if the new family also has them.
    const pi = fam.prefixes.indexOf(prefix);
    const si = fam.suffixes.findIndex((x) => x.s === suffix);
    setPrefixIdx(pi >= 0 ? pi : 0);
    setSuffixIdx(si >= 0 ? si : 0);
  };
  const changePrefix = (dir) => setPrefixIdx((i) => wrap(i + dir, family.prefixes.length));
  const changeSuffix = (dir) => setSuffixIdx((i) => wrap(i + dir, family.suffixes.length));

  // Spin: land on a random attested build, honoring pinned reels.
  const spin = () => {
    const fi = pinRoot ? familyIdx : Math.floor(Math.random() * WORD_FAMILIES.length);
    const fam = WORD_FAMILIES[fi];
    let candidates = familyBuilds(fam);
    if (pinPrefix) candidates = candidates.filter((b) => b.prefix === prefix);
    if (pinSuffix) candidates = candidates.filter((b) => b.suffix === suffix);
    if (candidates.length === 0) candidates = familyBuilds(fam); // relax if pins conflict
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setToBuild(fi, pick.prefix, pick.suffix);
  };

  const accentPrefix = { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-300' };
  const accentRoot = { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-300' };
  const accentSuffix = { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-300' };

  return (
    <div className="space-y-6">
      {/* Reels */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Reel
          label="Prefix"
          value={prefixDisplay}
          sub={prefixGloss}
          onPrev={() => changePrefix(-1)}
          onNext={() => changePrefix(1)}
          pinned={pinPrefix}
          onTogglePin={() => setPinPrefix((p) => !p)}
          accent={accentPrefix}
        />
        <Reel
          label="Root"
          value={family.root}
          sub={family.rootGloss}
          onPrev={() => changeFamily(-1)}
          onNext={() => changeFamily(1)}
          pinned={pinRoot}
          onTogglePin={() => setPinRoot((p) => !p)}
          accent={accentRoot}
        />
        <Reel
          label="Suffix"
          value={suffixDisplay}
          sub={suffixObj.gloss}
          onPrev={() => changeSuffix(-1)}
          onNext={() => changeSuffix(1)}
          pinned={pinSuffix}
          onTogglePin={() => setPinSuffix((p) => !p)}
          accent={accentSuffix}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={spin}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-[0.24em] text-slate-200 transition-all hover:border-amber-500/50 hover:text-white active:scale-95"
        >
          <Dices size={18} className="text-amber-300" />
          Spin
        </button>
      </div>

      {/* Result */}
      <div
        className={`rounded-2xl border p-6 text-center transition-colors ${
          build ? 'border-slate-800 bg-slate-950/70' : 'border-dashed border-slate-800 bg-slate-950/40'
        }`}
      >
        {/* Recipe: the three morphemes as chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em]">
          <span className={`rounded-lg border px-2.5 py-1 ${prefix ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-slate-800 bg-slate-900/60 text-slate-600'}`}>
            {prefix ? `${prefix}-` : 'no prefix'}
          </span>
          <span className="text-slate-600">+</span>
          <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300">{family.root}</span>
          <span className="text-slate-600">+</span>
          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">{suffixDisplay}</span>
        </div>

        {build ? (
          <>
            <div className="mt-4 text-4xl font-black text-white">{build.word}</div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] ${POS_BADGE[suffixObj.pos]}`}>
                {POS_LABEL[suffixObj.pos]}
              </span>
            </div>
            <p className="mt-3 text-lg text-slate-200">{build.gloss}</p>
          </>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-slate-400">
              No standard word for this mix. Spin, or try another suffix on <span className="text-amber-300">{family.root}-</span>.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              <span className="text-blue-300">{prefixDisplay}</span> {prefixGloss} · <span className="text-emerald-300">{suffixDisplay}</span> {suffixObj.gloss}
            </p>
          </div>
        )}
      </div>

      {/* Whole family — every real word you can reach from this root */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          The <span className="text-amber-300">{family.root}-</span> family · {builds.length} real words
        </p>
        <div className="flex flex-wrap gap-2">
          {builds.map((b) => {
            const isActive = build && b.word === build.word;
            return (
              <button
                key={b.word}
                type="button"
                onClick={() => setToBuild(familyIdx, b.prefix, b.suffix)}
                title={b.gloss}
                className={`rounded-xl border px-3 py-1.5 text-sm transition-all ${
                  isActive
                    ? 'border-amber-500/50 bg-amber-500/15 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                {b.word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
