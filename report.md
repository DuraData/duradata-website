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

## Free Coding Learning Library

Duradata Academy now contains an original, production-managed Free Learning library. The catalogue exposes the exact ten requested courses when `freeLearningEnabled=true`; the existing proxy returns the disabled experience for the catalogue, course routes, and Free Learning APIs when the switch is off. All offerings have `courseType=FREE`, require no Paynow checkout, and are published in English under the owner name **Duradata Academy**.

| Course | Category | Duration | Modules / lessons | Quizzes / questions | Exercises | Final project |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| HTML & CSS Fundamentals | Web Development | 9 hours | 17 / 17 | 17 / 34 | 17 | Responsive personal or business website |
| JavaScript Programming Fundamentals | Programming | 11 hours | 21 / 21 | 21 / 42 | 21 | Interactive task-management application |
| Python Programming for Beginners | Programming | 11 hours | 20 / 20 | 20 / 40 | 20 | Command-line expense tracker |
| SQL & Relational Database Fundamentals | Databases | 9 hours | 24 / 24 | 24 / 48 | 24 | Training and course-management database |
| Git & GitHub Essentials | Version Control | 6 hours | 20 / 20 | 20 / 40 | 20 | Collaborative Git repository |
| TypeScript Fundamentals | Programming | 8 hours | 21 / 21 | 21 / 42 | 21 | Typed inventory and task application |
| React Fundamentals | Frontend Development | 11 hours | 22 / 22 | 22 / 44 | 22 | Course catalogue and training dashboard |
| Node.js & REST API Development | Backend Development | 11 hours | 23 / 23 | 23 / 46 | 23 | Training management REST API |
| C# & .NET Fundamentals | Microsoft Development | 11 hours | 23 / 23 | 23 / 46 | 23 | Employee and course registration application |
| Data Structures, Algorithms & Problem Solving | Computer Science | 11 hours | 24 / 24 | 24 / 48 | 24 | Practical algorithm challenge set |
| **Total** | 8 categories | **98 hours** | **215 / 215** | **215 / 430** | **215** | **10 projects** |

Each lesson includes objectives, concept explanation, a worked example with expected behaviour and explanation, common mistakes, recommended practices, an independent exercise with expected-result guidance, a summary, and a two-question knowledge check with explanations. Every final project includes a scenario, requirements, minimum acceptance criteria, stretch goals, and submission guidance. Code blocks use horizontal overflow protection for narrow screens.

The recommended learning path is presented in the Free Learning catalogue. The main path is HTML/CSS → JavaScript → Git/GitHub → TypeScript → React → Node.js. Parallel foundations cover Python → Data Structures and Algorithms, SQL, and C#/.NET. Catalogue discovery includes text search, category filters, and difficulty filters.

Free Learning now uses the existing Academy LMS path with added native records for explicit free enrolment, persistent scored quiz attempts, lesson progress, completion recognition, and Duradata Academy Certificates of Completion. A passing lesson quiz marks that lesson complete; completing all published lessons records course completion and issues a non-accreditation completion certificate. Free enrolments also appear in the existing My Courses dashboard.

Production content is installed by `npm run academy:install-free-courses`. It uses stable managed keys/slugs and deterministic nested identifiers, is safe to rerun, creates no users or organisations, does not delete data, and never runs the development seed. A course at the current managed version is preserved; a course touched by an administrator (`updatedById`) is also preserved rather than overwritten. Interrupted first-time installs remain resumable because the managed version is recorded only after all nested content is installed. Every production build runs the installer after migrations and then runs `npm run academy:verify-free-courses`; the build fails before release unless all ten records are published/free and their lesson, example, exercise, and question counts pass.

Research used only for learning progression, terminology, recommended practices, and source records: W3Schools HTML/CSS/JavaScript/SQL, TutorialsPoint Python and general programming references, MDN Learn and accessibility guidance, freeCodeCamp curricula, the official Python tutorial, TypeScript Handbook, React Learn, Node.js Learn, PostgreSQL tutorial, Pro Git and GitHub documentation, Microsoft Learn for C#/.NET, and OWASP API Security. All Duradata lesson prose, examples, exercises, quiz questions, explanations, and project briefs were independently written; no external tutorial text or proprietary assessment was copied.

Local verification for this library: Prisma schema validation **passed**; generated Prisma client **passed**; TypeScript **passed**; optimized Next.js build **passed**; targeted ESLint **passed**; unit tests **13/13 passed**, including library structure, exact course names, per-course assessment minimums, exercise/project completeness, and Node.js security constraints. The local MariaDB integration run was unavailable because the isolated MySQL service was stopped; the production build therefore performs both installation and read-back verification against the configured Academy database before publishing.

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
