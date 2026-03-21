import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DEFAULT_TUTOR_MODELS = [
  process.env.GEMINI_TUTOR_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
].filter(Boolean);

function buildPrompt({ target, transcript, fullPhrase }) {
  return `
ROLE: Defected KGB Phonetics Officer (Trainervitch Gemininov).
CONTEXT: Sentence: "${fullPhrase}" | Target: "${target}" | User Spoke: "${transcript}"

RULES:
1. Match "${transcript}" to "${target}". Perfect? Reply ONLY "Chisto (Clean)".
2. Fail? Give a 20-word max, tough-love phonetic tip in English.
3. Use terms like "soft sign", "vowel reduction", or "voicing".
4. Non-sentence babble? Reply: "Off the reservation! Focus on the mission."
5. Style: Firm, direct, ex-KGB. No lectures.
`;
}

async function generateTutorFeedback(prompt) {
  let lastError = null;

  for (const modelName of DEFAULT_TUTOR_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { feedback: response.text(), modelName };
    } catch (error) {
      lastError = error;

      const message = error?.message || '';
      const isMissingModel =
        message.includes('404') ||
        message.includes('not found') ||
        message.includes('not supported for generateContent');

      if (!isMissingModel) {
        throw error;
      }
    }
  }

  throw lastError || new Error('No tutor models available');
}

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ feedback: 'TUTOR OFFLINE: MISSING API KEY.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { target, transcript, fullPhrase } = await req.json();

    if (!target || !transcript || !fullPhrase) {
      return new Response(
        JSON.stringify({ feedback: 'INCOMPLETE PHONETIC PAYLOAD.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildPrompt({ target, transcript, fullPhrase });
    const { feedback, modelName } = await generateTutorFeedback(prompt);

    console.info('Tutor model selected:', modelName);

    return new Response(JSON.stringify({ feedback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error?.message || '';
    const isOverloaded =
      message.includes('503') ||
      message.toLowerCase().includes('overloaded') ||
      message.toLowerCase().includes('quota');
    const responseMessage = isOverloaded ? 'KGB LINES BUSY. TRY AGAIN.' : 'SIGNAL LOST';

    console.error('Analysis Error:', message);

    return new Response(JSON.stringify({ feedback: responseMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
