# Grammar-Feature Coverage Audit — SurvivalRussian corpus

> **Read-only audit, 2026-06-12.** No lesson data was modified. This is the "first
> move of Step 2" from `gameplan.md`: a demonstrated-vs-missing checklist of Russian
> grammar phenomena, so corpus work fills *gaps* instead of writing sentences blindly.

## Method (so the numbers are honest, not vibes)

- Walked all **1,308 lesson JSON files → 15,185 missions**; for each, examined the
  `phrase` (what's *demonstrated*) and the `fullAnalysis` prose (what's *explained*).
- Per feature: counted **missions whose analysis explains it** ("analysis") and **how
  many distinct decks** touch it ("decks"); for a few, also a **structural scan of the
  phrase itself** (e.g. words ending `-ся`, the particle `бы`).
- Counts are a **signal, not gospel** — they key off the analysis wording, so a low
  number can mean "thin" *or* "explained in words my regex didn't catch." Every
  near-zero result below was **manually spot-checked** before being called a gap (this
  already corrected two false alarms — see note).
- **Corpus distribution** (missions): nouns 9,412 · verbs 1,218 · frequency-gulag
  1,000 · adverbs 980 · lexical-sets 670 · cases-nouns 516 · binary-adjectives 395 ·
  pro-forms 273 · conversation 190 · spatial-motion 190 · adjectives 170 ·
  comparisons 103 · (misc themed sets) ~90.

