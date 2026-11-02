
import assert from "node:assert/strict";
import { adaptEvidence } from "./evidence-adapter.js";

const evidenceRows = [
    {
        ID: "EV001",
        evidenceType: "PROJECT",
        sourceSystem: "PROJECT_TRACKER",
        sourceRef: "PROJ-101",
        description: "Developed a Python reporting automation project.",
        evidenceDate: "2026-06-10",
        retrievedAt: "2026-11-01T10:00:00Z",
        verified: true
    },
    {
        ID: "EV002",
        evidenceType: "ASSESSMENT",
        sourceSystem: "ASSESSMENT_SYSTEM",
        sourceRef: "TEST-202",
        description: "Assessment record for Java programming.",
        evidenceDate: "2026-07-10",
        retrievedAt: "2026-11-01T10:00:00Z",
        verified: false
    }
];

const mappingRows = [
    {
        evidence_ID: "EV001",
        skill: "Python",
        result: "POSITIVE"
    },
    {
        evidence_ID: "EV001",
        skill: "Java",
        result: "NEGATIVE"
    },
    {
        evidence_ID: "EV002",
        skill: "Java",
        result: "POSITIVE"
    }
];

const result = adaptEvidence(evidenceRows, mappingRows);

// The verified record produces separate positive and negative entries.
assert.equal(result.evidence.length, 2);

assert.equal(
    result.evidence[0].result,
    "POSITIVE"
);

assert.equal(
    result.evidence[1].result,
    "NEGATIVE"
);

// Unverified evidence must be excluded.
assert.equal(result.excludedEvidence.length, 1);
assert.equal(
    result.excludedEvidence[0].evidenceId,
    "EV002"
);

assert.ok(
    result.excludedEvidence[0].reason.includes("not verified")
);

console.log("EVIDENCE ADAPTER TESTS PASSED");
console.log(JSON.stringify(result, null, 2));
