# Duradata website and Duradata Academy

This repository is the authoritative source for both products. One Next.js application and one production process serve two hosts:

```text
duradata.co.za ───────────┐
                         ├─ one Duradata build and deployment
academy.duradata.co.za ──┘
```

The existing React marketing site remains in `src/` and is rendered by the shared runtime on the main host. The full-stack Academy lives in `academy/`. Host-aware middleware sends main-domain pages to the marketing shell and Academy-domain pages to the LMS; `/courses` on the main domain therefore never exposes Academy.

## Academy source ownership

The initial Academy code was physically imported from the read-only upstream LMS repository. Its exact origin is recorded in `academy/UPSTREAM.md`. It is not a submodule and neither builds nor runs against upstream. All future Academy work, schema changes, tests, and deployment configuration belong in this repository.

## Requirements

- Node.js 20 or newer (Node.js 22 or 24 is recommended on Hostinger)
- npm
- a new, dedicated MySQL 8 database for Duradata Academy
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

For a disposable E2E schema whose database name contains `test`, set `ACADEMY_TEST_DATABASE_URL` and run `npm run test:e2e:safe --workspace academy`. It resets only that unmistakably named test database, applies migrations, seeds E2E fixtures, and runs Playwright.

## Academy modes

The persisted defaults are:

| Mode | Default |
|---|---|
| Academic Learning | Off |
| Corporate Learning | On |
| Free Learning | On |

An Academy administrator changes these under **Admin → Settings**. Enforcement is applied to navigation, pages, direct routes, discovery, management routes, enrolment/checkout, and APIs. If the settings database is unavailable, mode checks fail closed.

## Hostinger deployment

Use the existing Hostinger deployment as one Node.js web application connected to this repository. Configure the repository root as the application root, npm as the package manager, `npm run build` as the build command, `npm run start` as the start command, and a supported Node.js version matching `package.json`.

Before the application starts, run `npm run db:migrate:deploy` against the new Academy MySQL database. Add every production value from `academy/.env.example` in the Hostinger Node.js environment-variable panel; do not upload or commit a populated environment file.

Both `duradata.co.za` (and the existing `www` canonical policy) and `academy.duradata.co.za` must route to this same Node.js application. In hPanel, attach the Academy subdomain as a domain/alias of the existing application and point its DNS to the same Hostinger target. Do not create a second application. If the current Hostinger product does not expose multiple-domain aliases, use its supported domain-alias/reverse-proxy facility or ask Hostinger support to bind the additional host to the existing app.

Those domain, DNS, database, storage, and secret changes are external actions and are intentionally not performed by this repository change. After configuring them, verify all four acceptance URLs over HTTPS and confirm the Academy session cookie remains host-only.

See `academy/.env.example`, `academy/README.md`, and `report.md` for the operational detail and verification record.
