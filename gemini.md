# Project: Cyrillic Type & Speak (Agentic Execution Plan)

## 🎯 Project Vision
A multimodal language learning application that teaches the Cyrillic alphabet and survival Russian through a "Triple-Threat" feedback loop:
1. **Physical:** Muscle memory via typing on a standard JCUKEN layout.
2. **Visual:** Immediate semantic reinforcement via thumbnails and literal/natural translations.
3. **Auditory:** AI-powered phonetic grading using voice recognition to verify pronunciation.

---

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React (initial thumbnails/UI)
- **Audio:** Web Audio API + Gemini/Whisper API for phonetic analysis
- **Data Management:** Local JSON mapping for Alphabet and Vocabulary

---

## 🏗 System Architecture (ExecPlan)

### Phase 1: Data & Scaffolding [IN PROGRESS]
- [x] Initialize Next.js project.
- [ ] Define `alphabet.json` (Character mapping: Cyrillic <-> QWERTY).
- [ ] Define `vocabulary.json` (Words, literal meanings, natural meanings, icon paths).
- [ ] Set up folder structure (`/components`, `/hooks`, `/data`).

### Phase 2: The Typing Engine (Logic)
- [ ] Create `useKeyboard.js` hook to intercept and map keystrokes.
- [ ] Build `TypingDisplay.jsx` to render target text with "active/error" states.
- [ ] Implement JCUKEN layout visualizer (on-screen keyboard helper).

### Phase 3: The Semantic Layer (Visuals)
- [ ] Build `MeaningCard.jsx` to display thumbnails and dual-translations.
- [ ] Implement "Trigger Logic": When a word is completed, reveal the image and meaning.

### Phase 4: The Phonetic Engine (Audio)
- [ ] Set up `AudioRecorder.jsx` using Web Audio API.
- [ ] Create API Route `/api/evaluate-pronunciation` to send audio to Gemini for grading.
- [ ] Implement feedback UI (Waveforms or "Try Again" prompts).

---

## 📊 Data Structures

### Alphabet Mapping Sample
```json
{
  "key_q": { "cyrillic": "Й", "phonetic": "yuh", "finger": "Left Pinky" },
  "key_w": { "cyrillic": "Ц", "phonetic": "ts", "finger": "Left Ring" }
}

### Vocabulary Sample

{
  "word": "вода",
  "literal": "water",
  "natural": "water",
  "thumbnail": "water-drop.svg",
  "difficulty": "survival"
}
