# SurvivalRussian — Orientation Notes

Self-note for future Claude sessions. Owner is `fordted438@gmail.com`. Working dir `/home/c/Code/SurvivalRussian`.

## Pickup for next session (last touched 2026-05-24 evening)

Working tree is clean as of commit `300ce79` on branch `stash` (which is now 1 commit ahead of `origin/stash`). Start by re-orienting: read this file top-to-bottom, then `git status` to confirm.

**Top of pile — pending work the owner has acknowledged but deferred:**

1. **`vocabulary.json` `literal`/`natural` cleanup pass for the originally-flagged entries** (carried over from 2026-05-23). The missing-words problem was solved separately in the 2026-05-24 pass, but the specific bad-gloss entries the analysis-field subagents flagged are still untouched in the pre-existing vocab:
   - **~6 clearly wrong glosses**:
     - `рот`: `literal: "mouthpiece"` → "mouth"
     - `комплекс`: `literal: "complexion"` → "complex"
     - `лист`: `literal: "leaflet"` → "leaf; sheet"
     - `тихо`: `literal: "quiet on"` → "quietly" (broken source)
     - `сотрудник`: `literal: "staffer"` → "employee" or "colleague"
     - `мочь`: `literal: "pot"` → "to be able to" (and probably `рыба`: "pot" too — verify)
   - **~30 entries with Cyrillic leaked into the English `natural` field.** Run `jq -r 'to_entries | [.[] | select(.value.natural | test("[А-Яа-яЁё]"))] | .[] | "\(.key): \(.value.natural)"' src/data/vocabulary.json` to list them all. Examples: `начальник` → `"Boss; начальник."`, `берег` → `"Shore; берег; bank (of river)."`, `пусть` → `"Let; пусть (permission/insistence)."`. Strip the Cyrillic; keep the English.
   - **~55 single-word `natural` glosses** — default skip; not bugs, just terse.
   
   Recommended approach: same 10-parallel-Opus pattern. Bias hard toward "only fix clear bugs"; do NOT auto-expand short glosses. New per-form entries (added 2026-05-24) already follow the clinical voice, so they're not in scope for this pass.

2. **Remaining ё-less inflected forms in vocab** (new, surfaced 2026-05-24). The phrase normalization touched only the 25 (e-form, ё-form) pairs where both forms had vocab entries. Some ё-less forms still exist as standalone entries because their ё-counterpart was never written in any lesson (e.g. `легкая`, `тяжелая` — f. sg. of лёгкий/тяжёлый). Each has a "Spelled without ё; cf. X" note in analysis but is otherwise treated as its own entry. If owner wants stricter normalization: sweep all lesson phrases for plausible ё-stand-in e-forms (broader than the 25 pairs), substitute, then dedupe vocab. Not in scope until owner asks.

**Repo state (as of 2026-05-24 commit `300ce79`):**
- Branch: `stash`, 1 commit ahead of `origin/stash`. `stash` itself is still several commits ahead of `origin/main`.
- Working tree: clean. No uncommitted changes from this session.
- Untracked: `src/data/vocabulary.json.bak`, `src/data/vocabulary.json.syn-ant-clean.bak`, `src/data/lessons/frequency-gulag.json.bak` (owner-authored older backups, intentionally untracked).
- Owner runs their own git workflow. **Do NOT commit unless explicitly asked.** Owner has not pushed; do not push unless asked.
- Dev server may or may not be running; check before starting one.

**Closed threads — don't reopen unless owner brings them up:**
- KGB tutor persona → replaced with clinical pronunciation coach
- Internal lesson ID `'mission'` → `'essentials'`
- App-wide UI tone normalization (~30 string edits)
- `SentenceStructuralAnalysis.jsx` stub → parser-driven 4-mode renderer
- frequency-gulag.json 1000-entry rewrite
- vocabulary.json synonym/antonym cleanup
- vocabulary.json analysis-field cleanup
- vocabulary.json missing-per-form-entry fill (1417→3085; case variants, verb conjugations, agreement variants — no blank MeaningCards now)
- ё-normalization of 86 phrase tokens across 30 lesson files; 26 orphaned е-form entries dropped; 3 genuine semantic pairs (все/всё, всем/всём, берет/берёт) rewritten with disambiguating analyses
- 11 hyphenated compounds (что-то, всё-таки, из-за, etc.): JSON key kept as space-tokenized form for page.js lookup, `cyrillic` field overridden to canonical hyphenated form for display

