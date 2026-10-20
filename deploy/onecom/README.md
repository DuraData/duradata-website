# Duradata Academy on the existing one.com VPS

This deployment is deliberately isolated from every existing VPS application:

- Compose project: `duradata-academy`
- Directory: `/home/deploy/apps/duradata-academy`
- Proxy network alias: `duradata-academy-web`
- No host port is published; only the existing Caddy gateway can reach port 3000
- The existing Hostinger MySQL database remains the Academy database
- VPS PostgreSQL is not used or changed

## Safety gates

1. Record the exact Git commit and verify the working tree is clean.
2. Capture existing container IDs/start times and public health checks.
3. Confirm the external Docker network `public_proxy` exists.
4. Create `/home/deploy/apps/duradata-academy/shared/app.env` with mode `0600`.
5. Back up the Academy MySQL database before running `database-setup`.
6. Confirm both database URLs resolve to the intended Hostinger MySQL database.
7. Build and start only `web`; wait until its `/api/health` check is healthy.
8. Back up the shared Caddyfile, append only `Caddyfile.snippet`, validate the
   full configuration, and reload Caddy without restarting its container.
9. Run `database-setup` exactly once when a migration is required.
10. Verify the Academy URLs and re-check all pre-existing applications.

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

Do not commit the environment file or paste its secrets into shell history.

## Build and start

From the release checkout:

```bash
export DURADATA_ACADEMY_RELEASE="$(git rev-parse --short=12 HEAD)"
docker compose -f deploy/onecom/compose.production.yml build web
docker compose -f deploy/onecom/compose.production.yml up -d web
docker compose -f deploy/onecom/compose.production.yml ps
```

The normal start command cannot run migrations. After a verified backup and
database identity check, run the explicit setup profile if needed:

```bash
docker compose -f deploy/onecom/compose.production.yml --profile setup run --rm database-setup
```

Validate the Caddy configuration using the command already established by the
existing `public-gateway` project. Reload only after validation succeeds.

## Rollback

Keep the prior release and image. Restore only the previous Academy `web`
image, then re-run its health check. Do not use `docker compose down` against
another project, restart the Docker daemon, restart PostgreSQL, or restore a
cluster-wide database backup.
