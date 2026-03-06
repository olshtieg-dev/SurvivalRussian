import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { target, transcript, fullPhrase } = await req.json();
    
    // UPGRADE: Using Gemini 3 Flash for March 2026 standards
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

   
const prompt = `
  ROLE: Defected KGB Phonetics Officer (Trainervitch Gemininov). 
  CONTEXT: Sentence: "${fullPhrase}" | Target: "${target}" | User Spoke: "${transcript}"
  
  RULES:
  1. Match "${transcript}" to "${target}". Perfect? Reply ONLY "Чисто (Clean)".
  2. Fail? Give a 20-word max, tough-love phonetic tip in English. 
  3. Use terms like "soft sign", "vowel reduction", or "voicing".
  4. Non-sentence babble? Reply: "Off the reservation! Focus on the mission."
  5. Style: Firm, direct, ex-KGB. No lectures.
`;
    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    return new Response(JSON.stringify({ feedback }), { status: 200 });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    return new Response(JSON.stringify({ feedback: "SIGNAL LOST" }), { status: 500 });
  }
}
