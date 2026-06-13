# SurvivalRussian — Broadening Gameplan (speculation, 2026-06-12)

> **Status: planning only. Nothing here is built.** A parallel session is actively
> editing `conversation/` lessons + `vocabulary.json` — **do not touch any data
> files or shared modules while that's in flight.** This doc is a map + sequencing,
> not a license to start cutting.

## The goal in one line

Turn the app from an "information buffet" (great for the owner, who built it for
himself) into something an average learner can *start* — without losing what makes
it work: it **forces you to learn by typing variations on a word, and that's why it
sticks.** The plan is a right-side consolidation that makes the UI focused, then a
push to finish the lesson corpus into a genuinely exhaustive course, then the
guest/onboarding and monetization layers. Shape it broadly like Bluebird's banded
structure, layered on top of what we already have.

## Priority order (owner, 2026-06-12)

- **STEP 1 — Right sidebar UI consolidation (do this FIRST, before the guest
  handler).** The right rail becomes the home of the curated lesson system + login,
  and absorbs some controls currently on the left, so the whole thing is focused and
  not scrolly. It is the **mirror opposite of the left rail.**
- **STEP 2 — Finish the lesson sets into a truly extensive course.** Complete the
  subject-matter coverage so the corpus demonstrates *all* features of Russian while
  describing in detail what's happening in each sentence (the analysis box already
  does this — we just finish the breadth). If it ends up at ~10k unique sentences, so
  be it.
- **THEN** — guest handler / onboarding triage, stats+SRS, and monetization (the
  workstreams below), in that rough order.

---

## What already exists (don't rebuild these)

The repo already has **two front-ends**, and the typing one is surprisingly mature:

**A. Adaptive typing tutor** (`mode: 'structured'`)
- `src/hooks/useTypingProfile.js` — per-key mastery, progressive key-unlock,
  **blind-run gating** (master the active set blind → unlock the next key),
  `phase: 'onboarding' | 'adaptive'`, stage recommendation (0–3), settings.
  Persists to localStorage `survival-russian-typing-v1`.
- `src/lib/typing/` — `mastery.js`, `onboarding.js` (3 home-row drills then "pushed
  out of the nest" into adaptive), `generateDrill.js`, `pseudoWords.js`, `wordPool.js`,
  `speech.js`.
- `src/components/typing/` — `DrillView`, `JcukenKeyboard`, `MasteryLadder`,
  `FallingWordsGame`, `SpeechControls`.
- This already teaches **the keyboard itself** (JCUKEN positions) from home row up.

**B. The lesson "buffet"** (`mode: 'game'` / main page)
- `src/app/page.js` (652 lines) — mission state machine, persistence to
  `APP_STATE_STORAGE_KEY`, left `<aside>` sidebar, renders `MeaningCard` +
  `SentenceStructuralAnalysis` (the interlinear gloss box).
- `src/data/lessons/index.js` — the registry: `lessonSets[]` (Essentials, Street
  Russian, Grocery, Cases & Nouns, Kitchen, Household, Random Vocab, 1000 Word Gulag)
  + the systematic content-word families: `nouns/` (917), `verbs/` (104),
  `adjectives/` + `binary-adjectives/` (95), `adverbs/` (98), `conversation/`,
  `lexical-sets/`, `comparisons/`, `pro-forms/`, `spatial-motion/`.
- `src/hooks/useTypingSession.js` — already detects sentence completion (the hook
  every stat/SRS feature should subscribe to).

**Implication:** the four asks below are mostly a *connective tissue* layer — a
triage gate, a sequencer, a stats store, and an auth/sync+ads shell — over these two
engines. We are not starting from zero on any of them.

---

## Workstream 0 — Right sidebar consolidation (STEP 1, UI priority, before guest handler)

**Ask:** add a right `<aside>` that is the **mirror opposite of the left rail**, and
make it the home of the curated lesson system + login, pulling some controls off the
left so the layout is focused and not scrolly. This comes *before* building any
guest/login handler — get the shell and the space right first.

**Plan:**
- New right `<aside>` in `page.js`, structurally mirroring the existing left `<aside>`
  (`src/app/page.js:457` is the left one — mirror its container/refs/outside-click
  pattern on the right).
- **Move from left → right:** the curated lesson navigation, the login entry point
  (placeholder until WS3 builds real auth), and whichever secondary controls overload
  the left rail today. Decide the exact split with the owner before moving anything.
- Center column (typing surface + interlinear gloss box) stays the focal point;
  left/right rails flank it. **This is also where the future ad gutters compete for
  space — settle the center/left/right geometry now so nothing has to move twice.**
- Stats + SRS UI (WS2) will later live in this right rail too, but the rail/layout is
  built first as its own step.

## Workstream 1 — Onboarding triage gate

**Ask:** poll whether the user can even touch-type QWERTY, let alone Russian, before
the app is usable; route accordingly.

**Plan:**
- First-run gate (extend `WelcomeOverlay.jsx`, which already explains positional
  input) that asks 1–2 questions and optionally runs a short objective calibration.
- Three routes:
  1. **Can't touch-type QWERTY** → send to keyboard fundamentals (the structured
     adaptive engine, home row first). Set expectation that Russian typing here
     assumes positional touch typing.
  2. **Touch-types QWERTY, not Russian** → structured engine starting at home row,
     skip latin remediation; lean on the positional JCUKEN mapping.
  3. **Already types Russian** → skip structured onboarding, call
     `completeOnboarding()`, drop straight into the curriculum.
