
/**
 * MeritLens - Skills Evidence Analyzer
 * Deterministic evidence analysis engine.
 */

const VALID_LEVELS = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}
function getEvidenceRecency(recordDate, reviewDate) {
  const record = new Date(recordDate);
  const cutoff = new Date(reviewDate);

  cutoff.setMonth(cutoff.getMonth() - 12);

  return record >= cutoff ? "RECENT" : "OLDER";
}
function validateEmployee(employee) {
  if (!employee || typeof employee !== "object" || Array.isArray(employee)) {
    throw new Error("Employee input must be an object.");
  }

  if (!Array.isArray(employee.claimedSkills)) {
    throw new Error("claimedSkills must be an array.");
  }

  if (!Array.isArray(employee.evidence)) {
    throw new Error("evidence must be an array.");
  }

  for (const claim of employee.claimedSkills) {
    if (
      !claim.skill ||
      !Object.hasOwn(VALID_LEVELS, claim.level)
    ) {
      throw new Error("Each claim needs a valid skill and proficiency level.");
    }
  }


const evidenceIds = new Set();

for (const item of employee.evidence) {
  if (
    !item ||
    !Array.isArray(item.skills) ||
    item.skills.length === 0 ||
    typeof item.description !== "string" ||
    !item.description.trim()
  ) {
    throw new Error(
      "Each evidence item needs skills and a non-empty description."
    );
  }

  if (!["POSITIVE", "NEGATIVE"].includes(item.result ?? "POSITIVE")) {
    throw new Error("Evidence result must be POSITIVE or NEGATIVE.");
  }

const validCategories = [
  "PROJECT",
  "ASSESSMENT",
  "TRAINING",
  "CERTIFICATE"
];

if (!validCategories.includes(item.evidenceCategory)) {
  throw new Error(
    `Evidence ${item.evidenceId} has an invalid evidenceCategory.`
  );
}

  if (!item.evidenceId || !item.evidenceId.trim()) {
    throw new Error("Each evidence item needs an evidenceId.");
  }

  if (evidenceIds.has(item.evidenceId)) {
    throw new Error(`Duplicate evidenceId found: ${item.evidenceId}`);
  }

  evidenceIds.add(item.evidenceId);

  if (
    !item.sourceType ||
    !item.sourceReference ||
    !item.sourceReference.trim()
  ) {
    throw new Error(
      `Evidence ${item.evidenceId} needs sourceType and sourceReference.`
    );
  }

  if (
    !item.recordDate ||
    Number.isNaN(Date.parse(item.recordDate)) ||
    !item.retrievedAt ||
    Number.isNaN(Date.parse(item.retrievedAt))
  ) {
    throw new Error(
      `Evidence ${item.evidenceId} needs valid recordDate and retrievedAt values.`
    );
  }

  if (new Date(item.recordDate) > new Date(item.retrievedAt)) {
    throw new Error(
      `Evidence ${item.evidenceId} has a recordDate after its retrieval date.`
    );
  }
}

}


