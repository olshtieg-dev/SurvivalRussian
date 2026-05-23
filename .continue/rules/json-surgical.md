---
name: JSON Surgical Editing
---

Use this rule only when the active file is `src/data/vocabulary.json`.

When editing that file:

- Only change the smallest possible section needed to satisfy the request.
- Preserve existing key order, indentation, quoting style, and formatting.
- Do not rewrite untouched entries or reformat the whole file.
- Do not add explanations, commentary, or extra examples inside the file.
- If adding a new entry, match the surrounding schema and style exactly.
- Prefer one localized entry at a time.
