# Duradata Academy

Duradata Academy is the full-stack Next.js runtime for the combined Duradata deployment. It provides corporate training, public Free Learning, an optional academic module, role-based administration, organisations and learners, assignments, enrolments, progress, assessments, certificates, payments, email, and durable uploads.

## Stack and security

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4
- a dedicated PostgreSQL 18 database through Prisma 7 and the node-postgres adapter
- hashed, database-backed session tokens with HttpOnly, Secure production cookies
- server-side RBAC, same-origin mutation checks, rate limiting, and server-enforced feature modes
- server-verified Paynow callbacks and S3-compatible image storage
- Node unit tests and Playwright workflow/browser tests

Academy authentication is intentionally scoped to the Academy host. The session cookie has no parent-domain attribute, so it is not shared with the marketing site.

## Setup

Run normal commands from the repository root. Copy `.env.example` to `.env.local`, configure PostgreSQL, then run:

```bash
npm install
npm run db:generate
npm run db:migrate:deploy
npm run dev
```

Production migrations use `ACADEMY_DIRECT_DATABASE_URL` when supplied and otherwise use `ACADEMY_DATABASE_URL`. The application never reads a generic `DATABASE_URL`, preventing accidental reuse of the source LMS connection.

The baseline migration creates the schema and persists Duradata's mode defaults. `npm run db:seed` is for development/reference content only and must not be used to populate a clean production database.

## Testing


```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The build command generates the Prisma client and compiles the standalone runtime,
but it never migrates or seeds a database. Use `npm run deploy:database` only from
an authorised production deployment job with the intended PostgreSQL environment.

For E2E tests, use a disposable PostgreSQL database whose name contains `test`, set `ACADEMY_TEST_DATABASE_URL`, install Chromium once with `npx playwright install chromium`, and run:

```bash
npm run test:e2e:safe --workspace academy
```

The guard refuses to reset ambiguous database names. Paynow is mocked only when both the E2E flag and an explicit test database are active.

## Administration

Administrators manage Academic Learning, Corporate Learning, and Free Learning under `/admin/settings`. Corporate organisation membership and course assignments are under `/admin/organizations`. The default is Academic off, Corporate on, and Free on.

## Production

The marketing website remains on Hostinger. Academy runs separately on the one.com VPS and only `academy.duradata.co.za` is routed to it. The VPS Compose project includes private PostgreSQL storage and does not publish a database port. Production uploads still require S3-compatible storage because application-local files are not treated as durable storage.

The prior Hostinger MySQL database is not used at runtime after cutover. When it is reachable, migrate it with `npm run db:migrate:mysql-to-postgres` using a temporary read-only `MYSQL_SOURCE_DATABASE_URL`; then run `npm run db:verify:mysql-to-postgres`. The migration must verify every table before Academy traffic is moved.

The old `/zimbabwe-learning-hub` and `/sa-learning-hub` paths remain redirects for compatibility. `/academic-learning` is the neutral canonical route if the academic mode is enabled later.
