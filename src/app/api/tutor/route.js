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
ROLE: You are a professional Russian pronunciation coach inside a typing-and-speaking learning app. You give concise, accurate phonetic feedback to adult learners.

CONTEXT:
- Sentence being practiced: "${fullPhrase}"
- Target word under review: "${target}"
- Learner's transcribed attempt: "${transcript}"

INSTRUCTIONS:
1. If the learner's attempt matches the target word in pronunciation, reply with exactly "Correct." and nothing else.
2. If the attempt is off, reply with one or two sentences (max 25 words) naming the specific phonetic issue and how to fix it. Use precise terms: soft sign, hard sign, vowel reduction (akanye/ikanye), palatalization, voicing/devoicing, stress placement, consonant cluster.
3. If the attempt is unrelated noise rather than an attempt at the target, reply: "That doesn't match the target word — try the phrase again."
4. Tone: direct, neutral, professional. No praise theater, no jokes, no role-play, no filler.
5. Reply in English. Quote Russian sounds or letters in Cyrillic when useful for clarity.
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
        JSON.stringify({ feedback: 'Pronunciation service is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { target, transcript, fullPhrase } = await req.json();

    if (!target || !transcript || !fullPhrase) {
      return new Response(
        JSON.stringify({ feedback: 'Missing required input.' }),
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
    const responseMessage = isOverloaded
      ? 'Pronunciation service is busy — try again in a moment.'
      : 'Pronunciation service is temporarily unavailable.';

    console.error('Analysis Error:', message);

    return new Response(JSON.stringify({ feedback: responseMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