function analyzeClaim(claim, evidence, reviewDate) {
  const matchingEvidence = evidence.filter(item =>
    item.skills.some(skill =>
      normalize(skill) === normalize(claim.skill)
    )
  );

  const positiveEvidence = matchingEvidence.filter(
    item => (item.result ?? "POSITIVE") === "POSITIVE"
  );

  const negativeEvidence = matchingEvidence.filter(
    item => item.result === "NEGATIVE"
  );

  const practicalEvidence = positiveEvidence.filter(
    item =>
      ["PROJECT", "ASSESSMENT"].includes(item.evidenceCategory) &&
      item.description.trim().length >= 20
  );

  const otherEvidence = positiveEvidence.filter(
    item => !practicalEvidence.includes(item)
  );

  let status;
  let explanation;

  if (positiveEvidence.length > 0 && negativeEvidence.length > 0) {
    status = "CONTRADICTORY";
    explanation =
      `Both positive and negative evidence exist for ${claim.skill}. Human review is required to understand the difference in context.`;
  } else if (negativeEvidence.length > 0) {
    status = "ADVERSE_EVIDENCE";
    explanation =
      `Negative evidence relating to ${claim.skill} was found. This does not independently establish the employee's overall proficiency. Human review is recommended.`;
  } else if (practicalEvidence.length > 0) {
    status = "SUPPORTED";
    explanation =
      `Relevant evidence describes practical use of ${claim.skill}. This supports skill usage but does not independently establish ${claim.level} proficiency.`;
  } else {
    status = "INSUFFICIENT_EVIDENCE";
    explanation = positiveEvidence.length === 0
      ? `No evidence directly supports the ${claim.skill} claim.`
      : `Evidence references ${claim.skill}, but lacks enough practical detail.`;
  }

 const formatEvidence = item => ({
  evidenceId: item.evidenceId,
   sourceEvidenceId: item.sourceEvidenceId ?? item.evidenceId,
  evidenceCategory: item.evidenceCategory,
  sourceType: item.sourceType,
  sourceReference: item.sourceReference,
  recordDate: item.recordDate,
  retrievedAt: item.retrievedAt,
  recency: getEvidenceRecency(item.recordDate, reviewDate)
});

  return {
    skill: claim.skill,
    claimedLevel: claim.level,
    status,
    evidenceCount: matchingEvidence.length,
    supportingEvidence: practicalEvidence.map(formatEvidence),
    adverseEvidence: negativeEvidence.map(formatEvidence),
    otherEvidence: otherEvidence.map(formatEvidence),
    explanation
  };
}


function analyzeFairness(employee) {
  const flags = [];

  if (employee.careerGap && employee.careerGap.present === true) {
    flags.push({
      type: "CAREER_GAP_BIAS",
      severity: "WARNING",
      explanation:
        "A career gap must not be treated as evidence of reduced ability or lower skill proficiency. Evaluate the employee using relevant skills and evidence."
    });
  }

  return flags;
}

function generateSkillGaps(claimedSkills, requiredSkills = [], findings = []) {
  return requiredSkills.flatMap(required => {
    const claim = claimedSkills.find(
      item => normalize(item.skill) === normalize(required.skill)
    );

    const finding = findings.find(
      item => normalize(item.skill) === normalize(required.skill)
    );

    if (!claim) {
      return [{
        skill: required.skill,
        claimedLevel: null,
        requiredLevel: required.level,
        evidenceStatus: "NO_CLAIM",
        proficiencyVerified: false,
        suggestedAction: "Collect a skill claim and supporting evidence."
      }];
    }

    return [{
      skill: required.skill,
      claimedLevel: claim.level,
      requiredLevel: required.level,
      evidenceStatus: finding?.status ?? "INSUFFICIENT_EVIDENCE",
      proficiencyVerified: false,
      suggestedAction:
        "Use a level-specific assessment or review evidence against the required proficiency criteria."
    }];
  });
}


/**
 * Main public analysis function.
 */
export function analyzeEvidence(employee) {
  validateEmployee(employee);

  const reviewDate = employee.reviewDate ?? new Date().toISOString();

  const findings = employee.claimedSkills.map(claim =>
    analyzeClaim(claim, employee.evidence, reviewDate)
  );

  const requiredSkills = employee.requiredSkills ?? [];

  if (!Array.isArray(requiredSkills)) {
    throw new Error("requiredSkills must be an array.");
  }

  const skillGaps = generateSkillGaps(
  employee.claimedSkills,
  requiredSkills,
  findings
);

  const fairnessFlags = analyzeFairness(employee);

  return {
    employeeId: employee.employeeId ?? null,
    findings,
    summary: {
      totalClaims: findings.length,
      supported: findings.filter(f => f.status === "SUPPORTED").length,
      insufficientEvidence: findings.filter(
        f => f.status === "INSUFFICIENT_EVIDENCE"
      ).length,
      contradictory: findings.filter(
        f => f.status === "CONTRADICTORY"
      ).length,
      skillsRequiringValidation: skillGaps.length
    },
    skillGaps,
    fairnessFlags,
    analysisMode: "RULE_BASED"
  };
}
