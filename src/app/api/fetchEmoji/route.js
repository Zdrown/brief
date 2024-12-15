import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!title) {
      return Response.json({ error: "Title is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contents = [
      {
        parts: [
          {
            text: `Provide the most relevant single emoji for this category: "${title}". Only return the emoji, no text.`,
          },
        ],
      },
    ];

    const response = await model.generateContent({ contents });
    const emoji =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "📝";

    console.log("Generated Emoji:", emoji); // Logs for debugging
    return Response.json({ emoji }, { status: 200 });
  } catch (error) {
    console.error("Error fetching emoji:", error);
    return Response.json(
      { error: "Failed to fetch emoji." },
      { status: 500 }
    );
  }
}
