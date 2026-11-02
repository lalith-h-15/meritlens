
/**
 * MeritLens - CAP Evidence Adapter
 *
 * Converts CAP Evidence and EvidenceSkillMappings
 * into the input format expected by evidence-analyzer.js.
 *
 * Only verified, complete and explicitly classified records
 * are eligible for analysis.
 */

const CATEGORY_MAP = {
    PROJECT: "PROJECT",
    ASSESSMENT: "ASSESSMENT",
    TRAINING: "TRAINING",
    CERTIFICATE: "CERTIFICATE"
};

export function adaptEvidence(evidenceRows, mappingRows) {
    if (!Array.isArray(evidenceRows)) {
        throw new Error("Evidence records must be an array.");
    }

    if (!Array.isArray(mappingRows)) {
        throw new Error("Evidence skill mappings must be an array.");
    }

    const adaptedEvidence = [];
    const excludedEvidence = [];

    for (const record of evidenceRows) {
        const reject = reason => {
            excludedEvidence.push({
                evidenceId: record?.ID ?? null,
                reason
            });
        };

        if (!record?.ID) {
            reject("Missing evidence ID.");
            continue;
        }

        if (record.verified !== true) {
            reject("Evidence is not verified.");
            continue;
        }

        const evidenceCategory =
            CATEGORY_MAP[String(record.evidenceType ?? "").toUpperCase()];

        if (!evidenceCategory) {
            reject("Unsupported evidence category.");
            continue;
        }

        if (
            !record.sourceSystem ||
            !record.sourceRef ||
            !record.evidenceDate ||
            !record.retrievedAt ||
            !record.description?.trim()
        ) {
            reject("Required evidence metadata is incomplete.");
            continue;
        }

        const recordDate = new Date(record.evidenceDate);
        const retrievedAt = new Date(record.retrievedAt);

        if (
            Number.isNaN(recordDate.getTime()) ||
            Number.isNaN(retrievedAt.getTime()) ||
            recordDate > retrievedAt
        ) {
            reject("Evidence dates are invalid.");
            continue;
        }

        const mappings = mappingRows.filter(
            mapping => mapping.evidence_ID === record.ID
        );

        const validMappings = mappings.filter(
            mapping =>
                typeof mapping.skill === "string" &&
                mapping.skill.trim() &&
                ["POSITIVE", "NEGATIVE"].includes(mapping.result)
        );

        const skills = [
            ...new Set(validMappings.map(mapping => mapping.skill.trim()))
        ];

        if (skills.length === 0) {
            reject("No explicitly classified skill mappings found.");
            continue;
        }

        // One analyzer evidence record represents one outcome.
        // Separate records are created when outcomes differ.
        for (const result of ["POSITIVE", "NEGATIVE"]) {
            const resultSkills = validMappings
                .filter(mapping => mapping.result === result)
                .map(mapping => mapping.skill.trim());

            const uniqueSkills = [...new Set(resultSkills)];

            if (uniqueSkills.length === 0) continue;

            adaptedEvidence.push({
    evidenceId: `${record.ID}-${result}`,
    sourceEvidenceId: record.ID,
    skills: uniqueSkills,
                result,
                evidenceCategory,
                description: record.description.trim(),
                sourceType: record.sourceSystem,
                sourceReference: record.sourceRef,
                recordDate: record.evidenceDate,
                retrievedAt: record.retrievedAt
            });
        }
    }

    return {
        evidence: adaptedEvidence,
        excludedEvidence,
        totalRecords: evidenceRows.length,
        includedRecords: adaptedEvidence.length,
        excludedRecords: excludedEvidence.length
    };
}
