# SurvivalRussian — Orientation Notes

Self-note for future Claude sessions. Owner is `fordted438@gmail.com`. Working dir `/home/c/Code/SurvivalRussian`.

## Pickup for next session (last touched 2026-06-05)

On branch `main`, pushed to `origin/main`. **The 2026-06-05 session's work is committed as `9859f59`** ("feat(lessons): natural-sentence expansion, adverbs family, vocab fills"), parent `b32ba0f`. That single commit rolled up the lesson-phrase expansion, the per-form vocab fills, the new `adverbs/` family, AND the previous session's still-uncommitted lesson taxonomy (253 files). A follow-up doc commit records this hash. Start by re-orienting: read this file top-to-bottom, then `git status`/`git log` to confirm.

What went into this commit (working-tree snapshot at session end): ~88 modified tracked files + the new untracked taxonomy — including 158 untracked lesson `.json` files (98 of them the new `adverbs/`, the rest the prior session's binary-adjectives/comparisons/nouns/pro-forms additions) and 7 new `adverbs/**/index.js` files, plus `src/data/vocabulary.json` grown to **4618 entries**. The `.bak` files (`vocabulary.json.bak.pre-expand-fill`, `.bak.pre-adverb-fill`, and older ones) are intentionally untracked — confirm with the owner before adding them to git.

> **Note on the stale earlier snapshot:** a prior session's pickup text claimed "only CLAUDE.md is modified" — that was already wrong when picked up. The tree in fact held a whole new lesson taxonomy (binary-adjectives, comparisons, nouns/{abstract,body-person,household,motion-location}, spatial-motion, verbs/{first,second,mixed-conjugation,irregular}, pro-forms, lexical-sets, conversation) plus a grown vocabulary.json. Always trust `git status` over the prose snapshot.

### Project vocabulary-building strategy (owner's stated goal — 2026-06-05)

The lesson taxonomy is being built **systematically by high-frequency target word**, not by canned themed sets. Concretely, the target coverage is:

- **~100 most common verbs** (subdivided by category — conjugation class: 1st-conj, 2nd-conj, mixed, irregular; and aspect/motion where relevant) — **DONE: 104** (16 original + 88 added 2026-06-05; new ones are 10-mission, the original 16 are 20-24-mission),
- **~100 most common adjectives** — **currently 20** (10 binary antonym pairs; six pairs only have 5 missions, under the ~10 target). **Owner preference (2026-06-05): favor BINARY antonym pairs wherever applicable** — descriptive adjectives mostly come in opposites (большой/маленький, тёплый/холодный), and teaching them paired reinforces the nature of description. Keep building in the `binary-adjectives/` pair format; only fall back to a standalone adjective lesson when a word has no natural antonym,
- **~100 most common adverbs** — **DONE: 98** (built 2026-06-05; `adverbs/` family, 6 semantic buckets),
- **~300+ most common nouns** — **currently 40** (4 buckets of 10: abstract, body-person, household, motion-location).

Coverage scorecard (2026-06-05): adverbs ✅ and verbs ✅ ~done; **adjectives and nouns still below target** (adjectives ~20/100, nouns ~40/300). Selection source for "most common" is `src/data/russian-frequency-1-1000.json` (`words[]`, rank order, NOT POS-tagged — needs filtering). Deictic adverbs (там, тут, как, когда, сейчас, etc.) live in `pro-forms`, not `adverbs/`, to avoid duplication. Aspect-pair note: the verb set deliberately includes both members of ~10 impf/perf pairs (понять/понимать, взять/брать, etc.) for aspect contrast.

Each target word gets its own lesson with **~10 example sentences** (missions) — "around 10ish" is the sweet spot; 100 is overkill, don't pad. The sentences are natural daily Russian built *around* the target word. The payoff: the **surrounding words** in those ~10 sentences accumulate into a large, usable, organically-distributed vocabulary — a systematic alternative to hand-curated themed packs (household items, grocery shopping, gardening, etc.). Themed/canned sets still exist (`conversation/`) but are not the backbone.

**Operating procedure when authoring/expanding lessons under this strategy:**
- Phrases: natural everyday Russian, ~4–9 words, capitalized, ё-correct, ending in `.`/`?`/`!`, prominently featuring the target word. Only typeable punctuation (`. , ? ! - —` — see Landmine #6). Numbers spelled out.
- `fullAnalysis`: flowing prose (not numbered `1. 2. 3.` lists), keep the `Strategic focus: <topic>.` lead.
- **After any phrase change, always run the missing-token scan + per-form vocab fill** (see work log) so no phrase produces a blank MeaningCard. Subdivide verbs into subgroups for the fill to keep batches tractable.

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

**Repo state (as of 2026-06-05, committed `9859f59` + a doc follow-up, pushed to `origin/main`):**
- Branch: `main`. (Other branches `stash`/`staging`/`testing` still exist; `main` is the active working branch.)
- The taxonomy through the adverbs build + `vocabulary.json` at 4618 entries was committed as `9859f59` and pushed. **Then the verb expansion (16→104) landed as a new uncommitted diff** — 88 new `verbs/**/*.json`, the 4 regenerated `verbs/*/index.js`, and `vocabulary.json` now at **5458 entries**. Not yet committed. Intentionally-untracked `.bak` files now also include `vocabulary.json.bak.pre-verb-fill`. Re-confirm with `git status`.
- Backups from the 2026-06-05 work: `src/data/vocabulary.json.bak.pre-expand-fill` (pre first vocab fill), `src/data/vocabulary.json.bak.pre-adverb-fill` (pre adverb fill), and a full lessons-dir snapshot at `/tmp/lessons-backup-preexpand` (pre phrase-expansion; ephemeral — `/tmp`).
- Untracked: `src/data/vocabulary.json.bak`, `src/data/vocabulary.json.syn-ant-clean.bak`, `src/data/lessons/frequency-gulag.json.bak` (owner-authored older backups, intentionally untracked).
- Owner runs their own git workflow. **Do NOT commit unless explicitly asked.** Do not push unless asked.
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
- keyboard input → pure positional (commit `b61cb12`): removed the `PUNCT_PASSTHROUGH` `event.key` check that broke э on Dvorak / б on QWERTY; all input now resolves by `event.code` on every layout; punctuation has positional homes (added `Minus` to `alphabet.json` for `-`/`—`). See Landmine #6 + work log.
- lesson phrase expansion (2026-06-05): 1,031 fragment phrases across 51 lesson files (comparisons, conversation, lexical-sets, pro-forms matrices) rewritten into full natural sentences; per-form vocab fill added 282 entries (vocab 3922→4204); 0 missing tokens remain. See work log.
- adverbs family built (2026-06-05): new `adverbs/` taxonomy, 98 adverbs / 6 buckets / 980 missions, wired into the registry; vocab fill 4204→4618; 0 missing tokens. First systematic content-word buildout. See work log.

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
6. **Input is pure positional — everything routes through `event.code` → `alphabet.json` (JCUKEN), fully OS-layout-independent (Dvorak, QWERTY, etc.).** Owner presses the QWERTY-physical position regardless of keycap; this applies to letters AND punctuation alike. There is **no** `event.key` passthrough (removed 2026-06-05 — see work log). The 6 punctuation chars used across all lesson phrases have positional homes: `.` / `,` on Slash (base / Shift), `?` / `!` on Shift+7 / Shift+1, `-` / `—` on Minus (base / Shift). Because resolution is by physical position, JCUKEN б (physical Comma), ю (physical Period), and э (physical Quote) all type correctly on every layout. **Why the passthrough was removed:** it intercepted `event.key` before the code lookup, and `event.key` is layout-dependent — so on Dvorak the physical Quote key emits `-` (ate э) and on QWERTY physical Comma emits `,` (ate б). Pure positional has no such collision. **If a new lesson introduces additional punctuation** (`:`, `;`, `«»`, etc.), give it a positional home by adding a `event.code` entry to `alphabet.json` (and, if the code isn't a `Key*`/`Digit*`, add it to `codeToKeyMap` in `useKeyboard.js`) — do NOT reintroduce an `event.key` passthrough.
7. **Branch chaos.** `stash` is the live working branch; `main` lags behind. Commits like `"????? error fixed"` exist. Don't assume `git log` reads like a clean changelog.
8. **Dev artifacts** in repo root: `tmp-devwsl*.{out,err}`, empty `next` and `cyrillic-type-speak@0.1.0` files. Probably leftovers from `dev-wsl.js`. Don't touch unless owner asks.

## Work done previously (most recent first)

- **Verb family expanded 16 → 104** (2026-06-05, uncommitted — after the `9859f59`/`8ff4854` push). Second systematic content-word buildout. Classified the top-1000 frequency list for verb lemmas via a subagent (the list is already lemmatized), excluding the 16 already covered; owner approved **88 new lemmas** across the existing 4 conjugation folders (first 44, second 31, irregular 12, mixed 1), keeping both members of ~10 aspect pairs. Built a manifest with transliterated filenames + `VB-<FILEBASE>` ids, then **regenerated** the 4 group `index.js` to import existing + new files (preserving each group's exact metadata/export names — `firstConjugationVerbSets` etc.); `lessons/index.js` already imports `verbs` so no main-registry edit. **10 parallel subagents** wrote the 88 lesson JSONs at exactly 10 missions each (880 missions) — each a mini conjugation deck spread across present persons, past genders, future, imperative, infinitive, with aspect partners named and stem mutations handled (скажу, пишу, ищу, возьму, пойду/пошёл, сяду/сел, etc.). NOTE: the 16 original verb lessons remain 20-24 missions — intentional inconsistency for now. Vocab fill: 840 new tokens (verb decks surface many inflected forms of the verbs themselves + surrounding vocab), 12 parallel subagents → `vocabulary.json` **4618 → 5458**, 0 collisions. Final: all index.js pass `node --check`, all JSON valid, **0 missing tokens corpus-wide**. Backup `vocabulary.json.bak.pre-verb-fill`.
- **Adverbs lesson family built from scratch** (2026-06-05, uncommitted). First content-word buildout under the systematic strategy. Classified the top-1000 frequency list (`russian-frequency-1-1000.json`) for genuine adverbs via a subagent, excluding deictic adverbs already covered by `pro-forms` (там/тут/как/когда/сейчас/…). Owner approved a **98-adverb** target set in 6 semantic buckets. Generated the whole family deterministically: `src/data/lessons/adverbs/` with subfolders `time` (25), `place` (14), `degree` (21), `manner` (23), `quantity` (5), `predicative` (10), each with a group `index.js` (auto-generated from a manifest, mirroring the `nouns/` pattern), plus a family `index.js`; wired into `lessons/index.js` (import + `lessonSets` spread + `lessonFolders` with `adverbsFolder`/`adverbsGroupFolders`). Romanized filenames via a transliteration map; per-lesson ids `AD-<BUCKET>-<FILEBASE>`, mission ids `…-NN`. **10 parallel subagents** wrote the 98 lesson JSONs (exactly 10 missions each = 980 missions) in the house style; I passed each agent the exact manifest paths/ids so filenames match the index imports with zero drift. QA caught 4 phrases that used a comparative (больше/проще/тише) instead of the headword — fixed by hand to feature the base adverb. Then the per-form vocab fill: 414 new tokens (adverb sentences pull in rich surrounding vocab — the strategy working as intended), 7 parallel subagents → `vocabulary.json` **4204 → 4618**, 0 collisions. Final state: all 8 new `index.js` pass `node --check`, all lesson JSON valid, **0 missing tokens across the entire corpus**. Backup `vocabulary.json.bak.pre-adverb-fill`.
- **Lesson phrase expansion + per-form vocab fill** (2026-06-05, uncommitted). Continuation of an in-progress task whose conversation context was lost to token exhaustion — reconstructed entirely from the working tree. The task: expand short fragment phrases (e.g. `я в доме`) into full natural daily-Russian sentences (`Сейчас я сижу в доме.`) — capitalized, ё-correct, ending punctuation, target word featured — and convert each `fullAnalysis` from numbered `1. 2. 3.` lists to flowing prose. Families binary-adjectives / nouns / spatial-motion / verbs were already done in earlier sessions; this pass finished the remaining **51 files / 1,031 missions**: comparisons (5), conversation (7), lexical-sets (35), pro-forms matrices (4). Ran **10 parallel Opus subagents** over disjoint file sets; verified 0 fragments left, every mission `id` preserved, no missions added/dropped, no digits or non-typeable punctuation. Then ran the missing-token scan (mirroring `page.js`'s `normalizeVocabularyKey`: NFC + lowercase + `\p{P}\p{S}` strip): **282 unique new tokens** (384 occurrences) would have produced blank MeaningCards. Filled them with **6 parallel Opus subagents** (verbs subdivided into their own batches), each writing to a `/tmp/vocab-fill-N.json` so the 3922-entry file was never edited concurrently; merged in one Node pass — vocab **3922 → 4204**, 0 collisions, 0 Cyrillic leaks in `natural`. Final re-scan: **0 missing tokens** across all lessons. Space-tokenized hyphenated compounds (кое-что, почему-то, когда-нибудь, etc.) keep the space key for lookup with the hyphenated form in `cyrillic`. Backups: `vocabulary.json.bak.pre-expand-fill` + lessons snapshot at `/tmp/lessons-backup-preexpand`. This pass is the first concrete execution of the "systematic by high-frequency target word" strategy recorded in the Pickup section.
- **Keyboard input → pure positional; removed `PUNCT_PASSTHROUGH`** (2026-06-05, commit `b61cb12`). Owner reported э not typing on Dvorak and б not typing on QWERTY. Root cause: the `PUNCT_PASSTHROUGH` `event.key` check at the top of `useKeyboard.js` ran before the `event.code` JCUKEN lookup, and `event.key` is layout-dependent — physical Quote emits `-` on Dvorak (ate э) and physical Comma emits `,` on QWERTY (ate б). Deleted the passthrough block entirely so all input resolves by physical position via `event.code`, identical on every OS layout. Gave the 6 lesson-punctuation chars positional homes: `.`/`,` already on Slash (base/Shift); `?`/`!` already on Shift+7/Shift+1; added a `Minus` entry to `alphabet.json` (`-` base, `—` Shift) and `"Minus": "Minus"` to `codeToKeyMap`. Side benefit: em-dash `—` is now typeable for the first time (Shift+Minus) — the old passthrough never fired for it since no key emits that char. Updated Landmine #6. Files: `src/hooks/useKeyboard.js`, `src/data/alphabet.json`.
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
