import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import cds from "@sap/cds";
import { fileURLToPath } from "node:url";
import impl from "../srv/meritlens-service.js";
import { buildContextEntries, checkIdentity } from "../srv/lib/careerContext.js";

const ANIKA = "55555555-5555-4555-8555-555555555555";
const REVIEW = "66666666-6666-4666-8666-666666666666";
const KEY = "k".repeat(40);

const packet = (overrides = {}) => ({
    employeeId: "demo-anika-001",
    identity: { careerOrchestratorUserId: "demo-anika-001", canonicalEmployeeId: "demo-anika-001", meritLensEmployeeId: ANIKA, mappingStatus: "verified" },
    source: "career-orchestrator",
    careerGoal: "Junior Full-Stack Developer",
    skills: [
        { name: "React", level: "intermediate", evidenceLevel: "demonstrated", evidenceReference: "PROJECT-REACT-01" },
        { name: "Node.js", level: "beginner", evidenceLevel: "self_declared", evidenceReference: null }
    ],
    learningRecords: [{ title: "React Fundamentals", skills: ["React"], status: "completed", completedAt: "2026-10-24T00:00:00.000Z" }],
    projectReferences: [{ evidenceReference: "PROJECT-REACT-01", title: "Task Management Web App", skills: ["React", "JavaScript"], completedAt: "2026-10-25T00:00:00.000Z" }],
    generatedAt: "2026-11-01T07:49:52.995Z",
    ...overrides
});

let mock, mockPort, mockMode = "ok", mockPacket = packet(), seenAuth = [], srv, db;

before(async () => {
    mock = http.createServer((req, res) => {
        seenAuth.push(req.headers.authorization);
        if (mockMode === "401") { res.writeHead(401).end(JSON.stringify({ success: false })); return; }
        if (mockMode === "404") { res.writeHead(404).end(JSON.stringify({ success: false })); return; }
        res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ success: true, data: mockPacket }));
    });
    await new Promise((r) => mock.listen(0, r));
    mockPort = mock.address().port;

    cds.root = fileURLToPath(new URL("..", import.meta.url)); // works on Windows and Linux
    const csn = cds.model = await cds.load("*");
    db = await cds.connect.to("db", { kind: "sqlite", credentials: { url: ":memory:" } });
    await cds.deploy(csn).to(db);
    srv = await cds.serve("MeritLensService").from(csn).with(impl);
});
after(async () => { mock.close(); await db.disconnect?.(); });

const configure = () => {
    process.env.CAREER_ORCHESTRATOR_URL = `http://127.0.0.1:${mockPort}`;
    process.env.CAREER_ORCHESTRATOR_KEY = KEY;
};
const run = () => srv.send({ event: "importCareerContext", data: { reviewID: REVIEW } });
const entries = () => db.run(cds.ql.SELECT.from("meritlens.ContextEntries").where({ review_ID: REVIEW }));
const audits = (action) => db.run(cds.ql.SELECT.from("meritlens.AuditLogs").where({ review_ID: REVIEW, action }));

test("seed data: Anika and her sample review exist", async () => {
    const emp = await db.run(cds.ql.SELECT.one.from("meritlens.Employees").where({ ID: ANIKA }));
    assert.equal(emp.employeeCode, "EMP005");
});

test("not configured -> does not fail, writes an UNAVAILABLE audit row", async () => {
    delete process.env.CAREER_ORCHESTRATOR_URL; delete process.env.CAREER_ORCHESTRATOR_KEY;
    const r = await run();
    assert.equal(r.status, "UNAVAILABLE");
    assert.equal((await audits("CAREER_CONTEXT_UNAVAILABLE")).length, 1);
    assert.equal((await entries()).length, 0);
});

test("verified packet is imported, key sent as Bearer, audit row written", async () => {
    configure(); mockMode = "ok"; seenAuth = [];
    const r = await run();
    assert.equal(r.status, "IMPORTED");
    assert.equal(r.imported, 5); // goal + 2 skills + 1 project + 1 learning
    assert.deepEqual([...new Set(seenAuth)], [`Bearer ${KEY}`]);
    const rows = await entries();
    assert.ok(rows.every((e) => e.reportedBy === "career-orchestrator"));
    assert.equal((await audits("CAREER_CONTEXT_IMPORTED")).length, 1);
});

test("importing twice creates no duplicates", async () => {
    const r = await run();
    assert.equal(r.imported, 0);
    assert.equal(r.skipped, 5);
    assert.equal((await entries()).length, 5);
});

test("imported career data never creates automatic findings", async () => {
    const result = await srv.send({ event: "analyseReview", data: { reviewID: REVIEW } });
    assert.ok(!result.findings.some((f) => f.findingType === "OVERLOOKED_CONTRIBUTION"));
});

test("unverified or mismatched identity is refused", async () => {
    configure(); mockMode = "ok";
    mockPacket = packet({ identity: { ...packet().identity, mappingStatus: "pending_verification" } });
    assert.match((await run()).message, /not verified/);
    mockPacket = packet({ identity: { ...packet().identity, meritLensEmployeeId: "someone-else" } });
    assert.match((await run()).message, /does not match/);
    mockPacket = packet();
});

test("wrong key, unmapped employee and unreachable service all degrade gracefully", async () => {
    mockMode = "401"; assert.match((await run()).message, /service key not accepted/);
    mockMode = "404"; assert.match((await run()).message, /not mapped/);
    mockMode = "ok"; process.env.CAREER_ORCHESTRATOR_URL = "http://127.0.0.1:1";
    assert.match((await run()).message, /unreachable/);
    configure();
});

test("packet-to-entries mapping contains no personal data or scores", () => {
    const text = JSON.stringify(buildContextEntries(packet()));
    assert.ok(!/Anika|@|score|rating/i.test(text));
    assert.equal(checkIdentity(packet(), ANIKA), null);
});
