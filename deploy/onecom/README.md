# Duradata Academy on the existing one.com VPS

This deployment is deliberately isolated from every existing VPS application:

- Compose project: `duradata-academy`
- Directory: `/home/deploy/apps/duradata-academy`
- Proxy network alias: `duradata-academy-web`
- No host port is published; only the existing Caddy gateway can reach port 3000
- `duradata.co.za` and `www.duradata.co.za` remain on Hostinger
- only `academy.duradata.co.za` is routed to this VPS application
- Academy uses its own PostgreSQL 18 container and persistent Docker volume
- the Hostinger MySQL database is a read-only migration source during cutover

## Safety gates

1. Record the exact Git commit and verify the working tree is clean.
2. Capture existing container IDs/start times and public health checks.
3. Confirm the external Docker network `public_proxy` exists.
4. Create `app.env`, `postgres.env`, and temporary `migration.env` under
   `/home/deploy/apps/duradata-academy/shared/`, all with mode `0600`.
5. Start only PostgreSQL and apply the PostgreSQL baseline.
6. When Hostinger returns, freeze Academy writes and take a verified MySQL backup.
7. Run the complete MySQL-to-PostgreSQL migration and require exact row-count
   and foreign-key verification for every table before starting `web`.
8. Build and start `web`; wait until its `/api/health` check is healthy.
9. Back up the shared Caddyfile, append only `Caddyfile.snippet`, validate the
   full configuration, and reload Caddy without restarting its container.
10. Move only the `academy.duradata.co.za` DNS record to the VPS.
11. Verify the Academy URLs and re-check all pre-existing VPS applications and
    the separate Hostinger website.

## Runtime environment

Use the keys documented in `academy/.env.example`. At minimum, production
requires `ACADEMY_DATABASE_URL` and `NEXT_PUBLIC_APP_URL`. Set these URL values
to the public Academy hostname:

```dotenv
APP_BASE_URL=https://academy.duradata.co.za
APP_URL=https://academy.duradata.co.za
NEXT_PUBLIC_APP_URL=https://academy.duradata.co.za
ACADEMY_URL=https://academy.duradata.co.za
ACADEMY_HOSTS=academy.duradata.co.za
```

The runtime database URL points at the private Compose service, never at the
Hostinger MySQL database:

```dotenv
ACADEMY_DATABASE_URL=postgresql://academy:URL_ENCODED_PASSWORD@db:5432/duradata_academy?schema=public&sslmode=disable
ACADEMY_DIRECT_DATABASE_URL=postgresql://academy:URL_ENCODED_PASSWORD@db:5432/duradata_academy?schema=public&sslmode=disable
```

`postgres.env` supplies `POSTGRES_DB=duradata_academy`, `POSTGRES_USER=academy`,
and a strong `POSTGRES_PASSWORD`. `migration.env` temporarily supplies the
read-only source as `MYSQL_SOURCE_DATABASE_URL`; remove that file after the
verified cutover.

Do not commit the environment file or paste its secrets into shell history.

## Build and start

From the release checkout:

```bash
export DURADATA_ACADEMY_RELEASE="$(git rev-parse --short=12 HEAD)"
docker compose -f deploy/onecom/compose.production.yml build web
docker compose -f deploy/onecom/compose.production.yml up -d db
docker compose -f deploy/onecom/compose.production.yml --profile setup run --rm database-setup
docker compose -f deploy/onecom/compose.production.yml up -d web
docker compose -f deploy/onecom/compose.production.yml ps
```

The setup job applies only the PostgreSQL schema. It deliberately does not
seed courses before the MySQL transfer, so source and target row counts can be
compared exactly.

When the Hostinger MySQL source is reachable again, freeze Academy writes,
back it up, and migrate every table:

```bash
docker compose -f deploy/onecom/compose.production.yml --profile migration run --rm data-migrate
docker compose -f deploy/onecom/compose.production.yml --profile migration run --rm data-migrate npm run db:verify:mysql-to-postgres
```

The migration preserves IDs and all rows, including every corporate course,
Free Learning tutorial, section, lesson, example, exercise, quiz, enrolment,
progress record, certificate, organization, assignment, user, and transaction.
It fails on any missing table, row-count mismatch, or orphaned relationship.

Validate the Caddy configuration using the command already established by the
existing `public-gateway` project. Reload only after validation succeeds.

## Rollback

Keep the prior release, image, MySQL backup, and a `pg_dump` made immediately
after migration. Restore only this Compose project's `web` image or PostgreSQL
volume. Do not run `docker compose down -v`, operate on another project,
restart the Docker daemon, or alter the VPS system PostgreSQL service.
