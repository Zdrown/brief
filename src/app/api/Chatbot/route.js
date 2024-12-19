import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { highlightedText, query } = await req.json();

    if (!highlightedText || !query) {
      return new Response(
        JSON.stringify({ error: "Missing highlightedText or query." }),
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contents = [
      {
        parts: [
          {
            text: `The user wants to know ${query} about ${highlightedText}. Please provide a helpful, concise answer.`
          },
        ],
      },
    ];

    const response = await model.generateContent({ contents });
    const llmResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No answer available.";

    return new Response(JSON.stringify({ response: llmResponse }), { status: 200 });
  } catch (error) {
    console.error("Error querying LLM (Gemini):", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch answer." }),
      { status: 500 }
    );
  }
}
