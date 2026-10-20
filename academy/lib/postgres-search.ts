import { prisma } from "@/lib/prisma"

const IDENTIFIER = /^[A-Za-z][A-Za-z0-9_]*$/

/**
 * Return matching IDs with PostgreSQL's case-insensitive ILIKE operator.
 * Identifiers are developer-owned and still fail closed through this guard.
 */
export async function postgresContainsIds(table: string, columns: readonly string[], search: string) {
  if (!IDENTIFIER.test(table) || columns.length === 0 || columns.some((column) => !IDENTIFIER.test(column))) {
    throw new Error("Invalid search identifier")
  }
  const predicate = columns.map((column, index) => `"${column}" ILIKE $${index + 1}`).join(" OR ")
  const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT "id" FROM "${table}" WHERE ${predicate}`,
    ...columns.map(() => `%${search}%`),
  )
  return rows.map((row) => row.id)
}
