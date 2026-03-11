# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This repository is a full‑stack condo management application with:
- A NestJS + TypeORM backend in `backend/condo-man-backend` exposing a REST API over MySQL.
- A Vite + React + TypeScript frontend in `frontend/condo-man-frontend` that consumes the backend via Axios.
- An API collection in `Condo Management API Full CRUD/` (Bruno) that mirrors the main domain resources: companies, condominiums, units, owners, users, expenses, payments, and documents.

The backend uses environment variables (loaded via `@nestjs/config`) to configure the database and server, and auto‑loads TypeORM entities from the domain modules. The frontend organizes UI around a dashboard layout and a `CondominiumContext` that tracks the active condominium across pages.

## Common commands

### Backend (NestJS API) — `backend/condo-man-backend`

From the repo root:

```bash
cd backend/condo-man-backend
```

Install dependencies:

```bash
npm install
```

Run the API locally (default port comes from `PORT` in `.env`, falling back to `3000`):

```bash
# One-off dev run
npm run start

# Watch mode for development
npm run start:dev

# Production build + run (after building)
npm run build
npm run start:prod
```

Lint and formatting:

```bash
# ESLint (auto-fix enabled in the script)
npm run lint

# Prettier on src and test TypeScript files
npm run format
```

Tests (Jest):

```bash
# All unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests (see `test/jest-e2e.json` for config)
npm run test:e2e

# Coverage report
npm run test:cov
```

Run a single backend test file (Jest passes args through):

```bash
# Replace with an existing spec file under src/, e.g. src/modules/users/…
npm run test -- path/to/file.spec.ts
```

### Frontend (Vite + React) — `frontend/condo-man-frontend`

From the repo root:

```bash
cd frontend/condo-man-frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend locally (Vite dev server on port 8080):

```bash
npm run dev
```

Build and preview:

```bash
# Production build
npm run build

# Development-mode build (uses Vite's development mode)
npm run build:dev

# Preview the production build
npm run preview
```

Linting:

```bash
npm run lint
```

### Running the full stack locally

1. Start the database and ensure the backend `.env` has the correct MySQL connection settings.
2. In `backend/condo-man-backend`, start the API with `npm run start:dev` (listens on `PORT`, default 3000).
3. In `frontend/condo-man-frontend`, ensure `.env` sets `VITE_API_BASE_URL` to the backend URL (e.g. `http://localhost:3000`), then run `npm run dev` (serves the UI on port 8080).

You can exercise the API directly using the Bruno collection under `Condo Management API Full CRUD/` (open `collection.bru` in Bruno).

## Environment configuration

### Backend

`backend/condo-man-backend/.env` contains the local development configuration. At minimum, the application expects:

- `PORT` and `NODE_ENV` for server configuration.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` for the MySQL connection.
- `JWT_SECRET`, `JWT_EXPIRES_IN` for authentication tokens.

`AppModule` wires `ConfigModule.forRoot({ isGlobal: true })` together with `TypeOrmModule.forRootAsync`, using these env vars and `autoLoadEntities: true` with `synchronize: true` for schema management during development.

### Frontend

`frontend/condo-man-frontend/.env` controls how the UI connects to the API:

- `VITE_API_BASE_URL` — consumed by `src/services/api.ts` as the Axios `baseURL`. If unset, it defaults to `http://localhost:3000`.

## Backend architecture

- Entry point: `src/main.ts` bootstraps Nest, enables CORS, and listens on `process.env.PORT || 3000`.
- Root module: `src/app.module.ts` composes cross-cutting infrastructure:
  - Global configuration via `ConfigModule.forRoot`.
  - `TypeOrmModule.forRootAsync` for MySQL, using env vars for host, port, credentials, and database name.
  - Domain modules imported for each major resource: `CompaniesModule`, `UsersModule`, `CondominiumsModule`, `UnitsModule`, `OwnersModule`, `ExpensesModule`, `PaymentsModule`, and `DocumentsModule`.
- Domain modules live under `src/modules/<domain>/` and follow the standard NestJS pattern:
  - `<domain>.module.ts` imports `TypeOrmModule.forFeature([Entity])` and wires up the controller and service.
  - `<domain>.entity.ts` defines the TypeORM entity mapped to the MySQL schema.
  - `<domain>.service.ts` implements business logic and data access.
  - `<domain>.controller.ts` exposes REST endpoints for CRUD operations.

Because `autoLoadEntities` is enabled, adding a new entity in a module and registering it with `TypeOrmModule.forFeature` is usually enough for it to be picked up by TypeORM in development.

## Frontend architecture

- Tooling:
  - Vite configuration in `vite.config.ts` sets the dev server to port 8080 and defines the `@` alias to `./src`.
  - Tailwind and shadcn-ui are wired via `tailwind.config.ts`, `postcss.config.js`, and `components.json`.
- Application entry: `src/main.tsx` renders `<App />` into `#root`.
- App composition: `src/App.tsx` sets up cross-cutting providers and routing:
  - Global providers: `QueryClientProvider` (React Query), `TooltipProvider`, and two toaster components for notifications.
  - `CondominiumProvider` wraps the router to provide app-wide access to the active condominium.
  - Routing via `BrowserRouter` / `Routes` / `Route` from `react-router-dom`:
    - `/` → `Dashboard` page.
    - `/companies`, `/companies/:id` → company list and detail views.
    - `/condominiums` → condominium list.
    - `/condominiums/:id` with nested routes in `CondominiumLayout`:
      - index → `CondominiumDetail`.
      - `units`, `owners`, `expenses`, `payments` → respective domain pages.
    - Fallback `*` route → `NotFound`.
- Layouts and context:
  - `src/layouts/DashboardLayout.tsx` defines the main shell with `Sidebar`, `TopBar`, and a scrollable content area.
  - `src/layouts/CondominiumLayout.tsx` (and related components) provide the nested layout used for condominium-scoped routes.
  - `src/context/CondominiumContext.tsx` manages the active condominium ID and object, persisting the selected condo ID to `localStorage` and exposing helpers like `refreshCondominiums` and `clearCondominium`.
- Data layer:
  - `src/services/api.ts` exports a preconfigured Axios instance using `VITE_API_BASE_URL` and sets up request/response interceptors for future JWT auth and centralized error handling.
  - `src/services/*.ts` files (e.g. `companies.ts`, `condominiums.ts`, `users.ts`, `units.ts`, `expenses.ts`, `payments.ts`, `owners.ts`) provide thin wrappers around REST endpoints using the shared Axios client and strongly typed DTOs from `src/types`.

When extending the system, prefer to:
- Add new backend functionality by creating a new module under `src/modules/` (entity + service + controller) and wiring it into `AppModule` if it represents a new top-level domain.
- Mirror new backend resources on the frontend by adding a corresponding service in `src/services/`, DTOs in `src/types`, and pages/routes under `src/pages` (optionally using existing layouts and context where appropriate).
