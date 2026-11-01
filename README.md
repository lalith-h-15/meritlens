# MeritLens — CAP backend working copy

This folder contains the SAP CAP backend portion extracted from the uploaded `MeritLens(1).zip` archive. The React/Vite frontend, compiled `dist` output, nested frontend ZIP, generated deployment files, and local deployment environment files have been excluded.

## What is present in the source archive

- `db/schema.cds`: Employees, Reviews, Evidence, ContextEntries, Findings, and AuditLogs entities.
- `srv/meritlens-service.cds`: OData projections for those six entities.
- `db/data/meritlens-Employees.csv`: sample employee seed data.

CAP automatically exposes CRUD operations for the projected entities. The extracted source does **not** contain custom JavaScript/TypeScript service handlers, review-analysis rules, resolution actions, or audit workflow handlers. Those still need to be implemented and tested; this is a clean backend-only starting copy, not a claim that MeritLens backend is complete.

## Requirements

- Node.js LTS
- npm

## Run locally

```bash
npm install
npm run dev
```

The CAP service should start locally with SQLite. Open the service root shown in the terminal and inspect `$metadata` to confirm the OData entity fields.

## Build

```bash
npm run build
```

## Important next backend work

1. Verify entity relationships, required fields, enums, and constraints.
2. Implement review submission and lifecycle transitions.
3. Implement evidence/context validation and the deterministic finding engine.
4. Implement human resolution and append-only audit events.
5. Add authentication/authorization and employee-level access controls.
6. Add automated tests for CRUD, review analysis, permissions, and audit behaviour.
7. Configure HANA/XSUAA and BTP destinations only after local behaviour is tested.

Do not add real employee data or credentials to this repository. Use synthetic records for development.
