# Duradata website and Duradata Academy

This repository is the authoritative source for both products, with separate production hosting:

```text
duradata.co.za          → existing Hostinger website deployment
academy.duradata.co.za  → isolated one.com VPS Academy deployment
```

The existing React marketing site remains in `src/` and stays on Hostinger. The full-stack Academy lives in `academy/` and is deployed to the VPS. Host-aware routing remains in the codebase for local development and isolation, but the VPS proxy binds only the Academy hostname.

## Academy source ownership

The initial Academy code was physically imported from the read-only upstream LMS repository. Its exact origin is recorded in `academy/UPSTREAM.md`. It is not a submodule and neither builds nor runs against upstream. All future Academy work, schema changes, tests, and deployment configuration belong in this repository.

## Requirements

- Node.js 20 or newer (Node.js 22 or 24 is recommended on Hostinger)
- npm
- a dedicated PostgreSQL 18 database for Duradata Academy on the one.com VPS
- S3-compatible durable object storage for production uploads
- SMTP and Paynow credentials when those production features are enabled

The Academy must never be pointed at the original LMS database. Only the `ACADEMY_DATABASE_URL`, `ACADEMY_DIRECT_DATABASE_URL`, and explicitly guarded `ACADEMY_TEST_DATABASE_URL` names are accepted.

## Local development

From the repository root:

```bash
npm install
copy academy\.env.example academy\.env.local
npm run db:generate
npm run db:migrate:deploy
npm run dev
```

Use `http://duradata.localhost:3000` for the marketing site and `http://academy.localhost:3000` for Academy. Both wildcard hostnames resolve to loopback in modern browsers. A Host-header check is also possible:

```bash
curl -H "Host: duradata.co.za" http://127.0.0.1:3000/
curl -H "Host: academy.duradata.co.za" http://127.0.0.1:3000/
```

Do not run `npm run db:seed` against production: that command intentionally creates development/reference content. The migration itself persists the required feature defaults. Use the admin password scripts to bootstrap authorised staff accounts.

## Commands

```bash
npm run dev                 # complete application
npm run lint
npm run typecheck
npm test                    # unit tests
npm run test:e2e            # prepared test DB only
npm run build               # one authoritative production build
npm run start               # one production process
npm run db:generate
npm run db:migrate:deploy
```

`npm run build` compiles the application without changing any database. Production
database migrations and managed course installation are explicit deployment steps;
the one.com Compose workflow runs them through its isolated `database-setup` job.

For a disposable E2E schema whose database name contains `test`, set `ACADEMY_TEST_DATABASE_URL` and run `npm run test:e2e:safe --workspace academy`. It resets only that unmistakably named test database, applies migrations, seeds E2E fixtures, and runs Playwright.

## Academy modes

The persisted defaults are:

| Mode | Default |
|---|---|
| Academic Learning | Off |
| Corporate Learning | On |
| Free Learning | On |

An Academy administrator changes these under **Admin → Settings**. Enforcement is applied to navigation, pages, direct routes, discovery, management routes, enrolment/checkout, and APIs. If the settings database is unavailable, mode checks fail closed.

## Split production deployment

The Duradata marketing website remains on Hostinger. Do not move `duradata.co.za` or `www.duradata.co.za` to the VPS. Only Duradata Academy is deployed to the one.com VPS and only `academy.duradata.co.za` is routed there.

Hostinger sets `MARKETING_ONLY_DEPLOYMENT=true`. This prevents its marketing-only
runtime from reading or validating the retired Academy database connection; the
one.com Academy runtime must leave this flag unset.

The VPS deployment is defined in `deploy/onecom/`. It runs Academy, a private PostgreSQL 18 container, and one-shot setup/data-migration jobs. No PostgreSQL port is published to the internet; the Academy web container and database communicate only over the Compose private network.

The existing Hostinger Academy MySQL database is the migration source only. When Hostinger is reachable, use a read-only source account, freeze Academy writes, take a verified backup, and run `npm run db:migrate:mysql-to-postgres`. The transfer preserves all IDs and every table, then compares every source/target row count and checks all foreign-key relationships. Do not switch Academy traffic or DNS until this verification passes.

See `deploy/onecom/README.md` for the staged database, migration, cutover, backup, and rollback procedure. Hostinger website configuration is intentionally not changed by the Academy VPS deployment.

See `academy/.env.example`, `academy/README.md`, and `report.md` for the operational detail and verification record.
