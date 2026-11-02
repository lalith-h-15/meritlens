
import assert from "node:assert/strict";
import {
    analyzeClaimsAgainstEvidence
} from "./claim-evidence-analyzer.js";

const claims = [
    {
        claimId: "C1",
        skill: "Python",
        statement: "Alex demonstrated strong Python skills.",
        sentiment: "POSITIVE"
    },
    {
        claimId: "C2",
        skill: "Communication",
        statement: "Communication needs improvement.",
        sentiment: "NEGATIVE"
    },
    {
        claimId: "C3",
        skill: "Java",
        statement: "Alex demonstrated Java skills.",
        sentiment: "POSITIVE"
    },
    {
        claimId: "C4",
        skill: "Database",
        statement: "Database performance was mixed.",
        sentiment: "MIXED"
    }
];

const evidence = [
    {
        evidenceId: "EV001-POSITIVE",
        sourceEvidenceId: "EV001",
        skills: ["Python"],
        result: "POSITIVE",
        sourceType: "PROJECT_TRACKER",
        sourceReference: "PROJ-101",
        recordDate: "2026-06-10"
    },
    {
        evidenceId: "EV002-POSITIVE",
        sourceEvidenceId: "EV002",
        skills: ["Communication"],
        result: "POSITIVE",
        sourceType: "ASSESSMENT",
        sourceReference: "TEST-202",
        recordDate: "2026-07-10"
    },
    {
        evidenceId: "EV003-NEGATIVE",
        sourceEvidenceId: "EV003",
        skills: ["Java"],
        result: "NEGATIVE",
        sourceType: "ASSESSMENT",
        sourceReference: "TEST-303",
        recordDate: "2026-08-10"
    },
    {
        evidenceId: "EV004-POSITIVE",
        sourceEvidenceId: "EV004",
        skills: ["Database"],
        result: "POSITIVE",
        sourceType: "PROJECT_TRACKER",
        sourceReference: "PROJ-404",
        recordDate: "2026-09-10"
    },
    {
        evidenceId: "EV005-NEGATIVE",
        sourceEvidenceId: "EV005",
        skills: ["Database"],
        result: "NEGATIVE",
        sourceType: "ASSESSMENT",
        sourceReference: "TEST-505",
        recordDate: "2026-09-15"
    }
];

const result = analyzeClaimsAgainstEvidence(claims, evidence);

assert.equal(result.totalClaims, 4);

assert.equal(result.findings[0].status, "SUPPORTED_BY_EVIDENCE");
assert.equal(result.findings[1].status, "POTENTIAL_CONTRADICTION");
assert.equal(result.findings[2].status, "POTENTIAL_CONTRADICTION");
assert.equal(result.findings[3].status, "REQUIRES_REVIEW");

assert.equal(result.findings[1].supportingEvidence.length, 1);
assert.equal(result.findings[3].evidenceCount, 2);

assert.ok(
    result.findings.every(item => item.requiresHumanReview)
);

console.log("CLAIM-EVIDENCE ANALYZER TESTS PASSED");
console.log(JSON.stringify(result, null, 2));