> **Two corrections caught during verification** (why the spot-check matters):
> aspect-pair framing first scored 5 but is actually **96** (the prose says "perf.
> partner of…", not "aspect pair"); and motion verbs first scored ~39 but the
> `spatial-motion/` deck carries **190** motion missions my first regex missed. Both
> are reclassified as well-covered below.

---

## TIER 1 — Well covered (demonstrated **and** explained, broad reach)

These are done. Don't spend Step 2 here.

| Feature | analysis hits | decks |
|---|---|---|
| Nominative | 4,383 | 1,023 |
| Genitive (general) | 3,629 | 1,065 |
| Accusative | 2,907 | 1,088 |
| Prepositional / Locative | 2,130 | 1,042 |
| Dative | 1,743 | 1,027 |
| Instrumental | 1,708 | 1,021 |
| Prepositions + case government | 3,090 | 1,047 |
| Plural | 3,347 | 1,149 |
| Gender agreement (m/f/n) | 2,312 / 2,099 / 1,236 | — |
| Animacy (anim/inanim) | 1,131 | 636 |
| Imperfective / Perfective | 312 / 786 | — |
| Aspect pairs/partners | **96** | — |
| Past / Present / Future tense | 1,005 / 659 / 447 | — |
| Person (1st/2nd/3rd) | 694 / 345 / 648 | — |
| Imperative | 315 explained · 7,064 in-phrase | 192 |
| Negation | 394 explained · 1,015 in-phrase | 311 |
| Reflexive `-ся` | 144 explained · 1,991 in-phrase | 55 |
| Numerals + paucal (2–4 gen.sg) | 213 / 160 | 161 |
| Short-form adjective | 243 | 172 |
| Comparative | 132 | 80 |
| Impersonal constructions (мне нужно / можно) | 362 | 175 |
| Conjugation classes (1st/2nd) | organized by folder | — |

**The whole case system, agreement, aspect, tense, and the core verb morphology are
genuinely exhaustive.** This is the corpus's strength and it's real.

---

## TIER 2 — Present but thin (demonstrated; under-built — top up)

Worth a modest, targeted batch each. Quality of the few existing examples is good;
quantity is low for the feature's importance.

| Feature | analysis hits | note |
|---|---|---|
| **Conditional / subjunctive `бы`** | 10 | High-importance, only ~10 sentences total. Build a dedicated deck (polite requests «не могли бы вы…», hypotheticals «если бы… , то…», «хотел бы»). |
| **Motion verbs — determinate/indeterminate pair system** | 21 explicit (идти/ходить 33 in-phrase; **ездить only 5**) | Prefixed/directional motion + source-goal cases are well done (190 missions). The *unidirectional vs multidirectional* contrast (идти↔ходить, ехать↔ездить, habitual vs single trip) is thin, and by-vehicle ездить is nearly absent. |
| **Superlative** | 38 | самый + -ейший/-айший; thinner than the comparative. |
| **Word order / emphasis** | 107 | Present; could be more deliberate (topic-comment, fronting for emphasis). |
| **Indefinite pronouns -то / -нибудь / -либо** | 109 | Demonstrated via pro-forms; the -то vs -нибудь *distinction* could be explained more. |
| **Negative pronouns (никто/ничто/нигде) + double negation** | 55 | Russian obligatory double negation deserves explicit treatment. |
| **Ordinal numerals** | 7 | Barely present (dates, floors, «первый/второй…»). |
| **Collective numerals (двое/трое/четверо)** | 27 | Thin; the special governance is untaught. |
| **Possessives** | 229 | Adequate but mostly incidental; свой vs его/её is a classic trap worth a focused deck. |

---

## TIER 3 — Genuine gaps (barely demonstrated, not explained as a system)

**This is where Step 2 earns "masterpiece."** These are real, high-value Russian
features that the corpus does **not** currently teach as systems — examples only leak
in incidentally.

| Feature | hits | verdict |
|---|---|---|
| **Participles — the whole system** | present-active **0**, past-active **1** (бывший), passive **14** | **Biggest gap.** Russian participles (действующий, сделанный, прочитавший, читающий) are essentially untaught. Needs its own family: present/past × active/passive, with the «который»-clause paraphrase each one compresses. |
| **Gerunds / verbal adverbs (деепричастия)** | 3, all incidental (молча, несмотря) | **Major gap.** No deck teaches forming/using imperfective (-я: читая) or perfective (-в: прочитав) gerunds, or the same-subject rule. |
| **Passive voice constructions** | 6 | Thin. Reflexive passive (строится) and participial passive (был построен) both need coverage. |
| **Diminutive / augmentative formation** | 6, incidental (домик, зонтик, девочка) | Examples appear; **no deck teaches the productive suffixes** (-ик, -ок, -очка, -енька, -ище) or their pragmatics. Pervasive in real speech. |
| **Verbal aspect in the imperative / in the infinitive after phase verbs** | folded into imperative counts | The aspect *choice* (НСВ vs СВ command nuance, начать + impf) is rarely the explicit focus. |

---

## Recommended Step-2 build order (gap-first)

1. ~~**Participles family**~~ ✅ **BUILT 2026-06-13** — new `participles/` family,
   4 groups (present-active, past-active, present-passive, past-passive) × 6
   high-frequency participles = **24 cards / 240 sentences**. Covers long+short forms,
   full gender/number/case agreement, and the «который» relative-clause paraphrase.
   Wired into `lessons/index.js`; vocab fill added **281 entries** (13,309 → 13,590),
   **0 missing tokens** across the new phrases. Backup: `vocabulary.json.bak.pre-participle-fill`.
   Not yet committed (owner commits).
2. ~~**Gerunds / verbal adverbs**~~ ✅ **BUILT 2026-06-13** — new `gerunds/` family,
   2 groups (imperfective `-я/-ясь`, perfective `-в/-вши`) × 7 verbs = **14 cards /
   140 sentences**. Every card teaches the two contrasts with participles:
   **indeclinability** and the **same-subject rule** (both confirmed present in all 14).
   Covers front/end clause position, mixed main-clause tenses, the irregular придя and
   reflexive -ясь/-вшись. Wired into `lessons/index.js`; vocab fill added **84 entries**
   (13,590 → 13,674), **0 missing tokens**. Verified compiling via the live Turbopack
   dev server (HTTP 200, no parse error). Backup: `vocabulary.json.bak.pre-gerund-fill`.
   Not yet committed (owner commits).
3. ~~**Conditional / subjunctive `бы`**~~ ✅ **BUILT 2026-06-13** — new `conditional/`
   family, 3 functional groups (hypotheticals, polite requests/wishes, advice) × ~3
   construction frames = **10 cards / 100 sentences**. Organized by *function* not word
   (бы is a particle, not a paradigm). Every phrase contains бы; every card reinforces
   the core rule **бы + past-tense verb**. Covers `если бы …, … бы`, `не могли бы вы…`,
   `хотелось бы`, `на твоём месте я бы…`, `тебе бы + inf`, etc. Wired into
   `lessons/index.js`; vocab fill added **21 entries** (13,674 → 13,695), **0 missing
   tokens**. Live Turbopack build clean (HTTP 200). Backup: `vocabulary.json.bak.pre-conditional-fill`.
   Not yet committed (owner commits).
4. **Motion-verb pair system** (extend `spatial-motion/`: идти↔ходить, ехать↔ездить,
   нести↔носить; single-trip vs habitual vs round-trip; by-foot vs by-vehicle).
5. **Diminutives** + **passive voice** + **ordinal/collective numerals** + **свой**
   (smaller targeted decks).

Each follows the proven `CLAUDE.md` pipeline (manifest → parallel-subagent gen →
per-form vocab fill → 0-missing-token scan → commit when owner asks). Doing these
turns "every frequent word appears" into "every grammatical phenomenon is demonstrated
and explained" — the Step-2 thesis.

## Caveats / how to refine

- These counts read the analysis prose; the renderer's `per-token`/`strategic` styles
  word things differently, so treat Tier boundaries as guidance, not a hard line.
- This audit did **not** run during the parallel session's `conversation/` +
  `vocabulary.json` edits being final — re-run the script (it's reproducible from
  `/tmp/sr_missions.json` build steps) after that lands to refresh Tier 1/2 counts.
- The new participle/gerund decks will introduce vocabulary forms (participial
  endings) that need the usual vocab-fill pass so no MeaningCard comes up blank.