The work log further down is current. If owner asks "where did we leave off," the answer is this section plus the `## Work done previously` log.

---


## What this is

Next.js 16 (App Router, React 19, **JS not TS**, Tailwind v4) Russian typing trainer with TTS, voice-pronunciation grading, interlinear-style grammar analysis, a `MeaningCard` vocab popup, a morphology lab UI, a live chatroom, and (yes, really) a Durak card game implementation. Sprawling proof-of-concept. Owner is iterating with multiple AI tools (Claude, codex, gemini, continue.dev). Expect inconsistent code provenance.

## Run

```
npm run dev         # node server.js (Next + custom server wrapper)
npm run dev:wsl     # WSL variant
```
Opens at http://localhost:3000.

## Branch state (snapshot — verify with `git status` before acting)

- Current branch: **`stash`** (also remote: stash, testing, staging, main)
- `stash` is ahead of `origin/main` by several commits — owner does work here, periodically merges to main
- See the "Pickup for next session" section above for the up-to-date snapshot.
- **Don't commit unless asked.** Owner runs their own git workflow.

## Layout (the bits that matter)

```
src/
  app/page.js              — main client page; mission state machine, persistence, wires all components
  app/api/tutor/route.js   — Gemini-backed tutor endpoint
  components/
    TypingEngine.jsx       — char-by-char typing surface (case-insensitive match via toLocaleLowerCase)
    SentenceStructuralAnalysis.jsx — parser-driven analysis card; handles 4 lesson formats (see "Lesson analysis formats")
    MeaningCard.jsx        — per-word vocab card (literal/natural/syn/ant/thumbnail/analysis from vocabulary.json)
    MorphologyLab*.jsx     — morphology UI (separate workspace)
    SuggestionShredder.jsx, FeatureDock.jsx, WelcomeOverlay.jsx, SidebarQuickGuide.jsx
    DurakBoard*.jsx, GameOverlay.js — Russian card game (boardgame.io)
    ChatroomPanel.jsx      — live chat (ws server in chatSocketServer.js)
  hooks/useKeyboard.js     — global keystroke listener feeding TypingEngine
  data/
    vocabulary.json        — per-word card data; keys are Cyrillic words
    alphabet.json          — Cyrillic ↔ JCUKEN/QWERTY mapping
    lessons/index.js       — exports lessonSets[] + dynamic generators; THIS is the actual registry
    lessonSets.js          — thin re-export shim of `./lessons`
    lessons/*.json + subfolders — individual lesson sets (see Mission shape below)
    morphologyModules.js   — morphology lab module configs
    deprecatedmissions.json— ~150 lines of orphaned old missions (not loaded anywhere)
server/, chat-server.js, chatSocketServer.js, dev-wsl.js, server.js — custom dev/prod servers
tools/slacklama            — removed integration relic
lib/durak                  — Durak game logic
```

## Mission data shape (this is what flows through the UI)

```json
{
  "id": "FG-0001",
  "rank": 1,                    // only frequency-gulag has rank
  "word": "и",                  // a.k.a. focus word
  "phrase": "Маша поёт и танцует на сцене.",     // → TypingEngine targetText
  "fullAnalysis": "Focus word: и (...) Per-token: ... | ...",   // see Landmine #1
  "literal": "Masha sings and dances on the stage."
}
```

Some lesson files (e.g. `daily-routine.json`, `cases-noun-conjugation.json`) lack `word` and use a different `fullAnalysis` style ("Strategic focus: X. 1. ... 2. ... 3. ..."). The data layer is heterogeneous — check the source file before assuming a schema.

## Critical wiring

```
lessons/index.js → page.js (loads missions[], picks currentMission)
  ├─ currentMission.phrase     → TypingEngine targetText
  ├─ currentMission.word/focusWord → vocabulary lookup → MeaningCard activeData
  └─ currentMission            → SentenceStructuralAnalysis sentenceData
```

Cursor word during typing: `page.js` splits `phrase` on spaces, looks each up in `vocabulary.json` (NFC-normalized, lowercase, punctuation-stripped). Words missing from `vocabulary.json` show an empty MeaningCard.

