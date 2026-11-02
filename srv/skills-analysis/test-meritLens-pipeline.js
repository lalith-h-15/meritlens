
import assert from "node:assert/strict";
import {
    runMeritLensAnalysis
} from "./meritLens-pipeline.js";

const result = runMeritLensAnalysis({
    reviewText:
        "Alex demonstrated strong Python skills. However, Java needs improvement.",

    evidenceRows: [
        {
            ID: "EV001",
            evidenceType: "PROJECT",
            sourceSystem: "PROJECT_TRACKER",
            sourceRef: "PROJ-101",
            description: "Developed a Python automation project.",
            evidenceDate: "2026-06-10",
            retrievedAt: "2026-11-01T10:00:00Z",
            verified: true
        },
        {
            ID: "EV002",
            evidenceType: "ASSESSMENT",
            sourceSystem: "ASSESSMENT_SYSTEM",
            sourceRef: "TEST-202",
            description: "Java assessment record.",
            evidenceDate: "2026-07-10",
            retrievedAt: "2026-11-01T10:00:00Z",
            verified: true
        }
    ],

    mappingRows: [
        {
            evidence_ID: "EV001",
            skill: "Python",
            result: "POSITIVE"
        },
        {
            evidence_ID: "EV002",
            skill: "Java",
            result: "POSITIVE"
        }
    ]
});

assert.equal(result.extraction.totalClaims, 2);
assert.equal(result.analysis.totalClaims, 2);
assert.equal(result.evidence.includedRecords, 2);

assert.equal(
    result.analysis.findings[0].status,
    "SUPPORTED_BY_EVIDENCE"
);

assert.equal(
    result.analysis.findings[1].status,
    "POTENTIAL_CONTRADICTION"
);

console.log("MERITLENS PIPELINE TESTS PASSED");
console.log(JSON.stringify(result, null, 2));
