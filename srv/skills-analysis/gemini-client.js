import { GoogleGenAI } from "@google/genai";

let ai;

const MODEL_NAME = "gemini-3.6-flash";

function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY environment variable is not set."
        );
    }

    if (!ai) {
        ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
                timeout: 30000
            }
        });
    }

    return ai;
}

export async function generateWithGemini(prompt) {
    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new Error("A non-empty prompt is required.");
    }

    const client = getGeminiClient();

    const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });

    return response.text ?? "";
}