## Lesson analysis formats (heterogeneous — parser dispatches on shape)

`SentenceStructuralAnalysis.jsx` auto-detects four shapes of `fullAnalysis` and renders each differently:

| Mode | Detection | Source style | Render |
|------|-----------|--------------|--------|
| `per-token` | contains `Per-token:` | frequency-gulag (current) | Focus-word header + POS-color-coded token chips + structural note |
| `strategic` | starts with `Strategic focus:` | daily-routine.json, deprecatedmissions.json | Intro line + numbered list |
| `legacy` | `Focus word: X. Literal: Y.` only | old frequency-gulag style | Focus word only (no analysis section) |
| `prose` | anything else | cases-noun-conjugation.json | Plain paragraph |

The per-token parser expects: `Focus word: X (blurb). Per-token: A (tags) | B (tags) | ... | Z (tags). <pedagogical note>`. Token tags are inspected for POS markers (`noun`, `verb`, `1sg`/`2sg`/etc, `impf`/`perf`, `adj`, `prep`, `pron`, `conj`, `particle`, `adv`, `num`) to assign chip color. If you author new lessons, follow one of these shapes or the parser will fall through to plain prose.

## Landmines / codex caveats (verify each before assuming)

1. **Heterogeneous lesson schemas.** Some lessons have `word`+`rank`, some don't. Some `fullAnalysis` follow "Strategic focus" pedagogy style, others follow per-token gloss style. The renderer handles all four (see "Lesson analysis formats" above), but if you add a fifth style it'll fall through to plain prose with no special formatting.
2. **vocabulary.json cleanup history**:
   - **2026-05-23 (two passes)**: (1) synonym/antonym fields — blank values use a single space `" "` (not `""`, not literal `"null"`) so the UI's truthy check renders blank instead of the em-dash fallback; (2) analysis field — all 291 backfill stubs ("Frequency backfill entry.") rewritten, all stale inline `syn./ant.` notes stripped, all "Fun fact:" / "super-mode" Gemini-isms removed. Voice clinical, POS-led, lemma-referenced.
   - **2026-05-24 (per-form fill)**: 1417 → 3085 entries. Every surface form appearing in any lesson phrase now has an entry — case variants, verb conjugations, agreement variants are each their own entry (this is intentional, powers interlinear gloss). Same clinical voice. 26 е-form duplicates dropped after lesson normalization.
   - **If you add new entries**, follow conventions: clinical POS-led analysis (~80-120 chars), lemma-referenced; blank synonym/antonym as single space `" "`; omit `thumbnail` field entirely unless you have a confident Material Symbols match for a concrete noun/action (do NOT write `"thumbnail": "null"` — old bug). Hyphenated compounds: JSON key uses the punctuation-stripped space form (что то); `cyrillic` field is the canonical hyphenated form (что-то).
