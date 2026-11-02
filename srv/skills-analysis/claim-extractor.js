
/**
 * MeritLens - Claim Extraction
 *
 * Provider-independent claim extraction.
 * Initial implementation: conservative rule-based fallback.
 *
 * IMPORTANT:
 * - Extracted statements are claims, not verified facts.
 * - Proficiency levels are never invented.
 * - Original text is preserved for traceability.
 */

const POSITIVE_PATTERNS = [
    /\b(strong|excellent|effective|successfully|improved|delivered|demonstrated|achieved|completed|developed|contributed|led|supported)\b/i,
    /\b(proficient|skilled|capable|efficient)\b/i
];

const NEGATIVE_PATTERNS = [
    /\b(weak|poor|failed|missed|incomplete|delayed|struggled|unable|lacks|lacking|below expectations|needs improvement|needs improvement in)\b/i,
    /\b(not demonstrated|did not|could not|underperformed)\b/i
];

function classifyStatement(statement) {
    const positive = POSITIVE_PATTERNS.some(pattern =>
        pattern.test(statement)
    );

    const negative = NEGATIVE_PATTERNS.some(pattern =>
        pattern.test(statement)
    );

    if (positive && negative) return "MIXED";
    if (negative) return "NEGATIVE";
    if (positive) return "POSITIVE";

    return "NEUTRAL";
}

function normalizeSkill(skill) {
    return String(skill ?? "").trim().toLowerCase();
}

function validateInput(reviewText, knownSkills) {
    if (typeof reviewText !== "string" || !reviewText.trim()) {
        throw new Error("Review text must be a non-empty string.");
    }

    if (!Array.isArray(knownSkills)) {
        throw new Error("knownSkills must be an array.");
    }

    for (const skill of knownSkills) {
        if (typeof skill !== "string" || !skill.trim()) {
            throw new Error("Every known skill must be a non-empty string.");
        }
    }
}

function splitStatements(reviewText) {
    return reviewText
        .replace(/\r\n/g, "\n")
        .split(/(?<=[.!?])\s+|\n+/)
        .map(statement => statement.trim())
        .filter(Boolean);
}

/**
 * Extract candidate claims from manager-written review text.
 *
 * knownSkills should come from the application's authorized
 * skill catalogue or existing evidence mappings.
 */
export function extractClaims(reviewText, knownSkills = []) {
    validateInput(reviewText, knownSkills);

    const statements = splitStatements(reviewText);

    const normalizedSkills = [
        ...new Map(
            knownSkills.map(skill => [
                normalizeSkill(skill),
                skill.trim()
            ])
        ).values()
    ];

    const claims = [];

    statements.forEach((statement, index) => {
        const matchedSkills = normalizedSkills.filter(skill => {
            const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const pattern = new RegExp(
                `(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`,
                "i"
            );

            return pattern.test(statement);
        });

        // Only emit a skill-specific claim when a known skill is found.
        for (const skill of matchedSkills) {
            claims.push({
                claimId: `CLAIM-${index + 1}-${claims.length + 1}`,
                statement,
                skill,
                sentiment: classifyStatement(statement),
                claimedLevel: null,
                extractionMethod: "RULE_BASED",
                confidence: "LOW",
                requiresReview: true
            });
        }
    });

    return {
        extractionMode: "RULE_BASED",
        totalStatements: statements.length,
        totalClaims: claims.length,
        claims,
        limitations: [
            "Only skills in the supplied skill catalogue are matched.",
            "Sentiment classification is keyword-based and may be incorrect.",
            "No proficiency level or performance rating is inferred.",
            "All extracted claims require human review."
        ]
    };
}
