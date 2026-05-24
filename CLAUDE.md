# SurvivalRussian — Orientation Notes

Self-note for future Claude sessions. Owner is `fordted438@gmail.com`. Working dir `/home/c/Code/SurvivalRussian`.

## Pickup for next session (last touched 2026-05-23 evening)

Owner said we'd pick up tomorrow. Start by re-orienting: read this file top-to-bottom, then `git status` to see what's still uncommitted from the last working session.

**Top of pile — pending work the owner has acknowledged but deferred:**

1. **`vocabulary.json` `literal`/`natural` cleanup pass.** During the analysis-field pass, subagents caught ~95 entries with bad glosses but I reverted their fixes to honor the strict "preserve other fields" rule. Owner agreed it should be a separate pass. Three categories of issues to fix:
   - **~6 clearly wrong glosses** (high-confidence corrections):
     - `рот`: `literal: "mouthpiece"` → "mouth"
     - `комплекс`: `literal: "complexion"` → "complex"
     - `лист`: `literal: "leaflet"` → "leaf; sheet"
     - `тихо`: `literal: "quiet on"` → "quietly" (broken source)
     - `сотрудник`: `literal: "staffer"` → "employee" or "colleague"
     - `мочь`: `literal: "pot"` → "to be able to" (and probably `рыба`: "pot" too — verify)
   - **~30 entries with Cyrillic leaked into the English `natural` field.** Run `jq -r 'to_entries | [.[] | select(.value.natural | test("[А-Яа-яЁё]"))] | .[] | "\(.key): \(.value.natural)"' src/data/vocabulary.json` to list them all. Examples: `начальник` → `"Boss; начальник."`, `берег` → `"Shore; берег; bank (of river)."`, `пусть` → `"Let; пусть (permission/insistence)."`. Strip the Cyrillic; keep the English.
   - **~55 single-word `natural` glosses** where agents wanted to expand (e.g. "Again." → "Again; anew."). Default: **skip these** unless owner asks. They're not bugs, just terse.
   
   Recommended approach: same 10-parallel-Opus pattern as the analysis pass. Pre-existing chunk infrastructure was at `/tmp/vocab-chunks/` but may be gone after reboot — re-slice from current `src/data/vocabulary.json`. Bias hard toward "only fix clear bugs"; do NOT auto-expand short glosses.

**Repo state snapshot (uncommitted as of last session):**
- Branch: `stash` (working branch, several commits ahead of `origin/main`)
- Modified: `src/data/lessons/frequency-gulag.json`, `src/data/vocabulary.json`, `src/data/lessons/index.js`, `src/data/morphologyModules.js`, `src/app/page.js`, `src/app/api/tutor/route.js`, ~8 components in `src/components/`, `CLAUDE.md`
- Untracked: `src/data/lessons/conversation/` (new folder of conversation lessons, owner-authored), `src/data/vocabulary.json.bak`, `src/data/vocabulary.json.syn-ant-clean.bak`, `src/data/lessons/frequency-gulag.json.bak`
- Owner runs their own git workflow. **Do NOT commit unless explicitly asked.**
- Dev server was running (`node server.js`, PID 9914 last seen) — edits hot-reload

**Closed threads — don't reopen unless owner brings them up:**
- KGB tutor persona → replaced with clinical pronunciation coach
- Internal lesson ID `'mission'` → `'essentials'`
- App-wide UI tone normalization (~30 string edits)
- `SentenceStructuralAnalysis.jsx` stub → parser-driven 4-mode renderer
- frequency-gulag.json 1000-entry rewrite
- vocabulary.json synonym/antonym cleanup
- vocabulary.json analysis-field cleanup

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
2. **vocabulary.json cleanup completed 2026-05-23 in two passes**: (1) synonym/antonym fields — blank values use a single space `" "` (not `""`, not literal `"null"`) so the UI's truthy check renders blank instead of the em-dash fallback; (2) analysis field — all 291 backfill stubs ("Frequency backfill entry.") rewritten, all stale inline `syn./ant.` notes stripped, all "Fun fact:" / "super-mode" Gemini-isms removed. Voice is now clinical: leads with POS (m/f/n for nouns; impf/perf + reference form for verbs; agreement for adjectives; role for function words); inflected entries name their lemma; adds usage notes only when they earn their keep. Average analysis length grew 33 → 95 chars. If you add new entries, follow the same conventions.
3. **vocabulary.json `literal`/`natural` fields still have data bugs** the analysis-pass subagents flagged but didn't touch (preservation rule held): `рот`→"mouthpiece" (means mouth), `комплекс`→"complexion" (means complex), `лист`→"leaflet" (means leaf/sheet), `тихо`→"quiet on" (broken; means quietly), `сотрудник`→"staffer" (more naturally employee), plus ~30 entries with embedded Cyrillic leaked into the English `natural` field (e.g. `начальник` → `"Boss; начальник."`, `берег` → `"Shore; берег; bank (of river)."`). Owner hasn't decided whether to do a separate literal/natural cleanup pass.
3. **ё/е inconsistency.** Source data sometimes uses bare `e` where modern orthography wants `ё` (e.g. `черный`, `темный`, `желтый`, `ребенок`). My frequency-gulag rewrite uses `ё` in `phrase` while keeping the source spelling in `word`. The TypingEngine matches char-by-char case-insensitive, so `ё` must be typed as `ё` — if owner mentions typing-engine ё/е friction, that's the source.
4. **Two parallel lesson registries** — `lessons/index.js` is the source of truth, `lessonSets.js` is a re-export. Edit `lessons/index.js`.
5. **TypingEngine input is case-insensitive but otherwise strict** — em-dash `—` (U+2014) must be typed as em-dash; commas/periods all must be typed. Spelled-out numerals only (no digits).
6. **Branch chaos.** `stash` is the live working branch; `main` lags behind. Commits like `"????? error fixed"` exist. Don't assume `git log` reads like a clean changelog.
7. **Dev artifacts** in repo root: `tmp-devwsl*.{out,err}`, empty `next` and `cyrillic-type-speak@0.1.0` files. Probably leftovers from `dev-wsl.js`. Don't touch unless owner asks.

## Work done previously (most recent first)

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