3. **vocabulary.json `literal`/`natural` fields still have data bugs** in the pre-existing entries (the per-form fill did not touch these): `рот`→"mouthpiece" (means mouth), `комплекс`→"complexion" (means complex), `лист`→"leaflet" (means leaf/sheet), `тихо`→"quiet on" (broken; means quietly), `сотрудник`→"staffer" (more naturally employee), plus ~30 entries with embedded Cyrillic leaked into the English `natural` field. See the "Pickup for next session" section for the full list and recommended approach. New per-form entries are not affected.
4. **ё/е inconsistency (mostly resolved 2026-05-24).** Source data sometimes uses bare `e` where modern orthography wants `ё`. As of 2026-05-24, 86 phrase tokens across 30 lesson files were normalized e→ё for the 25 spelling-variant pairs where both forms existed (черный/чёрный, идет/идёт, пришел/пришёл, ребенок/ребёнок, etc.). The TypingEngine matches char-by-char case-insensitive, so `ё` must be typed as `ё`. Genuine semantic distinctions kept separate: все/всё, всем/всём, берет (beret) / берёт (takes). Some ё-less inflected forms (e.g. `легкая`, `тяжелая`) still exist as standalone entries because their ё-counterpart was never used in lessons — handled by per-entry "Spelled without ё; cf. X" notes in analysis.
4. **Two parallel lesson registries** — `lessons/index.js` is the source of truth, `lessonSets.js` is a re-export. Edit `lessons/index.js`.
5. **TypingEngine input is case-insensitive but otherwise strict** — em-dash `—` (U+2014) must be typed as em-dash; commas/periods all must be typed. Spelled-out numerals only (no digits).
6. **Owner uses Dvorak as OS keyboard layout; punctuation entry is layout-aware, letters are not.** Cyrillic letters go through `event.code` → `alphabet.json` (keyed by QWERTY-physical positions → JCUKEN) — owner must press the QWERTY-physical position regardless of Dvorak keycap. **But the 6 punctuation chars used across all 2160 lesson phrases (`.`, `,`, `?`, `!`, `-`, `—`) bypass the code lookup via a `PUNCT_PASSTHROUGH` `event.key` check at the top of `useKeyboard.js`** — so pressing the key labeled `.` on your Dvorak keycap produces `.` regardless of layout. As of 2026-05-28 this is the complete set of non-letter chars in any lesson phrase (verified by recursive scan of `src/data/lessons/**/*.json`). If a new lesson introduces additional punctuation (`:`, `;`, `«»`, etc.), extend `PUNCT_PASSTHROUGH`. **Trade-off:** JCUKEN ю (physical Period) and б (physical Comma) are no longer reachable from those physical keys on any layout, because the passthrough intercepts `.` and `,` before the code lookup. Not currently an issue (no observed need to type lone ю/б), but if it comes up, relocate them in `alphabet.json` rather than removing the passthrough.
7. **Branch chaos.** `stash` is the live working branch; `main` lags behind. Commits like `"????? error fixed"` exist. Don't assume `git log` reads like a clean changelog.
8. **Dev artifacts** in repo root: `tmp-devwsl*.{out,err}`, empty `next` and `cyrillic-type-speak@0.1.0` files. Probably leftovers from `dev-wsl.js`. Don't touch unless owner asks.

## Work done previously (most recent first)

