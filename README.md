SurvivalRussian

AI-assisted multimodal Russian learning system focused on real-world language production.

🧠 Overview

SurvivalRussian is a full-stack language learning platform designed around active recall and output-based learning, rather than passive recognition.

The system integrates typing, speaking, listening, and contextual understanding into a single feedback loop to accelerate practical language acquisition.

⚙️ Core Features
⌨️ Cyrillic Typing Engine
Learn Russian through direct keyboard input (RU layout)
Built-in typing trainer for users unfamiliar with Cyrillic
Reinforces spelling, muscle memory, and recall simultaneously
🔊 Speech + Pronunciation Feedback
Text-to-speech playback for all words and phrases
User voice recording and sampling
Audio is sent to an AI API for pronunciation analysis
Returns concise feedback on:
mispronounced sounds
stress issues
phonetic inaccuracies
🧠 Contextual Vocabulary System

Each word includes:

Natural meaning + literal meaning
Grammatical usage
Synonyms & antonyms
Visual association (image-based reinforcement)
📖 Grammar Breakdown Engine
Sentences include AI-generated grammatical explanations
Short-form (1–2 paragraph) breakdowns
Focused on practical understanding, not academic overload
🤖 AI-Generated Lessons
Dynamically generated typing and practice exercises
Adapts to user interaction and learning flow
💬 Collaborative Learning
Live chat system for shared learning and discussion
Enables real-time interaction between users
🧩 (In Progress) Morphology Tools
Interactive exploration of:
prefixes
roots
suffixes
Planned “slot-machine” style interface for constructing words
Case manipulation tools for understanding inflection patterns
🎯 Learning Philosophy

SurvivalRussian is built around a few core principles:

Output over input → typing and speaking > recognition
Recall over review → memory is built through effort
Context over memorization → meaning is learned in use
Mobility over static study → designed for use during real-life activity

The system is heavily inspired by audio-first learning approaches (e.g., Pimsleur), while extending them with interactive and AI-driven feedback loops.

🛠️ Tech Stack
Next.js (App Router)
JavaScript / React
Text-to-Speech APIs
Speech analysis via AI API integration
Real-time communication (chat)

(Expand this if you want to flex more specifics)

🚧 Status

Proof of concept with core systems implemented.
Currently expanding:

sentence database
morphology tools
lesson generation depth
🚀 Running Locally
npm install
npm run dev

WSL users:

npm run dev:wsl

Then open:
http://localhost:3000