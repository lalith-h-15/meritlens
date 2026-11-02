# MeritLens — CAP backend and Approuter

This repository contains the SAP CAP backend and Cloud Foundry Approuter portion of MeritLens. The React/Vite frontend was not included in the uploaded source archive.

## Main components

- `db/schema.cds` — Employees, Reviews, Evidence, ContextEntries, Findings, and AuditLogs.
- `db/data/` — synthetic employee, review and context seed records for deployment/demo testing.
- `srv/meritlens-service.cds` — OData projections and actions.
- `srv/meritlens-service.js` — deterministic review analysis, finding resolution, review lifecycle, authenticated audit logging, and Career Orchestrator evidence import.
- `approuter/` — XSUAA-protected entry point routing OData requests through the BTP destination `meritlens-backend`.
- `xs-security.json` — `Reviewer` and `HRAdmin` role templates.
- `mta.yaml` — MTA modules and bindings to the existing XSUAA, HDI, and Destination Service instances.

## Local development

Requirements: Node.js LTS and npm.

```bash
npm ci
npm run dev
```

The local CAP profile uses SQLite and a mock `reviewer` user for development only. Production configuration uses HANA and XSUAA. Never use the mock user or SQLite profile as evidence of production authentication. The CSV seed data includes a synthetic draft review and context entry so the review-analysis workflow can be exercised after database deployment.

## Build

```bash
npm ci
npx cds build --production
```

Build the MTA archive with the Cloud MTA Build Tool (`mbt build`) in an environment where the required dependencies and SAP build tools are installed.

## Career Orchestrator import

The action `importCareerContext(reviewID)` reads the server-side environment variables `ORCHESTRATOR_URL` and `INTEGRATION_API_KEY`. Keep the API key out of source control and frontend code. Imported records are synthetic demo evidence and remain `verified=false`.

## Verified BTP deployment (2 November 2026)

The CAP backend was successfully deployed to SAP BTP Cloud Foundry in the `dev` space. Both `Meritlens-srv` and `Meritlens-approuter` were confirmed running (1/1 instances). The live `analyseReview` OData action returned HTTP 200 and created two findings. The `REVIEW_ANALYZED` audit event was also retrieved from `AuditLogs`. The HANA NCLOB duplicate-check fix was therefore verified in the live action. See [`FINAL_VERIFICATION.md`](FINAL_VERIFICATION.md) for the recorded test outcome.

Read [`DEPLOYMENT_NOTES.md`](DEPLOYMENT_NOTES.md) before deploying. In particular, the BTP destination `meritlens-backend` must have `HTML5.ForwardAuthToken=true` while using `NoAuthentication`, and the Destination Service instance must be bound to the Approuter.

## Security and demo limitations

- The service currently requires the `Reviewer` role. Row-level authorization restricting reviewers to assigned employees/reviews is not implemented.
- The included seed data is synthetic and contains no live employee or SuccessFactors records.
- SuccessFactors is not connected; Career Orchestrator integration uses synthetic demo evidence.
- Do not commit credentials, `cf env` output, service keys, or API tokens.
