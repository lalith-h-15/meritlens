
import assert from "node:assert/strict";
import { extractClaims } from "./claim-extractor.js";

const reviewText = `
Alex demonstrated strong Python skills while developing the reporting automation project.
However, communication needs improvement.
Alex successfully contributed to the database migration.
`;

const knownSkills = [
    "Python",
    "Communication",
    "Database"
];

const result = extractClaims(reviewText, knownSkills);

// Basic output validation
assert.equal(result.extractionMode, "RULE_BASED");
assert.equal(result.totalStatements, 3);
assert.equal(result.totalClaims, 3);

// Check extracted skills
assert.deepEqual(
    result.claims.map(claim => claim.skill),
    ["Python", "Communication", "Database"]
);

// Check classifications
assert.equal(result.claims[0].sentiment, "POSITIVE");
assert.equal(result.claims[1].sentiment, "NEGATIVE");
assert.equal(result.claims[2].sentiment, "POSITIVE");

// Ensure proficiency is never invented
assert.ok(
    result.claims.every(claim => claim.claimedLevel === null)
);

// Ensure original statements are preserved
assert.ok(
    result.claims.every(claim => claim.statement.length > 0)
);

console.log("CLAIM EXTRACTOR TESTS PASSED");
console.log(JSON.stringify(result, null, 2));
