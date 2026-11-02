# MeritLens SAP BTP smoke-test checklist

Run these checks only after the MTA deployment succeeds. Use the deployed Approuter URL as the entry point; do not expose the CAP service directly for normal user access.

## 1. Cloud Foundry and HANA

- Confirm `Meritlens-srv` is `1/1` running.
- Confirm `Meritlens-approuter` is `1/1` running.
- Confirm `Meritlens-db-deployer` completed successfully (it is a task and does not need to remain running).
- Confirm `Meritlens-srv` is bound to `meritlens-xsuaa` and `meritlens-hdi`.
- Confirm `Meritlens-approuter` is bound to `meritlens-xsuaa` and `career-meritlens-destination`.

## 2. Destination and Approuter

Destination `meritlens-backend` should point to the deployed `Meritlens-srv` HTTPS URL and use:

- Type: `HTTP`
- Proxy Type: `Internet`
- Authentication: `NoAuthentication`
- Additional property: `HTML5.ForwardAuthToken = true`

The destination name must match the `destination` value in `approuter/xs-app.json`. Confirm the Approuter can reach the CAP OData service through this route.

## 3. XSUAA

- Sign in through the Approuter with a user assigned the `MeritLens_Reviewer` role collection.
- Confirm the user can access the MeritLens OData service.
- Test an unassigned user and confirm access is denied.
- Test an HR administrator with the `MeritLens_HRAdmin` role collection.

The current CAP service requires the `Reviewer` scope. The `HRAdmin` role template includes that scope. Separate manager-only permissions and per-review row-level authorization are not implemented yet.

## 4. Synthetic review workflow

The CSV seed data includes:

- Employee: `EMP001` (Aarav Sharma)
- Review: `66666666-6666-4666-8666-666666666666` (`FY2026`, `DRAFT`)
- Context entry: `77777777-7777-4777-8777-777777777777`

After the HDI deployer has loaded the CSV seed data:

1. Read `Employees` and confirm `EMP001` exists.
2. Read `Reviews` and confirm the draft review exists.
3. Invoke `analyseReview` with review ID `66666666-6666-4666-8666-666666666666`.
4. Confirm findings are created for the documentation evidence gap and possible overlooked contribution.
5. Invoke `analyseReview` again and confirm it does not create duplicate findings.
6. Resolve the findings, submit the review, and complete it only after no unresolved findings remain.
7. Read `AuditLogs` and confirm the authenticated actor ID is recorded.

## 5. Production-profile verification

Confirm the deployed application uses HANA and XSUAA. The local `reviewer` mock user and SQLite configuration are for local development only and are not proof of production authentication or persistence.

## Limitations

- These checks require a successful live BTP deployment and cannot be completed from the source archive alone.
- The current role check is service-level, not employee/review row-level.
- The Career Orchestrator import action requires its own reachable source endpoint and verified identity mapping; it is not required for the basic BTP/HANA/XSUAA smoke test.
- SuccessFactors is not connected. Use only clearly labelled synthetic data in this demonstration.
