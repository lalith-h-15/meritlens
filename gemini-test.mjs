const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.log("API key not found.");
    process.exit(1);
}

const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models",
    {
        headers: { "x-goog-api-key": key },
        signal: AbortSignal.timeout(15000)
    }
);

if (!response.ok) {
    console.log("API CHECK FAILED:", response.status);
    console.log(await response.text());
    process.exit(1);
}

const data = await response.json();

const model = data.models?.find(m =>
    m.name.includes("flash") &&
    m.supportedGenerationMethods?.includes("generateContent")
);

if (!model) {
    console.log("Key accepted, but no compatible Flash model found.");
    process.exit(1);
}

console.log("API KEY ACCEPTED:", model.name);

const result = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent`,
    {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: "Reply exactly: GEMINI API TEST SUCCESS"
                }]
            }]
        })
    }
);

const output = await result.json();

if (!result.ok) {
    console.log("GENERATION FAILED:", result.status);
    console.log(output.error?.message);
    process.exit(1);
}

console.log("GENERATION SUCCESSFUL!");
console.log(output.candidates?.[0]?.content?.parts?.[0]?.text);