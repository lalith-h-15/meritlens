
/**
 * MeritLens - Claim Evidence Analyzer
 *
 * Compares manager-written performance claims
 * against verified, mapped evidence.
 *
 * This module identifies evidence alignment and
 * potential contradictions. It never makes final
 * employee performance decisions.
 */

function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
}

export function analyzeClaimsAgainstEvidence(claims, evidence) {
    if (!Array.isArray(claims)) {
        throw new Error("Claims must be an array.");
    }

    if (!Array.isArray(evidence)) {
        throw new Error("Evidence must be an array.");
    }

    const findings = claims.map(claim => {
        if (!claim.skill || !claim.statement) {
            throw new Error("Each claim needs a skill and statement.");
        }

        const matchingEvidence = evidence.filter(item =>
            Array.isArray(item.skills) &&
            item.skills.some(skill =>
                normalize(skill) === normalize(claim.skill)
            )
        );

        const positive = matchingEvidence.filter(
            item => item.result === "POSITIVE"
        );

        const negative = matchingEvidence.filter(
            item => item.result === "NEGATIVE"
        );

        let status;
        let explanation;

        if (!["POSITIVE", "NEGATIVE"].includes(claim.sentiment)) {
            status = "REQUIRES_REVIEW";
            explanation =
                "The claim's direction is unclear or mixed. Human review is required.";
        } else if (positive.length && negative.length) {
            status = "MIXED_EVIDENCE";
            explanation =
                "Both supporting and adverse evidence exist. Their context and relevance require human review.";
        } else if (claim.sentiment === "POSITIVE" && positive.length) {
            status = "SUPPORTED_BY_EVIDENCE";
            explanation =
                "Positive evidence aligns with the manager's positive claim. This does not independently establish proficiency or overall performance.";
        } else if (claim.sentiment === "POSITIVE" && negative.length) {
            status = "POTENTIAL_CONTRADICTION";
            explanation =
                "Adverse evidence may conflict with the manager's positive claim. Human review is required.";
        } else if (claim.sentiment === "NEGATIVE" && negative.length) {
            status = "SUPPORTED_BY_EVIDENCE";
            explanation =
                "Adverse evidence aligns with the manager's concern. Its context and relevance still require human review.";
        } else if (claim.sentiment === "NEGATIVE" && positive.length) {
            status = "POTENTIAL_CONTRADICTION";
            explanation =
                "Positive evidence may conflict with the manager's negative claim. Human review is required.";
        } else {
            status = "INSUFFICIENT_EVIDENCE";
            explanation =
                "No mapped evidence was found for this claim. This does not prove the claim is true or false.";
        }

        return {
            claimId: claim.claimId ?? null,
            skill: claim.skill,
            originalStatement: claim.statement,
            managerClaim: claim.sentiment,
            status,
            evidenceCount: matchingEvidence.length,

            supportingEvidence: positive.map(item => ({
                evidenceId: item.evidenceId,
                sourceEvidenceId: item.sourceEvidenceId ?? item.evidenceId,
                sourceType: item.sourceType,
                sourceReference: item.sourceReference,
                recordDate: item.recordDate
            })),

            adverseEvidence: negative.map(item => ({
                evidenceId: item.evidenceId,
                sourceEvidenceId: item.sourceEvidenceId ?? item.evidenceId,
                sourceType: item.sourceType,
                sourceReference: item.sourceReference,
                recordDate: item.recordDate
            })),

            explanation,
            requiresHumanReview: true
        };
    });

    return {
        analysisMode: "RULE_BASED",
        totalClaims: findings.length,
        supported: findings.filter(
            item => item.status === "SUPPORTED_BY_EVIDENCE"
        ).length,
        potentialContradictions: findings.filter(
            item => item.status === "POTENTIAL_CONTRADICTION"
        ).length,
        insufficientEvidence: findings.filter(
            item => item.status === "INSUFFICIENT_EVIDENCE"
        ).length,
        findings
    };
}
