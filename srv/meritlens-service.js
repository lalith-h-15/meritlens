
import cds from "@sap/cds";
import { careerConfig, fetchEvidencePackage, checkIdentity, buildContextEntries } from "./lib/careerContext.js";

const { SELECT, INSERT, UPDATE } = cds.ql;

export default cds.service.impl(async function () {
    const {
        Reviews,
        Evidence,
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

        const evidence = await tx.run(
            SELECT.from(Evidence).where({ review_ID: reviewID })
        );

        const contexts = await tx.run(
            SELECT.from(ContextEntries).where({ review_ID: reviewID })
        );

        const findings = [];

        // Rule 1: Documentation evidence gap
        const summary = (review.managerSummary || "").toLowerCase();

        if (summary.includes("documentation")) {
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
            // Imported career data is context for the reviewer, never an automatic finding.
            if (context.reportedBy === "career-orchestrator") continue;

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
                    details: `${newlyCreated} new findings created.`
                })
            );
        }

        return {
            reviewID,
            findingsGenerated: findings.length,
            newFindingsCreated: newlyCreated,
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

    // ==========================================
    // 5. CAREER CONTEXT IMPORT (Career Orchestrator -> ContextEntries)
    // ==========================================

    this.on("importCareerContext", async (req) => {
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

        if (review.status === "COMPLETED") {
            return req.error(409, "Completed reviews cannot be changed.");
        }

        const actorId = req.user?.id || "unknown";
        const audit = (action, details) =>
            tx.run(INSERT.into(AuditLogs).entries({ review_ID: reviewID, actorId, action, details }));

        // A failed import must never block the review: record it and carry on.
        const unavailable = async (reason) => {
            await audit("CAREER_CONTEXT_UNAVAILABLE", reason);
            return {
                reviewID,
                imported: 0,
                skipped: 0,
                status: "UNAVAILABLE",
                message: `Career context not imported: ${reason}. The review can continue without it.`
            };
        };

        const config = careerConfig();
        if (!config.configured) {
            return unavailable("integration is not configured");
        }

        const result = await fetchEvidencePackage(review.employee_ID, config);
        if (!result.ok) {
            return unavailable(result.reason);
        }

        const problem = checkIdentity(result.packet, review.employee_ID);
        if (problem) {
            return unavailable(problem);
        }

        let imported = 0;
        let skipped = 0;

        for (const entry of buildContextEntries(result.packet)) {
            const existing = await tx.run(
                SELECT.one.from(ContextEntries).where({
                    review_ID: reviewID,
                    contextType: entry.contextType,
                    description: entry.description
                })
            );

            if (existing) {
                skipped++;
                continue;
            }

            await tx.run(INSERT.into(ContextEntries).entries({ review_ID: reviewID, ...entry }));
            imported++;
        }

        await audit(
            "CAREER_CONTEXT_IMPORTED",
            `${imported} imported, ${skipped} already present. Packet generated ${result.packet.generatedAt}.`
        );

        return {
            reviewID,
            imported,
            skipped,
            status: "IMPORTED",
            message: `${imported} career context entries imported.`
        };
    });

});
