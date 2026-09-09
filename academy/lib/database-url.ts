import { isSafeE2ETestMode } from "@/lib/test-database"

export type MySqlConnectionOptions = {
  host: string
  port: number
  user: string
  password?: string
  database: string
  connectionLimit: number
  connectTimeout: number
  idleTimeout: number
  ssl?: boolean | { rejectUnauthorized: boolean; ca?: string }
}

/** Parse the isolated Academy MySQL URL into PrismaMariaDb options. */
export function mysqlConnectionOptions(): MySqlConnectionOptions {
  const raw = process.env.ACADEMY_TEST_DATABASE_URL?.trim() || process.env.ACADEMY_DATABASE_URL?.trim()
  if (!raw) throw new Error("ACADEMY_DATABASE_URL is required")

  const url = new URL(raw)
  if (url.protocol !== "mysql:") throw new Error("The Academy database URL must use the mysql:// protocol")

  const database = decodeURIComponent(url.pathname.replace(/^\//, ""))
  if (!database) throw new Error("The Academy database URL must include a database name")

  const isolatedE2E = isSafeE2ETestMode()
  const sslMode = url.searchParams.get("sslmode")?.toLowerCase()
  const useTls = (process.env.NODE_ENV === "production" && !isolatedE2E) || Boolean(sslMode && sslMode !== "disable")
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n")

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: url.password ? decodeURIComponent(url.password) : undefined,
    database,
    connectionLimit: Number(url.searchParams.get("connection_limit") || 5),
    connectTimeout: Number(url.searchParams.get("connect_timeout") || 10_000),
    idleTimeout: Number(url.searchParams.get("idle_timeout") || 10),
    ...(useTls ? { ssl: ca ? { rejectUnauthorized: true, ca } : true } : {}),
  }
}
