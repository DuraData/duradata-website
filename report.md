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

Research used only for learning progression, terminology, recommended practices, and source records: [W3Schools](https://www.w3schools.com/), [TutorialsPoint](https://www.tutorialspoint.com/), [MDN Learn](https://developer.mozilla.org/en-US/docs/Learn_web_development), [freeCodeCamp](https://www.freecodecamp.org/learn/), the [official Python tutorial](https://docs.python.org/3/tutorial/), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/), [React Learn](https://react.dev/learn), [Node.js Learn](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs), [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html), [Pro Git](https://git-scm.com/book/en/v2) and GitHub documentation, [Microsoft Learn for C#/.NET](https://learn.microsoft.com/en-us/dotnet/csharp/), and [OWASP API Security](https://owasp.org/www-project-api-security/). All Duradata lesson prose, examples, exercises, quiz questions, explanations, and project briefs were independently written; no external tutorial text or proprietary assessment was copied.

Local verification for this library: Prisma schema validation **passed**; generated Prisma client **passed**; TypeScript **passed**; optimized Next.js build **passed**; targeted ESLint **passed**; unit tests **13/13 passed**, including library structure, exact course names, per-course assessment minimums, exercise/project completeness, and Node.js security constraints. The local MariaDB integration run was unavailable because the isolated MySQL service was stopped; the production build therefore performs both installation and read-back verification against the configured Academy database before publishing.

## Verification completed

Local safety and structure checks passed before deployment:

- Prisma schema validation and client generation: **passed**
- optimized Next.js production build: **passed**
- targeted ESLint and TypeScript type-check: **passed**
- unit tests: **13/13 passed**
- existing Playwright E2E suite: **47/47 passed** against the disposable `duradata_academy_test` database
- feature matrix: all eight Academic/Corporate/Free combinations passed page, API, and navigation checks
- host routing, four-role authentication/RBAC, password reset, course approval, enrollment, organizations/assignments, Free Learning, mocked Paynow fulfillment, idempotency, and upload security: **passed**

Production read-back verification ran inside the Hostinger build against the dedicated Academy MySQL database. It confirmed **10 published free courses, 215 sections, 215 published lessons, 215 worked examples, 215 exercises, and 430 quiz questions**. The installer rerun reported every course as `preserved`, demonstrating that the production install is idempotent.

Live browser verification passed for `https://duradata.co.za`, `https://academy.duradata.co.za/learn`, all ten course overview URLs, the first HTML lesson, catalogue text search for Python/HTML/JavaScript/SQL/React/C#/Git, the intermediate difficulty filter, and the `/courses` corporate-training fallback. At a 390 × 844 mobile viewport, all ten cards remained available with no horizontal overflow. The browser console reported no errors. The public lesson correctly permits reading while asking a signed-out learner to log in before enrolment, quiz submission, saved progress, or certificate issuance; browser QA did not create or mutate a production learner account.

`npm audit` currently reports 6 advisories (5 high, 1 moderate). Do not apply `npm audit fix --force` without a separate compatibility review. The earlier critical Next.js advisory was removed by upgrading to Next.js 16.3.4; recheck framework and Prisma connector updates regularly, require validated production MySQL TLS, and use the supplied CA option where applicable.

## Hostinger production deployment

Hostinger is connected to GitHub branch `main` and deploys pushes automatically. Deployment `42cdbaa3` completed on **2026-09-12 at 09:57 Africa/Johannesburg** using Node.js 24.x. It applied no pending migrations, preserved the already-installed version-1 library, passed production database verification and TypeScript compilation, built 75 Next.js routes, and prepared the flattened standalone bundle.

- Main website: `https://duradata.co.za`
- Academy: `https://academy.duradata.co.za`
- Free catalogue: `https://academy.duradata.co.za/learn`
- Main-site Academy links: open the Academy origin in a new tab with `target="_blank"` and `rel="noopener noreferrer"`
- Current production course library: **10/10 available**
- Original LMS repository/database: **not modified**

Do not run `npm run db:seed` in production; it intentionally creates development/reference content. Future managed-library revisions should increment `FREE_CODING_LIBRARY_VERSION`, retain stable course slugs, run the production installer, and allow the read-back verifier to block promotion if content is incomplete.
