# MeritLens — Final BTP Verification

**Verification date:** 2 November 2026  
**Environment:** SAP BTP Cloud Foundry, `ec747dfdtrial` organisation, `dev` space  
**Scope:** CAP backend and Approuter deployment; synthetic review-analysis smoke test

## Deployment

- `Meritlens-srv`: started, 1/1 instance.
- `Meritlens-approuter`: started, 1/1 instance.
- Corrected CAP backend deployed by targeting the `Meritlens-srv` MTA module.
- Production CDS build and MTA build completed successfully.

## Live functional test

The live `analyseReview` OData action returned **HTTP 200** and reported:

- `findingsGenerated`: 2
- `newFindingsCreated`: 2
- `EVIDENCE_GAP` — documentation concern without documentation-specific evidence.
- `OVERLOOKED_CONTRIBUTION` — contribution may not be reflected in the manager summary.

The `AuditLogs` OData entity subsequently returned a `REVIEW_ANALYZED` event with details indicating that two new findings were created.

## HANA NCLOB correction

The duplicate-finding check no longer compares the NCLOB `rationale` field in a SQL `WHERE` clause. It filters by scalar fields (`review_ID` and `findingType`), retrieves the existing rationales, and compares them in JavaScript. The live successful analysis action verifies this correction for the tested review.

## Not verified / not included

- SuccessFactors connectivity is not implemented/verified in this delivery.
- Career Orchestrator import has not been verified end-to-end against the live deployment.
- The supplied source archive did not include the React/Vite frontend.
- Included employee/review/context CSV records are synthetic demo data.

Do not present the unverified integrations or synthetic data as production-connected functionality.