- **Self-report + a real calibration drill** (recommended): a short Latin line then a
  short Cyrillic line, measured via the existing `useTypingSession` (wpm/accuracy),
  so the route is confirmed by behavior, not just a claim.
- Persist the answer in the typing profile (a new `entryRoute` field) — **planned
  edit to `useTypingProfile.js`, deferred** until the other session is done.

## Workstream 2 — Curriculum (incremental feed, not the buffet)

**Ask:** feed lessons incrementally; at each checkpoint ask **Continue / Revisit
previous / go play Random (freeball the buffet)** — learner's choice.

**Plan:**
- New `src/lib/curriculum/` — an **ordered path** over existing content, mirroring
  Bluebird's bands using material we already have:
  - Core Vocabulary → `nouns/` families
  - Essential Verbs → `verbs/`
  - Creating Sentences → verb sentence decks
  - Powerful Phrases → `conversation/` + `lexical-sets/`
  - Conversation → `conversation/`
  (We already have the raw decks to populate all five bands — this is sequencing
  metadata, not new lessons.)
- New `useCurriculum` hook: tracks position in the path, feeds **N missions per
  batch**, and at batch end shows the 3-way prompt (continue / revisit / random).
- Keep the full buffet reachable as an explicit **"free play"** entrance (preserves
  the owner's own workflow — the buffet stays, it's just no longer the front door).
- New localStorage namespace (a 3rd key, e.g. `survival-russian-progress-v1`),
  designed from day one to be swappable for server sync (Workstream 4).

## Workstream A — Finish the lesson corpus into an exhaustive course (STEP 2)

**Ask:** complete the subject-matter coverage so the corpus demonstrates **all
features of the Russian language** while describing in detail what's happening in each
sentence. The teaching mechanism — typing variations on a word until it sticks —
already works; this is about **breadth**, not new mechanics. Target is whatever it
takes; ~10k unique sentences is fine. The bar is an **educational masterpiece**, not
just a bigger pile of sentences.

> **The thesis for Step 2 (the move that makes it a masterpiece):** the systematic
> content-word families already give us strong *vocabulary* breadth, so the likely
> remaining gap is *grammar-phenomenon* breadth — making sure every feature (all cases
> incl. plural, full aspect, motion verbs w/ prefixes, participles/gerunds,
> conditional/imperative, numeral agreement, genitive-of-negation, etc.) is actually
> **demonstrated and explained**, not just that every frequent word appears. So the
> **first move of Step 2 is a coverage audit keyed to grammar features**, producing a
> checklist of what's demonstrated vs. missing — then we write sentences to fill the
> *gaps*, rather than writing more sentences blindly. Vocabulary breadth is the
> by-product; grammar-feature completeness is the goal.

**Plan:**
- Keep the proven pipeline from `CLAUDE.md` (manifest → parallel-subagent lesson gen →
  per-form vocab fill → 0-missing-token scan → commit when owner asks). It already
  produced 917 nouns / 104 verbs / 95 adjectives / 98 adverbs at 0 missing tokens.
- **Coverage audit first:** enumerate the grammar features Russian must demonstrate
  (all 6 cases incl. plural; full aspect system; verbs of motion w/ prefixes;
  participles & gerunds; conditional/imperative/subjunctive; comparatives/superlatives;
  numerals + agreement; reflexives; negation/genitive-of-negation; word order &
  emphasis; etc.) and check which already have deck coverage vs. gaps. The systematic
  content-word families cover *vocabulary* breadth well; the gap is likely *grammar-
  phenomenon* breadth — make sure every feature is demonstrated and explained, not
  just every frequent word.
