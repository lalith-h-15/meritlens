
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
        timeout: 30000
    }
});

const MODEL_NAME = "gemini-3.6-flash";

/**
 * Sends a prompt to Gemini with a 30-second request timeout.
 */
export async function generateWithGemini(prompt) {
    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new Error("A non-empty prompt is required.");
    }

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });

    return response.text ?? "";
}
