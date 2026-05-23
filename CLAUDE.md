# SurvivalRussian — Orientation Notes

Self-note for future Claude sessions. Owner is `fordted438@gmail.com`. Working dir `/home/c/Code/SurvivalRussian`.

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
- Modified-but-uncommitted on entry was: `src/app/page.js`, `src/data/lessons/index.js`, `src/data/lessons/frequency-gulag.json`. Untracked: `src/data/lessons/conversation/` (a whole new lesson folder), plus `frequency-gulag.json.bak` (my backup from the rewrite)
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
2. **vocabulary.json sense mixups.** Example: `еду` is glossed as "riding (vehicle)" but its `synonym` field lists food synonyms (кушанье, пища, провизия) — wrong sense. Probably more like this. Worth flagging when touching vocab data.
3. **ё/е inconsistency.** Source data sometimes uses bare `e` where modern orthography wants `ё` (e.g. `черный`, `темный`, `желтый`, `ребенок`). My frequency-gulag rewrite uses `ё` in `phrase` while keeping the source spelling in `word`. The TypingEngine matches char-by-char case-insensitive, so `ё` must be typed as `ё` — if owner mentions typing-engine ё/е friction, that's the source.
4. **Two parallel lesson registries** — `lessons/index.js` is the source of truth, `lessonSets.js` is a re-export. Edit `lessons/index.js`.
5. **TypingEngine input is case-insensitive but otherwise strict** — em-dash `—` (U+2014) must be typed as em-dash; commas/periods all must be typed. Spelled-out numerals only (no digits).
6. **Branch chaos.** `stash` is the live working branch; `main` lags behind. Commits like `"????? error fixed"` exist. Don't assume `git log` reads like a clean changelog.
7. **Dev artifacts** in repo root: `tmp-devwsl*.{out,err}`, empty `next` and `cyrillic-type-speak@0.1.0` files. Probably leftovers from `dev-wsl.js`. Don't touch unless owner asks.

## Work done previously (most recent first)

- **Upgraded `SentenceStructuralAnalysis.jsx`** (2026-05-23). Was a 30-line stub that only showed `Focus word: X` and `Literal: Y`. Now parses `fullAnalysis` into one of 4 modes (see "Lesson analysis formats") and renders per-token gloss as color-coded POS chips. Hot-reloads into the owner's running dev server.
- **Rewrote all 1000 entries in `src/data/lessons/frequency-gulag.json`** (2026-05-23). Original was templated (`Этот дом X`, `У меня есть X`, `Мы нашли X`) and frequently ungrammatical (`Мы нашли Россия` etc.). New entries: natural 4–10 word sentences, per-token morphology breakdown in `fullAnalysis`, refreshed `literal`. Backup at `frequency-gulag.json.bak`. Used 10 parallel Opus subagents (100 entries each), then stitched.

## Conventions

- JS only (no TS); React 19 + Next 16 App Router; Tailwind v4 via `@tailwindcss/postcss`.
- `'use client'` directive on every interactive component.
- File extensions: components in `.jsx`, hooks/utils in `.js`. (`GameOverlay.js` is the one inconsistency.)
- Comment style: terse — mostly section-header comments inside JSX, no JSDoc, no big block headers.
- Owner-facing copy uses heavy aesthetic terminology ("SIGNAL", "ANALYSIS", "Mission Structural Intel") — preserve that voice when editing UI strings.
- The `gemini.md` file in repo root is a stale Phase-1 execplan from project inception. Ignore for current state.

## Things to verify before acting

- Is the file referenced still in `lessons/index.js`? (Several orphaned/deprecated files exist.)
- Does the lesson set have the schema you assume? (Check 2-3 entries.)
- Does the vocabulary word for the typed phrase exist in `vocabulary.json`? (Missing → empty card, no crash.)
- Is the branch you're on the one the owner expects? (Default to `stash` unless told.)
