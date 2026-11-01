// Career Orchestrator -> MeritLens integration helpers.
// Rules: career data is CONTEXT for a human reviewer, never a rating; only verified identity
// mappings are trusted; failures never block a review.

const TIMEOUT_MS = 5000;

export function careerConfig(env = process.env) {
    const baseUrl = (env.CAREER_ORCHESTRATOR_URL || "").replace(/\/+$/, "");
    const key = env.CAREER_ORCHESTRATOR_KEY || "";
    return { baseUrl, key, configured: Boolean(baseUrl && key) };
}

// One timeout, one retry on network errors and 5xx. Never retries 401/403/404.
export async function fetchEvidencePackage(meritLensEmployeeId, { baseUrl, key }, fetchImpl = fetch) {
    const url = `${baseUrl}/api/v1/integration/meritlens/by-meritlens-id/${encodeURIComponent(meritLensEmployeeId)}/evidence-package`;
    let lastError = "unknown";

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const res = await fetchImpl(url, {
                headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
                signal: AbortSignal.timeout(TIMEOUT_MS)
            });
            if (res.status === 404) return { ok: false, reason: "employee not mapped in Career Orchestrator" };
            if (res.status === 401 || res.status === 403) return { ok: false, reason: "service key not accepted" };
            if (!res.ok) { lastError = `HTTP ${res.status}`; continue; }
            const body = await res.json();
            if (!body?.data) return { ok: false, reason: "unexpected response shape" };
            return { ok: true, packet: body.data };
        } catch (error) {
            lastError = error?.name || "network error";
        }
    }
    return { ok: false, reason: `Career Orchestrator unreachable (${lastError})` };
}

// Trust the packet only if the mapping is verified AND points at this exact employee.
export function checkIdentity(packet, meritLensEmployeeId) {
    const identity = packet?.identity;
    if (!identity || identity.mappingStatus !== "verified") return "identity mapping is not verified";
    if (identity.meritLensEmployeeId !== meritLensEmployeeId) return "identity mapping does not match this employee";
    return null;
}

const day = (value) => (value ? String(value).slice(0, 10) : undefined);
const list = (items) => (items && items.length ? items.join(", ") : "none");

// Neutral wording on purpose: no personal data (no name, email) and no score or rating.
export function buildContextEntries(packet) {
    const reportedBy = "career-orchestrator";
    const generated = day(packet.generatedAt);
    const entries = [];

    if (packet.careerGoal) {
        entries.push({ contextType: "CAREER_GOAL", description: `Career goal: ${packet.careerGoal}`, reportedBy, contextDate: generated });
    }
    for (const skill of packet.skills || []) {
        const ref = skill.evidenceReference ? `; reference: ${skill.evidenceReference}` : "";
        entries.push({
            contextType: "CAREER_SKILL",
            description: `Skill: ${skill.name}; level: ${skill.level}; evidence: ${skill.evidenceLevel}${ref}`,
            reportedBy, contextDate: generated
        });
    }
    for (const project of packet.projectReferences || []) {
        entries.push({
            contextType: "CAREER_PROJECT",
            description: `Verified project reference ${project.evidenceReference ?? "(no id)"}: ${project.title}; skills: ${list(project.skills)}`,
            reportedBy, contextDate: day(project.completedAt) || generated
        });
    }
    for (const record of packet.learningRecords || []) {
        entries.push({
            contextType: "CAREER_LEARNING",
            description: `Learning record: ${record.title}; skills: ${list(record.skills)}; status: ${record.status ?? "unknown"}`,
            reportedBy, contextDate: day(record.completedAt) || generated
        });
    }
    return entries;
}
