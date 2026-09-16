# Stress Bifurcation Rollout — progress log

> Owner-named tracking file for the blanket stress-mark rollout across `vocabulary.json`.
> **Future Claude: read this top-to-bottom to pick up.** Also read the `senses`/homograph
> section in `CLAUDE.md` (mechanism + the two hard constraints) — this rollout builds on it.

## Goal

Put a stress mark (combining acute, U+0301, `́`) on the stressed vowel of every
multisyllabic Russian display form, so learners internalize stress the way natives do.
Stress marks live ONLY in the `cyrillic` display field (shown in MeaningCard + the per-token
gloss chips). They are **never** in the typed `phrase` (untypeable) and **never** in a
vocabulary KEY (the normalizer doesn't strip `\p{M}`, so an accented key won't match a bare
typed token). Owner chose an **authoritative dictionary** as the stress source.

## Current state (2026-09-16) — B1+B2+B3 DONE

Vocabulary = 13,863 entries. **12,075 marked (94.5% of markable), 0 integrity problems.**

| Bucket | Count | Notes |
|--------|------:|-------|
| Marked with stress | 12,075 | authoritative (Zaliznyak + kaikki/Wiktionary) |
| No mark needed (monosyllable) | 565 | unambiguous stress |
| No mark needed (contains ё) | 489 | ё is inherently stressed |
| Compounds / space keys | 38 | deferred to the end |
| **Remaining unmarked** | **698** | 642 ambiguous + 56 absent — see below |

Integrity guarantees enforced on every stamp: exactly one acute per word, sitting on a
vowel, and stripping the acute returns the bare JSON key unchanged (keys never mutated →
typing + lookups untouched, still 0 missing tokens corpus-wide).

## Source (validated)

- **kaikki.org Russian** (Wiktionary machine-readable) — THE wordform source.
  URL: `https://kaikki.org/dictionary/Russian/kaikki.org-dictionary-Russian.jsonl`
  (938 MB, 442,594 entries). Each entry's `forms[].form` carries inflected forms WITH
  stress incl. mobile stress (зонт→зонта́ [gen], зонты́ [nom pl], зонто́в [gen pl]).
  Covered 93% of inflected forms unambiguously.
- **Zaliznyak lemma dict** via `dbklim/StressRNN` →
  `stressrnn/dicts/exception_dictionary.txt` (92k lemmas, `+` after stressed vowel).
  Used for B1 lemma coverage (18.8% alone; superseded by kaikki for the rest).

## Method / reproduction recipe (for future vocab growth)

New vocab entries added later will be unmarked — re-run the join to mark them:
1. `curl -s <kaikki URL> -o /tmp/kaikki-ru.jsonl` (ephemeral; ~76s).
2. Compute the needed set: entries whose `cyrillic` has no acute, key has no space, >1 vowel,
   no ё. (Snippet: vowels `аеёиоуыэюя`; monosyllable/ё ⇒ skip, no mark needed.)
3. Stream kaikki; for each `forms[].form` containing exactly one acute, `bare = form
   without acute (lowercased)`. Collect `bare → Set(accented)` for needed bares
   (case-insensitive; restore the key's leading-capital when stamping).
4. Stamp `cyrillic = accented` ONLY when the set has size 1 (unambiguous). Skip size>1
   (ambiguous → belongs to the `senses` per-occurrence mechanism, NEVER auto-stamp).
5. Invariant-check each stamp (see guarantees above), back up `vocabulary.json`, write, audit.

Scripts used this session were inline `node` one-liners (not saved); the recipe above is
enough to regenerate them.

## Progress

| Batch | Scope | Entries | Source | Backup |
|-------|-------|--------:|--------|--------|
| B0 | Homographs (senses pass) | 25 | manual/authoritative | `vocabulary.json.bak.pre-stress-homographs` |
| — | Monosyllables + ё (no mark) | 1054 | n/a | — |
| B1 | Lemma stress marks | 2,400 | Zaliznyak (StressRNN dict) | `vocabulary.json.bak.pre-stress-B1` |
| B2 | Wordform stress marks | 9,621 | kaikki.org (Wiktionary) | `vocabulary.json.bak.pre-stress-B2` |
| B3 | Case-insensitive recovery (proper nouns etc.) | 29 | kaikki.org | (in B2 file) |

## Remaining work (698 unmarked + 38 compounds)

1. **642 ambiguous-in-dictionary** (`еду` е́ду/еду́, `дорогой` доро́гой/дорого́й, `паспорта`,
   `готов`, `правило`, `замок`-class …). Real heteronyms — intentionally left bare. The
   correct fix is per-occurrence `senses` tags where they actually appear in lesson phrases
   (like the стоит pass). NEXT-BEST STEP: scan the corpus for which of these 642 actually
   occur, and add `senses` for those (the rest can stay bare — they never surface).
2. **56 absent-from-dictionary**, three kinds:
   - **ё-less spellings** (~40): `темный`→тёмный, `актер`→актёр, `берешь`→берёшь,
     `тяжелая`→тяжёлая, `подошел`→подошёл … The stress IS the ё. Best handled by the
     deferred ё-normalization (CLAUDE.md landmine #4): convert е→ё (ё shows stress
     inherently, no acute needed). Until then they render unmarked.
   - **comparatives** (~10): `новее`, `теплее`, `холоднее`, `пошире`, `мельче` … not listed
     as kaikki forms. Small targeted pass (most short-adj comparatives are end-stressed
     -е́е; verify individually).
   - **data typos** (~5): `огурецы`/`огурецов` (should be огурцы/огурцов), `свежеее`
     (свежее), `пожи`, `мурка`. Pre-existing vocab spelling bugs — fix the entry (and the
     lesson phrase that introduced it) or drop; not a stress problem.
3. **38 compounds / space keys** — their `cyrillic` is already an overridden hyphenated
   display form; add stress last, by hand or a small targeted join.

## Resume here

Rollout is ~94.5% complete and integrity-clean. Highest-value next step: **(1)** corpus-scan
the 642 ambiguous forms and add `senses` for the ones that actually occur in lessons. Then
**(2)** the ё-normalization pass (also clears ~40 of the absent set). Comparatives, typos,
and compounds are small cleanups after that.
