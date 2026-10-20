import type { PoolConfig } from "pg"
import { isSafeE2ETestMode } from "@/lib/test-database"

function configuredUrl() {
  const raw = process.env.ACADEMY_TEST_DATABASE_URL?.trim() || process.env.ACADEMY_DATABASE_URL?.trim()
  if (!raw) throw new Error("ACADEMY_DATABASE_URL is required")

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(
      "ACADEMY_DATABASE_URL is not a valid URL. If the username or password contains " +
        "characters like ? # / : @ or %, they must be percent-encoded " +
        "(e.g. '?' becomes '%3F') before being placed in the connection string."
    )
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("The Academy database URL must use the postgresql:// or postgres:// protocol")
  }

  const database = decodeURIComponent(url.pathname.replace(/^\//, ""))
  if (!database) throw new Error("The Academy database URL must include a database name")

  return url
}

export function postgresSchema() {
  return configuredUrl().searchParams.get("schema")?.trim() || "public"
}

/** Parse the isolated Academy PostgreSQL URL into node-postgres pool options. */
export function postgresConnectionOptions(): PoolConfig {
  const url = configuredUrl()

  const isolatedE2E = isSafeE2ETestMode()
  const sslMode = url.searchParams.get("sslmode")?.toLowerCase()
  const useTls = (process.env.NODE_ENV === "production" && !isolatedE2E) || Boolean(sslMode && sslMode !== "disable")
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n")
  const max = Number(url.searchParams.get("connection_limit") || 5)
  const connectionTimeoutMillis = Number(url.searchParams.get("connect_timeout") || 10) * 1_000
  const idleTimeoutMillis = Number(url.searchParams.get("idle_timeout") || 10) * 1_000

  // These are pool/adapter options, not PostgreSQL server parameters.
  url.searchParams.delete("connection_limit")
  url.searchParams.delete("connect_timeout")
  url.searchParams.delete("idle_timeout")
  url.searchParams.delete("schema")

  return {
    connectionString: url.toString(),
    max,
    connectionTimeoutMillis,
    idleTimeoutMillis,
    ...(useTls ? { ssl: ca ? { rejectUnauthorized: true, ca } : { rejectUnauthorized: true } } : {}),
  }
}
