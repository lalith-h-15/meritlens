
import cds from "@sap/cds";
import { runMeritLensAnalysis } from "./skills-analysis/meritlens-pipeline.js";

const { SELECT, INSERT, UPDATE } = cds.ql;

export default cds.service.impl(async function () {
    const {
        Reviews,
        Evidence,
        EvidenceSkillMappings,
        ContextEntries,
        Findings,
        AuditLogs
    } = this.entities;

    // ==========================================
    // 1. REVIEW ANALYSIS
    // ==========================================

    this.on("analyseReview", async (req) => {
    const { reviewID } = req.data;

    if (!reviewID) {
        return req.error(400, "Review ID is required.");
    }

    const tx = cds.tx(req);

    const review = await tx.run(
        SELECT.one.from(Reviews).where({ ID: reviewID })
    );

    if (!review) {
        return req.error(404, "Review not found.");
    }

    // 1. Retrieve evidence and context for this review
    const evidence = await tx.run(
        SELECT.from(Evidence).where({ review_ID: reviewID })
    );

    const contexts = await tx.run(
        SELECT.from(ContextEntries).where({ review_ID: reviewID })
    );

    // 2. Retrieve skill mappings for the review's evidence
    const evidenceIDs = evidence.map(item => item.ID);

    const mappings = evidenceIDs.length
        ? await tx.run(
            SELECT.from(EvidenceSkillMappings).where({
                evidence_ID: { in: evidenceIDs }
            })
        )
        : [];

    const findings = [];
    let totalClaims = 0;
    let analysisMode = "RULE_BASED";

    // 3. Analyze manager claims against evidence
    const summary = review.managerSummary || "";

    if (summary.trim()) {
       const pipelineResult = await runMeritLensAnalysis({
            reviewText: summary,
            evidenceRows: evidence,
            mappingRows: mappings
        });

        analysisMode = pipelineResult.analysisMode;
        totalClaims = pipelineResult.analysis.totalClaims;

        for (const result of pipelineResult.analysis.findings) {
            let findingType = result.status;

            const severity = [
                "POTENTIAL_CONTRADICTION",
                "MIXED_EVIDENCE"
            ].includes(result.status)
                ? "WARNING"
                : "INFO";

            const rationale = JSON.stringify({
                skill: result.skill,
                managerClaim: result.managerClaim,
                explanation: result.explanation,
                evidenceCount: result.evidenceCount,
                supportingEvidence: result.supportingEvidence,
                adverseEvidence: result.adverseEvidence,
                requiresHumanReview: true
            });

            findings.push({
                findingType,
                severity,
                description: result.originalStatement,
                rationale,
                status: "OPEN"
            });
        }
    }

    // Rule 1: Documentation evidence gap
    if (summary.toLowerCase().includes("documentation")) {
        const hasDocumentationEvidence = evidence.some((item) =>
            `${item.title || ""} ${item.description || ""}`
                .toLowerCase()
                .includes("documentation")
        );

        if (!hasDocumentationEvidence) {
            findings.push({
                findingType: "EVIDENCE_GAP",
                severity: "INFO",
                description:
                    "The manager mentioned documentation concerns, but no documentation-specific evidence was supplied.",
                rationale:
                    "The claim needs supporting evidence before a conclusion can be drawn.",
                status: "OPEN"
            });
        }
    }

    // Rule 2: Potentially overlooked contributions
    for (const context of contexts) {
        const description = (context.description || "").toLowerCase();

        if (
            description.includes("helped") ||
            description.includes("contribution") ||
            description.includes("resolved")
        ) {
            findings.push({
                findingType: "OVERLOOKED_CONTRIBUTION",
                severity: "INFO",
                description:
                    "Additional contribution may not be reflected in the manager's summary.",
                rationale: context.description,
                status: "OPEN"
            });
        }
    }

    // Rule 3: Save findings without duplicates
    let newlyCreated = 0;

    for (const finding of findings) {
        const existing = await tx.run(
            SELECT.one.from(Findings).where({
                review_ID: reviewID,
                findingType: finding.findingType,
                rationale: finding.rationale
            })
        );

        if (!existing) {
            await tx.run(
                INSERT.into(Findings).entries({
                    review_ID: reviewID,
                    ...finding
                })
            );

            newlyCreated++;
        }
    }

    // Rule 4: Record analysis in audit log
    if (newlyCreated > 0) {
        await tx.run(
            INSERT.into(AuditLogs).entries({
                review_ID: reviewID,
                actorId: req.user?.id || "DEMO_REVIEWER",
                action: "REVIEW_ANALYZED",
                details:
                    `${newlyCreated} new findings created. ` +
                    `${totalClaims} manager claims analyzed using ${analysisMode} analysis.`
            })
        );
    }

    return {
        reviewID,
        findingsGenerated: findings.length,
        newFindingsCreated: newlyCreated,
        analysisMode,
        totalClaims,
        findings
    };
});
    // ==========================================
    // 2. FINDING RESOLUTION
    // ==========================================

    this.on("resolveFinding", async (req) => {
        const { findingID, decision, notes } = req.data;

        const allowedDecisions = [
            "ACCEPTED",
            "DISMISSED",
            "NEEDS_EVIDENCE"
        ];

        if (!findingID || !allowedDecisions.includes(decision)) {
            return req.error(400, "Invalid finding ID or decision.");
        }

        const tx = cds.tx(req);

        const finding = await tx.run(
            SELECT.one.from(Findings).where({ ID: findingID })
        );

        if (!finding) {
            return req.error(404, "Finding not found.");
        }

        if (finding.status !== "OPEN") {
            return req.error(409, "This finding has already been resolved.");
        }

        await tx.run(
            UPDATE(Findings)
                .set({
                    status: decision,
                    rationale: notes
                        ? `${finding.rationale}\nReviewer notes: ${notes}`
                        : finding.rationale
                })
                .where({ ID: findingID })
        );

        // Record reviewer decision
        await tx.run(
            INSERT.into(AuditLogs).entries({
                review_ID: finding.review_ID,
                actorId: req.user?.id || "DEMO_REVIEWER",
                action: `FINDING_${decision}`,
                details: notes || `Finding status changed to ${decision}.`
            })
        );

        return tx.run(
            SELECT.one.from(Findings).where({ ID: findingID })
        );
    });

    // ==========================================
    // 3. SUBMIT REVIEW
    // ==========================================

    this.on("submitReview", async (req) => {
        const { reviewID } = req.data;

        if (!reviewID) {
            return req.error(400, "Review ID is required.");
        }

        const tx = cds.tx(req);

        const review = await tx.run(
            SELECT.one.from(Reviews).where({ ID: reviewID })
        );

        if (!review) {
            return req.error(404, "Review not found.");
        }

        if (review.status !== "DRAFT") {
            return req.error(
                409,
                "Only DRAFT reviews can be submitted."
            );
        }

        await tx.run(
            UPDATE(Reviews)
                .set({ status: "UNDER_REVIEW" })
                .where({ ID: reviewID })
        );

        await tx.run(
            INSERT.into(AuditLogs).entries({
                review_ID: reviewID,
                actorId: req.user?.id || "DEMO_REVIEWER",
                action: "REVIEW_SUBMITTED",
                details: "Review moved from DRAFT to UNDER_REVIEW."
            })
        );

        return {
            ID: reviewID,
            status: "UNDER_REVIEW"
        };
    });

    // ==========================================
    // 4. COMPLETE REVIEW
    // ==========================================

    this.on("completeReview", async (req) => {
        const { reviewID } = req.data;

        if (!reviewID) {
            return req.error(400, "Review ID is required.");
        }

        const tx = cds.tx(req);

        const review = await tx.run(
            SELECT.one.from(Reviews).where({ ID: reviewID })
        );

        if (!review) {
            return req.error(404, "Review not found.");
        }

        if (review.status !== "UNDER_REVIEW") {
            return req.error(
                409,
                "Only UNDER_REVIEW reviews can be completed."
            );
        }

        // Check for unresolved findings
        const unresolvedFindings = await tx.run(
            SELECT.from(Findings).where({
                review_ID: reviewID,
                status: { in: ["OPEN", "NEEDS_EVIDENCE"] }
            })
        );

        if (unresolvedFindings.length > 0) {
            return req.error(
                409,
                "Cannot complete review while unresolved findings remain."
            );
        }

        await tx.run(
            UPDATE(Reviews)
                .set({ status: "COMPLETED" })
                .where({ ID: reviewID })
        );

        await tx.run(
            INSERT.into(AuditLogs).entries({
                review_ID: reviewID,
                actorId: req.user?.id || "DEMO_REVIEWER",
                action: "REVIEW_COMPLETED",
                details: "Review successfully completed."
            })
        );

        return {
            ID: reviewID,
            status: "COMPLETED"
        };
    });


});