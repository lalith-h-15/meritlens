# MeritLens

This repository contains the SAP CAP backend and the React/Vite frontend for MeritLens. The frontend lives in `frontend/` so it can be developed and built independently while keeping the CAP backend at the repository root.

## Frontend contents

- `frontend/src/pages/`: landing, login, registration, employee, and manager pages.
- `frontend/src/layouts/`: employee and manager application layouts.
- `frontend/src/context/`: authentication and orchestrator state.
- `frontend/src/lib/api.ts`: shared API client and authentication/orchestrator requests.
- `frontend/src/index.css`, `frontend/tailwind.config.js`: styles and Tailwind configuration.
- `frontend/package.json`: frontend dependencies and Vite scripts.

The compiled `frontend/dist/` output and installed `frontend/node_modules/` are local build artifacts and are not committed.

### Run and build the frontend

```bash
npm ci --prefix frontend
npm run dev --prefix frontend
```

Create a production build with:

```bash
npm run build --prefix frontend
```

The frontend's API client currently targets `http://localhost:5100`; configure the backend to be available there when exercising API-backed features.

## Backend contents

## What is present in the source archive

- `db/schema.cds`: Employees, Reviews, Evidence, ContextEntries, Findings, and AuditLogs entities.
- `srv/meritlens-service.cds`: OData projections for those six entities.
- `db/data/meritlens-Employees.csv`: sample employee seed data.

CAP automatically exposes CRUD operations for the projected entities. The extracted backend source does **not** contain custom JavaScript/TypeScript service handlers, review-analysis rules, resolution actions, or audit workflow handlers. Those still need to be implemented and tested; the presence of the frontend does not mean the backend is complete.

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

### Gemini API test utility

`gemini-test.mjs` checks `GEMINI_API_KEY` and makes live requests to Google's Gemini API to find a compatible Flash model and test content generation. Run it from the repository root with:

```bash
GEMINI_API_KEY=your-key node gemini-test.mjs
```

This utility requires a valid API key and network access. `gemini-request.json` contains a minimal sample request body.

## Frontend addition recorded

The frontend was copied from the supplied `MeritLens Final` project folder into `frontend/`. The backend files at the repository root were preserved, and the frontend's local dependencies and generated build output were excluded. `frontend/dist/` was added to `.gitignore`.

The frontend was installed with `npm ci --prefix frontend` and verified with `npm run build --prefix frontend`. The change was committed as `bda8d70` (`Add MeritLens frontend`) and pushed to the GitHub branch `vaibhav-frontend`.
