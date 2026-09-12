import { prisma } from "@/lib/prisma"

const IDENTIFIER = /^[A-Za-z][A-Za-z0-9_]*$/

/**
 * Return matching IDs while explicitly converting prepared values to the
 * schema collation. Prisma's MariaDB adapter sends prepared strings with a
 * binary coercibility on some MySQL hosts, causing error 1267 for LIKE.
 * Identifiers are developer-owned and still fail closed through this guard.
 */
export async function mysqlContainsIds(table: string, columns: readonly string[], search: string) {
  if (!IDENTIFIER.test(table) || columns.length === 0 || columns.some((column) => !IDENTIFIER.test(column))) {
    throw new Error("Invalid search identifier")
  }
  const predicate = columns.map((column) =>
    `\`${column}\` COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', CONVERT(? USING utf8mb4) COLLATE utf8mb4_unicode_ci, '%')`
  ).join(" OR ")
  const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT CAST(\`id\` AS CHAR) AS id FROM \`${table}\` WHERE ${predicate}`,
    ...columns.map(() => search),
  )
  return rows.map((row) => row.id)
}
