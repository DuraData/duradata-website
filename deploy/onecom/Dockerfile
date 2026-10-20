# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS dependencies
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY academy/package.json academy/package.json
# The Academy workspace has a Prisma postinstall hook, but its schema is copied
# in the next stage. Generate explicitly there after the full source is present.
RUN npm ci --ignore-scripts

FROM dependencies AS builder
WORKDIR /workspace
COPY . .
# Next sets NODE_ENV=production while compiling. These non-routable values only
# satisfy static environment validation; the build never runs migrations or
# connects to a database. Real values are injected into the runtime container.
ENV ACADEMY_DATABASE_URL=mysql://build:build@127.0.0.1:3306/build
ENV NEXT_PUBLIC_APP_URL=https://academy.duradata.co.za
RUN npm run db:generate \
    && npm exec --workspace academy -- next build --webpack

FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app/academy

RUN groupadd --system --gid 1001 academy \
    && useradd --system --uid 1001 --gid academy --home-dir /app academy

COPY --from=builder --chown=academy:academy /workspace/academy/.next/standalone/ /app/
COPY --from=builder --chown=academy:academy /workspace/academy/.next/static/ /app/academy/.next/static/
COPY --from=builder --chown=academy:academy /workspace/academy/public/ /app/academy/public/

USER academy
EXPOSE 3000
CMD ["node", "server.js"]

# This stage is used only for an explicit, one-shot database setup command.
# It is never started by the normal `docker compose up` operation.
FROM dependencies AS database-jobs
ENV NODE_ENV=production
WORKDIR /workspace
COPY . .
RUN npm run db:generate
WORKDIR /workspace/academy
CMD ["sh", "-lc", "npx prisma migrate deploy && npm run academy:install-free-courses && npm run academy:verify-free-courses"]
