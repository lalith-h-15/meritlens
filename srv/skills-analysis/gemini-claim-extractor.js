
import { generateWithGemini } from "./gemini-client.js";

function validateInput(reviewText, knownSkills) {
    if (typeof reviewText !== "string" || !reviewText.trim()) {
        throw new Error("Review text must be a non-empty string.");
    }

    if (!Array.isArray(knownSkills)) {
        throw new Error("knownSkills must be an array.");
    }
}

function buildPrompt(reviewText, knownSkills) {
    return `
You are the claim extraction component of MeritLens,
an evidence-backed performance review analysis system.

Your task is to identify skill-related claims in the manager's
review text.

KNOWN SKILLS:
${JSON.stringify(knownSkills)}

MANAGER REVIEW:
${JSON.stringify(reviewText)}

RULES:
1. Extract claims only when the review explicitly discusses a skill.
2. You may identify skills not present in the known skills list.
3. The skill must be explicitly mentioned in the original statement.
4. Preserve each statement exactly as written in the review.
5. Do not invent achievements, skills, proficiency levels,
   evidence, evidence IDs, or performance ratings.
6. Classify sentiment as exactly one of:
   POSITIVE, NEGATIVE, MIXED, NEUTRAL.
7. If sentiment is unclear, use NEUTRAL.
8. Do not treat a claim as a verified fact.
9. Return all relevant skill-specific claims.
10. Return valid JSON only. No Markdown or explanations.

REQUIRED JSON FORMAT:
{
  "claims": [
    {
      "statement": "Exact original statement from the review",
      "skill": "Explicitly mentioned skill",
      "sentiment": "POSITIVE"
    }
  ]
}

If there are no relevant claims, return:
{"claims":[]}
`;
}

export async function extractClaimsWithGemini(
    reviewText,
    knownSkills = []
) {
    validateInput(reviewText, knownSkills);

    const prompt = buildPrompt(reviewText, knownSkills);

    const responseText = await generateWithGemini(prompt);

    let parsed;

    try {
        parsed = JSON.parse(responseText);
    } catch {
        throw new Error("Gemini returned invalid JSON for claim extraction.");
    }

    if (!parsed || !Array.isArray(parsed.claims)) {
        throw new Error("Gemini response does not contain a valid claims array.");
    }

    const validSentiments = [
        "POSITIVE",
        "NEGATIVE",
        "MIXED",
        "NEUTRAL"
    ];

    const claims = [];
    const seen = new Set();

    for (const item of parsed.claims) {
        if (
            typeof item.statement !== "string" ||
            typeof item.skill !== "string" ||
            typeof item.sentiment !== "string"
        ) {
            continue;
        }

        const statement = item.statement.trim();
        const skill = item.skill.trim();
        const sentiment = item.sentiment.toUpperCase();

        // Verify that the statement actually occurs in the source review.
        if (!statement || !reviewText.includes(statement)) {
            continue;
        }

        // Verify that the skill is explicitly present in that statement.
        if (!skill || !statement.toLowerCase().includes(skill.toLowerCase())) {
            continue;
        }

        if (!validSentiments.includes(sentiment)) {
            continue;
        }

        const duplicateKey = `${statement.toLowerCase()}|${skill.toLowerCase()}`;

        if (seen.has(duplicateKey)) {
            continue;
        }

        seen.add(duplicateKey);

        claims.push({
            claimId: `CLAIM-${claims.length + 1}`,
            statement,
            skill,
            sentiment,
            claimedLevel: null,
            extractionMethod: "GEMINI",
            confidence: "UNSCORED",
            requiresReview: true
        });
    }

    return {
        extractionMode: "GEMINI",
        totalStatements: reviewText
            .split(/(?<=[.!?])\s+|\n+/)
            .filter(Boolean).length,
        totalClaims: claims.length,
        claims,
        limitations: [
            "Claims are extracted by an AI model and are not verified facts.",
            "Only claims whose statements and skill names match the original review are retained.",
            "No proficiency level or performance rating is inferred.",
            "All extracted claims require human review."
        ]
    };
}