- **vocabulary.json missing-per-form-entry fill + ё-normalization** (2026-05-24, commit `300ce79`). Owner found during testing that lesson phrases frequently included words missing from `vocabulary.json` (case variants, verb conjugations, agreement forms), producing blank MeaningCards. Scanned all 85 lesson files with a Node script mirroring `page.js`'s exact tokenizer (NFC + lowercase + punctuation/symbol stripping); found 1694 unique missing tokens, 3524 occurrences. Sliced into 10 ~170-entry chunks, ran 10 parallel Opus subagents to write entries in the established clinical voice (POS-led, lemma-referenced, ~87 char avg analysis). Merged: vocab grew 1417 → 3111. Then 29 ё/е pairs surfaced; classified as 4 genuine semantic distinctions (kept and tightened: все/всё, всем/всём, берет/берёт; note берет/берёт had been agent-conflated and was fixed) vs. 25 spelling-only variants. For spelling-only: normalized 86 phrase tokens across 30 lesson files (e→ё whole-word substitution preserving capitalization), then dropped 26 orphaned е-form vocab entries (vocab settled at 3085). Final cleanup: 11 punctuation-stripped compound entries (что-то, всё-таки, из-за, по-английски, ярко-зелёной, etc.) got `cyrillic` field overridden to their canonical hyphenated form for MeaningCard display while keeping the space-tokenized JSON key for `page.js` lookup. Verified: 0 missing tokens across all 85 lesson files. Backup at `vocabulary.json.bak.pre-missing-fill`.
- **vocabulary.json analysis-field pass** (2026-05-23). Rewrote 291 "Frequency backfill entry." stubs from scratch; stripped 134 stale inline `syn./ant.` cross-refs; trimmed 3 Gemini-isms ("Fun fact:", "super-mode"); enriched thin one-liners across the board. New voice: clinical, POS-led, lemma-referenced for inflected forms, ~95 chars avg (was 33). 10 parallel Opus subagents. Subagents took initiative on ~95 entries to also edit `literal`/`natural`; force-reverted those to source backup to honor strict preservation rule — left their findings as flag list for a future pass. Backups: `vocabulary.json.bak` (original) and `vocabulary.json.syn-ant-clean.bak` (post syn/ant, pre analysis).
- **vocabulary.json synonym/antonym pass** (2026-05-23). Cleaned all 1417 entries with 10 parallel Opus subagents, bias hard toward blank. Replaced 1454 literal-`"null"`-string placeholders (bug: was rendering as text in UI) with single-space `" "`. Stripped florid/wrong-sense/proverb/slur/negation-as-antonym slop. Final distribution: 523 filled synonyms / 894 blanked; 479 filled antonyms / 938 blanked. All other fields preserved byte-for-byte.
- **Tutor prompt + lesson ID cleanup** (2026-05-23). Rewrote `src/app/api/tutor/route.js` Gemini prompt from the "Defected KGB Phonetics Officer" role-play into a clinical Russian pronunciation coach (kept all piping: model fallback chain, error handling, request/response shape — only the prompt body changed). API has been broken for a while on Google's side; new prompt is ready for when it comes back. Also renamed internal lesson-set id `'mission'` → `'essentials'` in `lessons/index.js` (definition + fallback) to match the new label. Persisted localStorage with the old `'mission'` id falls through `getLessonSet` to `lessonSets[0]` (Essentials) automatically — no migration needed.
- **App-wide UI tone normalization** (2026-05-23). Stripped generic military/hacker jargon ("MISSION INTEL", "SIGNAL", "ANALYSIS", "PHONETIC INPUT", "Linguistic Intel", "Vocabulary Intel Missing", "Wildcard Bay", etc.) across TypingEngine, SentenceStructuralAnalysis, MeaningCard, SpeechInterface, WelcomeOverlay, SidebarQuickGuide, LessonSetSelector, FeatureDock, page.js, api/tutor/route.js, lessons/index.js, morphologyModules.js. Lesson-set renames: "Mission Set" → "Essentials", "Street Set" → "Street Russian". Kept the intentional dark-Russian thread (1000 Word Gulag set name, SuggestionShredder gag).
- **Upgraded `SentenceStructuralAnalysis.jsx`** (2026-05-23). Was a 30-line stub that only showed `Focus word: X` and `Literal: Y`. Now parses `fullAnalysis` into one of 4 modes (see "Lesson analysis formats") and renders per-token gloss as color-coded POS chips. Hot-reloads into the owner's running dev server.
- **Rewrote all 1000 entries in `src/data/lessons/frequency-gulag.json`** (2026-05-23). Original was templated (`Этот дом X`, `У меня есть X`, `Мы нашли X`) and frequently ungrammatical (`Мы нашли Россия` etc.). New entries: natural 4–10 word sentences, per-token morphology breakdown in `fullAnalysis`, refreshed `literal`. Backup at `frequency-gulag.json.bak`. Used 10 parallel Opus subagents (100 entries each), then stitched.

## Conventions

- JS only (no TS); React 19 + Next 16 App Router; Tailwind v4 via `@tailwindcss/postcss`.
- `'use client'` directive on every interactive component.
- File extensions: components in `.jsx`, hooks/utils in `.js`. (`GameOverlay.js` is the one inconsistency.)
- Comment style: terse — mostly section-header comments inside JSX, no JSDoc, no big block headers.
- **UI tone (post 2026-05-23 normalization)**: plain professional language, no military/hacker jargon. Section labels stay tracked-uppercase but say what they are ("VOICE", "PRONUNCIATION", "SENTENCE BREAKDOWN"). Drop "Intel", "Signal", "Mission", "Protocol", "Tactical" if you see them sneak back in. Two dark-Russian threads are owner-authored and stay: (1) "1000 Word Gulag" lesson-set name, (2) the entire SuggestionShredder gag (fake IP-fetch / "you are now in gulag" alert). The Gemini tutor prompt in `src/app/api/tutor/route.js` has been rewritten as a clinical pronunciation coach (was the "KGB Phonetics Officer" gimmick).
- The `gemini.md` file in repo root is a stale Phase-1 execplan from project inception. Ignore for current state.

## Things to verify before acting

- Is the file referenced still in `lessons/index.js`? (Several orphaned/deprecated files exist.)
- Does the lesson set have the schema you assume? (Check 2-3 entries.)
- Does the vocabulary word for the typed phrase exist in `vocabulary.json`? (Missing → empty card, no crash.)
- Is the branch you're on the one the owner expects? (Default to `stash` unless told.)
