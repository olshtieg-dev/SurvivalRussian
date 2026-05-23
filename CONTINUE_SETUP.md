# Continue Setup for SurvivalRussian

This repo now includes a small Continue rule and prompt designed for surgical
edits in `src/data/vocabulary.json`.

These are intentionally file-scoped helpers, not general-purpose workspace
rules.

## What this is for

Use Continue's `Edit` mode, not Chat/Agent mode, when you want a single JSON
entry filled in at the cursor. That keeps the scope narrow and avoids the
chainsaw effect.

## Recommended workflow

1. Highlight the exact spot in `vocabulary.json` where the new entry belongs.
2. Press `Ctrl/Cmd+I` to open Continue Edit.
3. Ask it to fill the entry only.
4. Accept the inline diff if it matches the surrounding entries.

## Add this repo rule to Continue

In your Continue config, point a rule at:

`file:///home/c/Code/SurvivalRussian/.continue/rules/json-surgical.md`

Only enable it for `src/data/vocabulary.json`.

## Add this repo prompt to Continue

In your Continue config, point a prompt at:

`file:///home/c/Code/SurvivalRussian/.continue/prompts/fill-vocabulary-entry.md`

Only invoke it when `src/data/vocabulary.json` is the active file.

## Model choice

Continue is provider-flexible, but you still need to choose a model/provider.
For this use case, pick a strong edit-capable model and, if available, a faster
autocomplete model separately.

If you want, I can write the exact `~/.continue/config.yaml` for one of these:

- OpenAI
- Anthropic
- Ollama
- Continue account / hub config
