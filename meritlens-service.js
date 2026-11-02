
import cds from "@sap/cds";

const { SELECT, INSERT, UPDATE } = cds.ql;

function getActorId(req) {
    const actorId = req.user?.id;

    if (!actorId || actorId === "anonymous") {
        return req.reject(401, "Authenticated user identity is required.");
    }

    return actorId;
}

export default cds.service.impl(async function () {
    const {
        Reviews,
        Employees,
        Evidence,
        ContextEntries,
        Findings,
        AuditLogs
    } = this.entities;

    // ==========================================
    // 1. REVIEW ANALYSIS
    // ==========================================

    this.on("analyseReview", async (req) => {
        const actorId = getActorId(req);

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
            // HANA NCLOB fields cannot be compared in a SQL WHERE clause.
            // Filter by scalar columns in HANA, then compare rationale in JavaScript.
            const existingFindings = await tx.run(
                SELECT.from(Findings)
                    .columns("ID", "rationale")
                    .where({
                        review_ID: reviewID,
                        findingType: finding.findingType
                    })
            );

            const duplicate = existingFindings.some(
                (existing) => (existing.rationale || "") === (finding.rationale || "")
            );

            if (!duplicate) {
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
                    actorId: actorId,
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
        const actorId = getActorId(req);

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
                actorId: actorId,
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
        const actorId = getActorId(req);

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
                actorId: actorId,
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
        const actorId = getActorId(req);

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
                actorId: actorId,
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
    // 5. IMPORT CAREER CONTEXT (from Career Orchestrator)
    // ==========================================
    this.on("importCareerContext", async (req) => {
        const actorId = getActorId(req);
        const { reviewID } = req.data;
        if (!reviewID) return req.error(400, "Review ID is required.");

        const baseUrl = (process.env.ORCHESTRATOR_URL || "").replace(/\/$/, "");
        const apiKey = process.env.INTEGRATION_API_KEY || "";
        if (!baseUrl || !apiKey) {
            return req.error(503, "Career Orchestrator integration is not configured.");
        }

        const tx = cds.tx(req);
        const review = await tx.run(SELECT.one.from(Reviews).where({ ID: reviewID }));
        if (!review) return req.error(404, "Review not found.");

        const employee = await tx.run(
            SELECT.one.from(Employees).where({ ID: review.employee_ID })
        );

        if (!employee) return req.error(404, "Employee record not found.");

        let response;
        try {
            response = await fetch(
                `${baseUrl}/api/v1/integration/meritlens/by-meritlens-id/${encodeURIComponent(review.employee_ID)}/evidence-package`,
                {
                    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
                    signal: AbortSignal.timeout(10000)
                }
            );
        } catch (e) {
            return req.error(502, "Career Orchestrator is unreachable.");
        }
        if (response.status === 404) {
            return req.error(404, "No verified Career Orchestrator mapping for this employee.");
        }
        if (!response.ok) {
            return req.error(502, `Career Orchestrator returned ${response.status}.`);
        }

        let payload;
        try {
            payload = await response.json();
        } catch (e) {
            return req.error(502, "Career Orchestrator returned invalid JSON.");
        }
        const pkg = payload?.data;
        if (!pkg || typeof pkg !== "object") {
            return req.error(502, "Career Orchestrator returned an invalid evidence package.");
        }

        // Safety checks: verified mapping, and employee codes must agree
        if (pkg?.identity?.mappingStatus !== "verified") {
            return req.error(409, "Identity mapping is not verified.");
        }
        if (
            !employee.employeeCode ||
            !pkg.identity.canonicalEmployeeId ||
            employee.employeeCode !== pkg.identity.canonicalEmployeeId
        ) {
            return req.error(409, "Employee code is missing or does not match the verified mapping.");
        }

        const SOURCE = "CAREER_ORCHESTRATOR";
        const DEMO = "[Demo data] ";
        for (const key of ["projectReferences", "learningRecords", "skills"]) {
            if (pkg[key] !== undefined && !Array.isArray(pkg[key])) {
                return req.error(502, `Career Orchestrator returned an invalid ${key} collection.`);
            }
        }
        const items = [
            ...(pkg.projectReferences || []).map((p) => ({
                evidenceType: "PROJECT",
                sourceRef: p.evidenceReference || `PROJECT:${p.title}`,
                title: p.title,
                description: `${DEMO}Skills: ${(p.skills || []).join(", ")}`,
                evidenceDate: p.completedAt ? String(p.completedAt).slice(0, 10) : null
            })),
            ...(pkg.learningRecords || []).map((l) => ({
                evidenceType: "LEARNING",
                sourceRef: `LEARNING:${l.title}`,
                title: l.title,
                description: `${DEMO}Status: ${l.status || "n/a"}. Skills: ${(l.skills || []).join(", ")}`,
                evidenceDate: l.completedAt ? String(l.completedAt).slice(0, 10) : null
            })),
            ...(pkg.skills || []).map((s) => ({
                evidenceType: "SKILL",
                sourceRef: `SKILL:${s.name}`,
                title: `${s.name} (${s.level})`,
                description: `${DEMO}Evidence level: ${s.evidenceLevel}. Reference: ${s.evidenceReference ?? "none"}`,
                evidenceDate: null
            }))
        ];

        if (items.some((item) => !item.title || !item.sourceRef)) {
            return req.error(502, "Career Orchestrator returned evidence without a title or source reference.");
        }

        const existing = await tx.run(
            SELECT.from(Evidence).columns("sourceRef").where({ review_ID: reviewID, sourceSystem: SOURCE })
        );
        const known = new Set(existing.map((e) => e.sourceRef));

        let imported = 0;
        for (const item of items) {
            if (known.has(item.sourceRef)) continue;
            await tx.run(
                INSERT.into(Evidence).entries({
                    review_ID: reviewID,
                    sourceSystem: SOURCE,
                    verified: false,
                    ...item
                })
            );
            known.add(item.sourceRef);
            imported++;
        }

        await tx.run(
            INSERT.into(AuditLogs).entries({
                review_ID: reviewID,
                actorId: actorId,
                action: "CAREER_CONTEXT_IMPORTED",
                details: `${imported} evidence items imported from Career Orchestrator (demo data).`
            })
        );

        return {
            reviewID,
            imported,
            skipped: items.length - imported,
            source: SOURCE,
            isDemoData: true
        };
    });

});
