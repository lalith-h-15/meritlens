
import { extractClaims } from "./claim-extractor.js";
import { extractClaimsWithGemini } from "./gemini-claim-extractor.js";
import { adaptEvidence } from "./evidence-adapter.js";
import {
    analyzeClaimsAgainstEvidence
} from "./claim-evidence-analyzer.js";

/**
 * Coordinates MeritLens claim extraction and evidence analysis.
 *
 * Primary extraction: Gemini
 * Fallback extraction: Rule-based
 *
 * Evidence validation and claim analysis remain deterministic.
 * This pipeline does not make performance or employment decisions.
 */
export async function runMeritLensAnalysis({
    reviewText,
    evidenceRows,
    mappingRows
}) {
    if (typeof reviewText !== "string" || !reviewText.trim()) {
        throw new Error("A non-empty manager review is required.");
    }

    const mappings = Array.isArray(mappingRows) ? mappingRows : [];

    // Build the currently available skill vocabulary.
    const knownSkills = [
        ...new Set(
            mappings
                .map(item => item.skill?.trim())
                .filter(Boolean)
        )
    ];

    let extraction;
    let analysisMode;

    // Attempt AI-assisted claim extraction first.
    try {
        extraction = await extractClaimsWithGemini(
            reviewText,
            knownSkills
        );

        analysisMode = "GEMINI";
    } catch (error) {
        // Preserve the existing rule-based extractor as fallback.
        console.warn(
            "Gemini extraction failed. Using rule-based fallback:",
            error.message
        );

        extraction = extractClaims(reviewText, knownSkills);
        analysisMode = "RULE_BASED";
    }

    // Evidence validation remains independent of Gemini.
    const evidenceResult = adaptEvidence(
        evidenceRows,
        mappings
    );

    // Existing deterministic evidence analysis is preserved.
    const analysis = analyzeClaimsAgainstEvidence(
        extraction.claims,
        evidenceResult.evidence
    );

    return {
        analysisMode,
        extraction,
        evidence: {
            totalRecords: evidenceResult.totalRecords,
            includedRecords: evidenceResult.includedRecords,
            excludedRecords: evidenceResult.excludedRecords,
            excludedDetails: evidenceResult.excludedEvidence
        },
        analysis
    };
}
