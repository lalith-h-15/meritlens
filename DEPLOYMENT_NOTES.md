# MeritLens Deployment and Integration Notes

## Included in this working copy

- CAP service definitions and review workflow handlers.
- `importCareerContext` action for importing synthetic Career Orchestrator evidence into a MeritLens review.
- XSUAA role configuration (`Reviewer` and `HRAdmin`).
- Approuter route to the CAP OData service through the BTP destination named `meritlens-backend`.
- MTA binding from the Approuter to the existing Destination Service instance `career-meritlens-destination`.

This archive is the backend/Approuter portion of MeritLens. The React/Vite frontend was not present in the uploaded source archive and is not included.

## Shared-tenant Approuter host pattern

The existing XSUAA instance is configured with `tenant-mode: shared`, so the Approuter requires `TENANT_HOST_PATTERN`. This is configured in the `Meritlens-approuter` module in `mta.yaml`:

```yaml
env:
  TENANT_HOST_PATTERN: '^(.*)-dev-meritlens-approuter\\.cfapps\\.ap21\\.hana\\.ondemand\\.com$'
```

The pattern includes a capturing group and matches the current Cloud Foundry route
`ec747dfdtrial-dev-meritlens-approuter.cfapps.ap21.hana.ondemand.com`, capturing `ec747dfdtrial`.
If the app route or Cloud Foundry domain changes, update the pattern to match the new route.
A valid pattern fixes the Approuter's startup-time format validation; it does not by itself prove
that the captured tenant is provisioned or that end-to-end XSUAA tenant authentication works.

## BTP destination configuration

The subaccount-level or service-instance destination used by the Approuter must have:

| Property | Value |
|---|---|
| Name | `meritlens-backend` |
| Type | `HTTP` |
| URL | The deployed `Meritlens-srv` HTTPS URL |
| Proxy Type | `Internet` |
| Authentication | `NoAuthentication` |
| Additional property | `HTML5.ForwardAuthToken = true` |

The destination name must match `destination` in `approuter/xs-app.json`. The destination service instance must be bound to `Meritlens-approuter` through `mta.yaml`.

`HTML5.ForwardAuthToken=true` is important here: the Approuter authenticates the incoming user with XSUAA, and the destination forwards that OAuth token to the protected CAP backend. Do not set this property when the destination uses an authentication mode other than `NoAuthentication`.

## Career Orchestrator integration

The CAP action `importCareerContext(reviewID)` calls the deployed Career Orchestrator from the backend using:

- `ORCHESTRATOR_URL`
- `INTEGRATION_API_KEY`

Both are runtime environment variables on `Meritlens-srv`; do not hard-code them or commit their values. The action requires an authenticated `Reviewer`, verifies the employee mapping returned by Career Orchestrator, checks the canonical employee code, imports the returned project/learning/skill items as unverified evidence, avoids duplicate source references for the same review, and writes an audit entry using the authenticated actor ID.

All imported items are explicitly marked as demo data in their descriptions and are stored with `verified=false`. They must not be represented as live SuccessFactors data or as verified performance ratings.

## Verified deployment and functional test (2 November 2026)

The following were verified against the SAP BTP Cloud Foundry `dev` space:

- `Meritlens-srv` and `Meritlens-approuter` were both in `started` state with 1/1 instances.
- The corrected CAP service was deployed by targeting only the `Meritlens-srv` MTA module. The Approuter and database deployer were not redeployed in that operation.
- The production CAP build and `mbt build -p=cf` completed successfully.
- The live `POST /odata/v4/merit-lens/analyseReview` action returned HTTP 200 for the synthetic draft review and generated two findings (`EVIDENCE_GAP` and `OVERLOOKED_CONTRIBUTION`).
- `GET /odata/v4/merit-lens/AuditLogs` returned a `REVIEW_ANALYZED` event stating that two new findings were created.
- The HANA NCLOB fix was verified in the live analysis action: rationale values are retrieved and compared in JavaScript rather than compared in a SQL `WHERE` clause.

The `Meritlens-db-deployer` application appears as stopped in `cf apps`; this is a one-time deployment task, not a continuously running web application. No need to start it merely to keep the application online.

## Remaining limitations

- SuccessFactors is not connected or verified.
- Career Orchestrator import has not been live-tested end-to-end in this deployment.
- Seed records are synthetic demo data, not live employee records.
- Reviewer authorization is role-based at the service level. Separate manager-only permissions and per-review/per-employee row-level authorization are not implemented and must be added before using real employee data.
- The React/Vite frontend was not present in the supplied source archive and is not included in this repository package.

## Secret handling

Never include `cf env` output, service credentials, XSUAA client secrets, database passwords, or API keys in source files, ZIP archives, screenshots, or chat messages. If a secret has been exposed, rotate it and update the corresponding Cloud Foundry environment variable or service binding before testing again.
