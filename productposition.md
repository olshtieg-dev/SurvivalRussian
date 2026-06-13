# SurvivalRussian — Product Positioning

> Living strategy doc. Add ideas freely. Last touched 2026-06-13.

## One-line

SurvivalRussian is a **typing-and-reading booster** that takes a minus-A1 learner to fast, accurate, functional literacy in Cyrillic — the one skill that audio courses and live conversation both skip.

## We have no competitors. We have partners.

We are not trying to replace how people learn Russian. We plug the hole the good methods leave open. The honest sell is the **division of labor** — each tool owns the skill it is best at, and ours is the missing leg.

| Tool | Builds | Deliberate blind spot |
|------|--------|-----------------------|
| **Pimsleur** | Ear and mouth — phonology, prosody, graduated-interval recall | Audio-only; you finish it still unable to **read or type**. Barely touches Cyrillic. |
| **Language exchange** (e.g. RU↔EN partners) | Fluency under real pressure, register, live nerve | Unstructured, partner-bottlenecked, can't grind it solo at 11pm. |
| **SurvivalRussian** | **Eyes and fingers** — fast accurate text production/reading in Cyrillic, with grammar exposure baked into every sentence | Not audio, not live conversation. By design. |

Pimsleur does the ears. Exchange does the live nerve. We do text-at-speed. Three different animals, one learner, no overlap to fight over.

**The proof point:** on RU↔EN exchanges, natives are routinely floored that a learner can *type fast* in Russian. Almost nobody trains it — most learners are slow, hunt-and-peck, JCUKEN-illiterate, fighting the keyboard instead of the language. Remove that friction and text exchange goes from chore to something you can keep pace with a native in. The cognitive load that *would* go to "where is the ы key" goes to the conversation instead. That is our edge, and the positional-keyboard work (`event.code`/JCUKEN, OS-layout-independent) is what serves it.

## Who it is for

- **Floor:** minus-A1 — zero Russian, can't read Cyrillic.
- **Realistic ceiling:** A2→B1 **functional reader/writer**. Can read the menu, type the message, follow the thread, handle daily survival communication in text.
- **What it is NOT:** it does not produce native phonology, intuitive case/aspect, or a "gopnik fluency" — nobody types their way to native intuition. That is the *fluency* fantasy; we deliver the *literacy* reality. (See "Why the thesaurus method doesn't apply" below.)

The high-frequency core does the heavy lifting: the top ~2–3k word families cover ~90–95% of everyday text (Nation). The systematic frequency-list buildout (nouns/verbs/adjectives/adverbs) installs exactly those anchors.

## Pedagogy stance

### Frequency-first, sentence-context vocabulary
Lessons are built **by high-frequency target word**, each wrapped in ~10 natural sentences. The payoff is the *surrounding* words: they accumulate into a large, organically-distributed vocabulary anchored to real grammar — contextual growth without the cost of synonym-clustering (below).

### Receptive vs. productive bands (`band` flag)
Not every word should be *produced*. Some you only need to **recognize**. We tag content with a `band` flag:

- **`band: "receptive"`** — recognition-only. Shown, glossed, drilled for "hear it / read it → know it", but **never** asked of the learner to generate. First instance: the **Slang (Recognition)** set (`slang-receptive.json`, set id `slang-receptive`). Clean only — мат is hard-walled out of both bands; soft softeners (блин, чёрт) are allowed for recognition.
- **(default / productive)** — everything else; typed and produced.

Status: the flag is **data only** today — it sits on the set object and on each mission. The typing engine does not yet enforce read-only, so receptive items are still typeable for now. When a read-only mode is wired, gate production on this flag. No architecture change needed; it's a flag on data already flowing through the registry.

Why this matters pedagogically: a whole tier of Russian is comprehension-critical but production-optional — discourse filler (короче, ну, вот, типа), gopnik/colloquial markers (бабки, тачка, мент, тусить), texting shorthand (спс, прив, норм). Not knowing them wrecks comprehension; producing them makes a foreigner sound off. Recognize, don't generate.

### Why the thesaurus / synonym method doesn't apply here
Recorded because a stakeholder keeps raising it. A thesaurus is a **vocabulary-*deepening*** tool — it swaps a known concept's label for a fancier one. It works for an advanced learner who already has the full grammar system, multiple anchor languages, and the meta-skill of language study (e.g. a native-Russian polyglot polishing English essays). It does **nothing** for a minus-A1 learner, because:

- There's no concept slot yet to deepen — every synonym is just a *second* unknown word competing with the first.
- The competition is the documented **interference effect** (Tinkham 1997, Waring 1997): teaching synonyms/antonyms together *slows* beginner acquisition. Worse in Russian, where each "word" is a whole declension/conjugation paradigm.
- It produces **content without system** (decorated but wobbly grammar) — the opposite of what a beginner needs and the opposite of a fluent-but-crude native speaker (system without content). You cannot thesaurus your way to either competence or fluency.

We already absorbed the *good* half of that idea — contextual vocabulary growth — via frequency-anchored sentences, and discarded the half that doesn't transfer to beginners. This is also why `vocabulary.json` deliberately biases synonym/antonym fields toward **blank**.

## Idea backlog (add freely)

- **Enforce the receptive band in the engine** — read-only mode: present the sentence + gloss, advance on a recognition action (reveal / self-rate / tap-to-continue) instead of requiring a typed match. Gate on `band: "receptive"`.
- **Expand the receptive slang set** — more discourse filler, gopnik/colloquial markers, internet/texting shorthand. Keep it clean; hard-wall мат. Possibly sub-bucket (filler / slang-noun / texting).
- **Gopnik *flavor* mode (optional, vibe not pedagogy)** — colloquial/slang sentence frames as an alt corpus over the same engine. A content choice, not a method.
- **Companion framing in onboarding/marketing** — explicitly tell users "use this alongside Pimsleur + a language exchange", with the division-of-labor table. Lean into "partners, not competitors."
- **Typing-speed metric as the headline outcome** — WPM-in-Cyrillic is our differentiator; surface it, track it, celebrate it. It's the thing natives are impressed by.
- **Recognition-only drills sourced from exchange chat logs** — let learners paste real chat slang they didn't understand and turn it into receptive cards.

---
*Conventions: this is product strategy, not engineering state. For repo/data state see `CLAUDE.md`.*