- Each sentence keeps the detailed `fullAnalysis` interlinear breakdown (the four
  renderer modes in `SentenceStructuralAnalysis.jsx`) — that "describe what's
  occurring" layer is the product's spine.
- **Coordinate hard:** this is the same surface the parallel session is editing right
  now (`conversation/`, `vocabulary.json`). Don't start corpus work until that lands,
  and never edit `vocabulary.json` concurrently (use the `/tmp/*-out-N.json` merge
  pattern).
- Bluebird-band mapping (Core Vocabulary / Essential Verbs / Creating Sentences /
  Powerful Phrases / Conversation) doubles as a **coverage checklist** for what a
  "complete" course should contain.

## Workstream 3 — Stats + spaced-repetition refeed (lives in the WS0 right rail)

**Ask:** store completion stats (count / when) to drive a simple algorithm that
refeeds sentences; or let power users freeball.

**Plan:**
- Per-mission stats keyed by mission `id`: completion count, last-seen timestamp,
  accuracy. Populate from `useTypingSession`'s existing completion event.
- **Simple SRS** to start — Leitner buckets or time-decay "due" scoring; refeed
  missions whose interval has elapsed. Don't over-engineer; a 3–5 box Leitner is
  plenty for v1.
- "Freeball" mode = bypass SRS, draw straight from the big sentence lists.
- UI surfaces in the right rail built in WS0.

## Workstream 4 — Monetization + persistence tiers (sequence LAST)

**Ask:** two Google ads flanking the interlinear gloss box; paid users auth via
Google account with server-stored progress; free users get client-side storage
(losable, accepted).

**Plan:**
- **Layout:** two ad slots in the gutters beside the gloss box (the
  `MeaningCard`/`SentenceStructuralAnalysis` region). This competes for horizontal
  space with the new right sidebar — **resolve the center/gutter/sidebar layout once,
  up front**, before either ads or the right sidebar land.
- **Free tier:** localStorage only (the curriculum + stats stores from WS2/WS3).
- **Paid tier:** Google Identity Services / OAuth login → progress synced server-side.
  Needs a backend store + an API route. We already run custom servers (`server.js`,
  `chatSocketServer.js`); Firebase is a low-friction option (or a small DB behind a
  Next API route). **Design the WS2/WS3 stores behind a storage interface** so
  local↔server is a swap, not a rewrite.
- **Reality check:** AdSense approval has policy/traffic prerequisites; treat ads as
  a later milestone, not a quick drop-in.

---

## Suggested sequence

1. **STEP 1 — WS0 right sidebar consolidation.** Build the right rail (mirror of the
   left), move the curated lessons + login entry + chosen left controls into it, and
   settle the center/left/right geometry (accounting for future ad gutters). UI gets
   focused and non-scrolly. **Before** any guest handler.
2. **STEP 2 — WS-A finish the lesson corpus.** Coverage audit → fill the grammar/
   subject-matter gaps so the course is exhaustive. Coordinated with the parallel
   data session; no concurrent `vocabulary.json` edits.
3. **WS2 curriculum sequencer** — the incremental feed + Continue/Revisit/Random
   checkpoint, presented through the WS0 right rail. The core fix for "too much, don't
   know where to begin."
4. **WS1 onboarding/guest triage** — route by typing ability; build the real guest
   handler now that the UI shell exists.
5. **WS3 stats + SRS** — builds on the WS2 progress store, surfaces in the WS0 rail.
6. **WS4 auth + server sync + ads** — last; depends on all the above and on the
   geometry locked in step 1.

## Open decisions for the owner

- **Curriculum order:** mirror Bluebird's 5 bands exactly, or a custom order over our
  existing families?
- **Onboarding:** self-report only, objective calibration only, or both?
- **Paid backend:** Firebase vs. custom API + small DB (SQLite/Postgres)?
- **Right sidebar vs. ad gutters:** do both fit, or does one win the right gutter?
- **Scope of "usable" gating:** hard block (can't proceed until calibrated) or soft
  nudge (recommend a route, let them skip)?

## Coordination / guardrails

- Parallel session owns `conversation/` + `vocabulary.json` right now — **no data or
  shared-module edits until it lands.**
- New stores get **new localStorage namespaces**; don't overload
  `survival-russian-typing-v1` or `APP_STATE_STORAGE_KEY`.
- Honor existing landmines (positional input only — no `event.key` passthrough;
  heterogeneous lesson schemas; ё/е normalization). See `CLAUDE.md`.
- Owner runs their own git workflow — **don't commit unless asked.**
