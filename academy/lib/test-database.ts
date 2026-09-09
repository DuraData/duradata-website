export function resolveTestDatabaseUrl() {
  const source = process.env.ACADEMY_TEST_DATABASE_URL?.trim() || process.env.ACADEMY_DATABASE_URL?.trim()
  if (!source) throw new Error("ACADEMY_TEST_DATABASE_URL or ACADEMY_DATABASE_URL is required for tests")
  const url = new URL(source)
  const databaseName = url.pathname.toLowerCase()
  if (!databaseName.includes("test")) throw new Error("Refusing destructive tests: the MySQL database name must contain 'test'")
  return url.toString()
}

export function isExplicitTestDatabaseUrl(source: string | undefined) {
  if (!source?.trim()) return false
  try {
    const url = new URL(source)
    const databaseName = url.pathname.toLowerCase()
    return databaseName.includes("test")
  } catch {
    return false
  }
}

export function isSafeE2ETestMode() {
  return process.env.E2E_TEST_MODE === "1" && isExplicitTestDatabaseUrl(process.env.ACADEMY_TEST_DATABASE_URL)
}
