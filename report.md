# Duradata Academy integration report

## Outcome

The Duradata repository is now the authoritative source for the existing marketing website and Duradata Academy. The Academy source is physically contained in `academy/`; it is not a submodule and has no build-time or runtime dependency on the original LMS repository.

One Next.js production process serves both products. Requests for `duradata.co.za` render the existing marketing application, while requests for `academy.duradata.co.za` render Academy. Host isolation is enforced before routing, including API isolation.

## Source and database isolation

- Original LMS source: `https://github.com/orinoninfo-pixel/lms_zimbabwe.git`
- Imported commit: `cbe4a48c63c34648a91fa23199b23858afe1f7ee`
- Original LMS repository modified: **No**
- Original LMS repository pushed to: **No**
- Academy stored in this repository under `academy/`: **Yes**
- Duradata repository authoritative for future Academy changes: **Yes**

Academy now uses Prisma 7 with a MySQL provider and MariaDB driver adapter. Runtime code accepts only Academy-specific connection variables: `ACADEMY_DATABASE_URL`, optional `ACADEMY_DIRECT_DATABASE_URL` for migrations, and the guarded `ACADEMY_TEST_DATABASE_URL`. It does not read a generic database URL and must never use the original LMS database.

The clean MySQL baseline is `academy/prisma/migrations/20260908000000_mysql_baseline/migration.sql`. It creates the full schema and persists the required feature defaults without inserting demo users or courses.

## Functional implementation

- Duradata Academy branding and neutral Academic Learning URLs/copy
- persisted Admin Settings switches with defaults Academic **Off**, Corporate **On**, Free **On**
- fail-closed enforcement across navigation, pages, direct URLs, APIs, search, dashboards, management routes, upload paths, enrollment, and checkout
- corporate organizations, organization administrators/learners, course assignments, and assignment-driven enrollments
- existing learner, instructor, content-manager, admin, courses, lessons, quizzes, homework, progress, certificates, favorites, reporting, notifications, Free Learning, email, uploads, and Paynow flows retained
- database-backed hashed sessions, host-only secure production cookies, server-side RBAC, same-origin mutation checks, rate limiting, verified payment callbacks, idempotent fulfillment, and binary upload validation
- S3-compatible durable production image storage configuration
- root-level development, build, start, lint, type-check, test, and migration commands

## Verification completed

All verification used the disposable local MySQL database `duradata_academy_test`; no original or production database was contacted.

- clean baseline migration and E2E fixture seed: **passed**
- optimized Next.js production build: **passed**
- ESLint: **passed**
- TypeScript type-check: **passed**
- unit tests: **8/8 passed**
- Playwright E2E tests: **47/47 passed**
- feature matrix: all eight Academic/Corporate/Free combinations passed page, API, and navigation checks
- host routing, four-role authentication/RBAC, password reset, course approval, enrollment, organizations/assignments, Free Learning, mocked Paynow fulfillment, idempotency, and upload security: **passed**
- visual browser QA: main site, Academy home, mobile layouts, Admin Settings, and Organizations inspected; no console errors or horizontal overflow observed

`npm audit` currently reports 7 transitive advisories (5 high, 2 moderate) through Prisma 7.10.0's pinned `mysql2`/`deepmerge-ts` packages and `@prisma/adapter-mariadb`'s pinned MariaDB connector. npm reports no compatible fix for the runtime connector path at this version. The earlier critical Next.js advisory was removed by upgrading to Next.js 16.3.4. Recheck and upgrade Prisma as soon as it publishes compatible patched transitive versions; production MySQL should require validated TLS and use the supplied CA option where applicable.

## Hostinger handoff

No Hostinger, DNS, database, storage, email, payment, domain, or other online resource was created or changed.

The remaining production actions are external and require the owner's explicit approval/action:

1. Create the new dedicated MySQL database and credentials in Hostinger. Do not reuse the LMS database.
2. Add the production values listed in `academy/.env.example` to the existing Hostinger Node.js application's environment.
3. Run `npm run db:migrate:deploy` against that new database.
4. Configure the existing Hostinger application to build with `npm run build` and start with `npm run start` from the repository root.
5. Bind `academy.duradata.co.za` to the same Node.js application as `duradata.co.za`, then add/update the required DNS record.
6. Supply S3-compatible storage, SMTP, Paynow, and strong secret values before enabling the corresponding production flows.
7. Verify both hosts over HTTPS, the host-only Academy cookie, outbound email, real storage, and a controlled real Paynow transaction.

Do not run `npm run db:seed` in production; it intentionally creates development/reference content.
