import { GoogleGenerativeAI } from "@google/generative-ai";

// REMOVE 'NEXT_PUBLIC_' for server-side security
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { target, transcript, fullPhrase } = await req.json();
    
    // SWITCH to stable if preview is failing
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" }); 
    
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
    const response = await result.response;
    const feedback = response.text();

    return new Response(JSON.stringify({ feedback }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Check for "Overloaded" or "Quota" specifically
    const isOverloaded = error.message.includes("503") || error.message.includes("overloaded");
    const message = isOverloaded ? "KGB LINES BUSY. TRY AGAIN." : "SIGNAL LOST";
    
    console.error("Analysis Error:", error.message);
    return new Response(JSON.stringify({ feedback: message }), { status: 500 });
  }
}