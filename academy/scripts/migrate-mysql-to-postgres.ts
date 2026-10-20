import mysql from "mysql2/promise"
import pg from "pg"

const { Client } = pg
const BATCH_SIZE = Number(process.env.MIGRATION_BATCH_SIZE || 200)
const VERIFY_ONLY = process.argv.includes("--verify-only")

type CountMap = Record<string, number>
type Column = { column_name: string; data_type: string; udt_name: string; is_nullable: "YES" | "NO" }
type ForeignKey = { child_table: string; parent_table: string; child_columns: string[]; parent_columns: string[] }

function requiredUrl(name: "MYSQL_SOURCE_DATABASE_URL" | "ACADEMY_DATABASE_URL", protocol: RegExp) {
  const raw = process.env[name]?.trim()
  if (!raw) throw new Error(`${name} is required`)
  const parsed = new URL(raw)
  if (!protocol.test(parsed.protocol)) throw new Error(`${name} uses an unexpected protocol`)
  if (!parsed.pathname.replace(/^\//, "")) throw new Error(`${name} must include a database name`)
  return { raw, parsed }
}

function quoteMySql(identifier: string) {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(identifier)) throw new Error(`Unsafe MySQL identifier: ${identifier}`)
  return `\`${identifier}\``
}

function quotePg(identifier: string) {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(identifier)) throw new Error(`Unsafe PostgreSQL identifier: ${identifier}`)
  return `"${identifier}"`
}

function normalizeValue(value: unknown, column: Column) {
  if (value == null) return null
  if (column.data_type === "boolean") return Boolean(value)
  if (["json", "jsonb"].includes(column.data_type)) {
    const jsonValue = Buffer.isBuffer(value) ? value.toString("utf8") : value
    const parsed = typeof jsonValue === "string" ? JSON.parse(jsonValue) : jsonValue
    // node-postgres encodes JavaScript arrays as PostgreSQL arrays. Sending a
    // JSON string keeps JSON/JSONB values unambiguous for PostgreSQL.
    return JSON.stringify(parsed)
  }
  if (column.data_type === "bytea" && !Buffer.isBuffer(value)) return Buffer.from(value as ArrayBuffer)
  return value
}

async function mysqlTables(connection: mysql.Connection) {
  const [rows] = await connection.query<Array<{ TABLE_NAME: string }> & mysql.RowDataPacket[]>(
    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME",
  )
  return rows.map((row) => row.TABLE_NAME)
}

async function postgresTables(client: pg.Client, schema: string) {
  const result = await client.query<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE' ORDER BY table_name",
    [schema],
  )
  return result.rows.map((row) => row.table_name)
}

async function postgresColumns(client: pg.Client, schema: string, table: string) {
  const result = await client.query<Column>(
    `SELECT column_name, data_type, udt_name, is_nullable
       FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position`,
    [schema, table],
  )
  return result.rows
}

async function postgresPrimaryKey(client: pg.Client, schema: string, table: string) {
  const result = await client.query<{ column_name: string }>(
    `SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
      WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = $1 AND tc.table_name = $2
      ORDER BY kcu.ordinal_position`,
    [schema, table],
  )
  return result.rows.map((row) => row.column_name)
}

async function foreignKeys(client: pg.Client, schema: string): Promise<ForeignKey[]> {
  const result = await client.query<ForeignKey>(
    `SELECT child.relname AS child_table,
            parent.relname AS parent_table,
            array_agg(child_col.attname ORDER BY pair.ordinality)::text[] AS child_columns,
            array_agg(parent_col.attname ORDER BY pair.ordinality)::text[] AS parent_columns
       FROM pg_constraint constraint_row
       JOIN pg_class child ON child.oid = constraint_row.conrelid
       JOIN pg_class parent ON parent.oid = constraint_row.confrelid
       JOIN pg_namespace namespace_row ON namespace_row.oid = child.relnamespace
       JOIN LATERAL unnest(constraint_row.conkey, constraint_row.confkey) WITH ORDINALITY
            AS pair(child_num, parent_num, ordinality) ON true
       JOIN pg_attribute child_col ON child_col.attrelid = child.oid AND child_col.attnum = pair.child_num
       JOIN pg_attribute parent_col ON parent_col.attrelid = parent.oid AND parent_col.attnum = pair.parent_num
      WHERE constraint_row.contype = 'f' AND namespace_row.nspname = $1
      GROUP BY constraint_row.oid, child.relname, parent.relname`,
    [schema],
  )
  return result.rows
}

function dependencyOrder(tables: string[], keys: ForeignKey[]) {
  const remaining = new Set(tables)
  const ordered: string[] = []
  while (remaining.size) {
    const ready = [...remaining].filter((table) =>
      keys.filter((key) => key.child_table === table && key.parent_table !== table)
        .every((key) => !remaining.has(key.parent_table)),
    )
    if (!ready.length) throw new Error(`Foreign-key cycle prevents safe migration: ${[...remaining].join(", ")}`)
    ready.sort()
    for (const table of ready) {
      ordered.push(table)
      remaining.delete(table)
    }
  }
  return ordered
}

async function countsFromMySql(connection: mysql.Connection, tables: string[]): Promise<CountMap> {
  const counts: CountMap = {}
  for (const table of tables) {
    const [rows] = await connection.query<Array<{ count: number }> & mysql.RowDataPacket[]>(`SELECT COUNT(*) AS count FROM ${quoteMySql(table)}`)
    counts[table] = Number(rows[0]?.count || 0)
  }
  return counts
}

async function countsFromPostgres(client: pg.Client, schema: string, tables: string[]): Promise<CountMap> {
  const counts: CountMap = {}
  for (const table of tables) {
    const result = await client.query<{ count: string }>(`SELECT COUNT(*) AS count FROM ${quotePg(schema)}.${quotePg(table)}`)
    counts[table] = Number(result.rows[0]?.count || 0)
  }
  return counts
}

async function migrateTable(connection: mysql.Connection, client: pg.Client, schema: string, table: string) {
  const targetColumns = await postgresColumns(client, schema, table)
  const targetNames = new Set(targetColumns.map((column) => column.column_name))
  const [sourceColumnRows] = await connection.query<Array<{ COLUMN_NAME: string }> & mysql.RowDataPacket[]>(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
    [table],
  )
  const sourceNames = new Set(sourceColumnRows.map((row) => row.COLUMN_NAME))
  const columns = targetColumns.filter((column) => sourceNames.has(column.column_name))
  const missingRequired = targetColumns.filter((column) => !sourceNames.has(column.column_name) && column.is_nullable === "NO" && column.column_name !== "updatedAt")
  if (missingRequired.length) throw new Error(`${table} is missing required source columns: ${missingRequired.map((item) => item.column_name).join(", ")}`)
  if (!columns.length || !targetNames.has("id") && table !== "PlatformSetting") throw new Error(`${table} has no transferable primary data`)

  const primaryKey = await postgresPrimaryKey(client, schema, table)
  if (!primaryKey.length) throw new Error(`${table} has no PostgreSQL primary key`)
  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT ${columns.map((column) => quoteMySql(column.column_name)).join(", ")} FROM ${quoteMySql(table)}`,
  )
  const maxRowsPerBatch = Math.max(1, Math.min(BATCH_SIZE, Math.floor(60_000 / columns.length)))
  for (let offset = 0; offset < rows.length; offset += maxRowsPerBatch) {
    const batch = rows.slice(offset, offset + maxRowsPerBatch)
    const values: unknown[] = []
    const tuples = batch.map((row) => {
      const placeholders = columns.map((column) => {
        values.push(normalizeValue(row[column.column_name], column))
        return `$${values.length}`
      })
      return `(${placeholders.join(", ")})`
    })
    const updates = columns
      .filter((column) => !primaryKey.includes(column.column_name))
      .map((column) => `${quotePg(column.column_name)} = EXCLUDED.${quotePg(column.column_name)}`)
    const conflict = updates.length ? `DO UPDATE SET ${updates.join(", ")}` : "DO NOTHING"
    await client.query(
      `INSERT INTO ${quotePg(schema)}.${quotePg(table)} (${columns.map((column) => quotePg(column.column_name)).join(", ")})
       VALUES ${tuples.join(", ")}
       ON CONFLICT (${primaryKey.map(quotePg).join(", ")}) ${conflict}`,
      values,
    )
  }
  console.log(`${table}: migrated ${rows.length} row(s)`)
}

async function verifyForeignKeys(client: pg.Client, schema: string, keys: ForeignKey[]) {
  for (const key of keys) {
    const joins = key.child_columns.map((column, index) => `child.${quotePg(column)} = parent.${quotePg(key.parent_columns[index])}`).join(" AND ")
    const present = key.child_columns.map((column) => `child.${quotePg(column)} IS NOT NULL`).join(" AND ")
    const missing = key.parent_columns.map((column) => `parent.${quotePg(column)} IS NULL`).join(" AND ")
    const result = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count
         FROM ${quotePg(schema)}.${quotePg(key.child_table)} child
         LEFT JOIN ${quotePg(schema)}.${quotePg(key.parent_table)} parent ON ${joins}
        WHERE ${present} AND ${missing}`,
    )
    if (Number(result.rows[0]?.count || 0) !== 0) {
      throw new Error(`Foreign-key verification failed: ${key.child_table} -> ${key.parent_table}`)
    }
  }
}

async function main() {
  const source = requiredUrl("MYSQL_SOURCE_DATABASE_URL", /^mysql:$/)
  const target = requiredUrl("ACADEMY_DATABASE_URL", /^postgres(?:ql)?:$/)
  if (source.parsed.hostname === target.parsed.hostname && source.parsed.pathname === target.parsed.pathname) {
    throw new Error("Source and target database identities must differ")
  }
  const schema = target.parsed.searchParams.get("schema") || "public"
  const mysqlConnection = await mysql.createConnection(source.raw)
  const postgresClient = new Client({ connectionString: target.raw })
  await postgresClient.connect()
  try {
    await mysqlConnection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
    await mysqlConnection.query("START TRANSACTION WITH CONSISTENT SNAPSHOT")
    const sourceTables = await mysqlTables(mysqlConnection)
    const targetTables = await postgresTables(postgresClient, schema)
    const missingTargets = sourceTables.filter((table) => !targetTables.includes(table))
    const missingSources = targetTables.filter((table) => !sourceTables.includes(table) && table !== "_prisma_migrations")
    if (missingTargets.length || missingSources.length) {
      throw new Error(`Schema mismatch. Missing PostgreSQL tables: ${missingTargets.join(", ") || "none"}; missing MySQL tables: ${missingSources.join(", ") || "none"}`)
    }
    const tables = targetTables.filter((table) => table !== "_prisma_migrations")
    const keys = await foreignKeys(postgresClient, schema)
    const sourceCounts = await countsFromMySql(mysqlConnection, tables)
    if (!VERIFY_ONLY) {
      await postgresClient.query("BEGIN")
      try {
        for (const table of dependencyOrder(tables, keys)) {
          try {
            await migrateTable(mysqlConnection, postgresClient, schema, table)
          } catch (error) {
            const detail = error instanceof Error ? error.message : String(error)
            throw new Error(`${table}: ${detail}`)
          }
        }
        await postgresClient.query("COMMIT")
      } catch (error) {
        await postgresClient.query("ROLLBACK")
        throw error
      }
    }
    const targetCounts = await countsFromPostgres(postgresClient, schema, tables)
    const mismatches = tables.filter((table) => sourceCounts[table] !== targetCounts[table])
    if (mismatches.length) {
      throw new Error(`Row-count verification failed: ${mismatches.map((table) => `${table} ${sourceCounts[table]} != ${targetCounts[table]}`).join("; ")}`)
    }
    await verifyForeignKeys(postgresClient, schema, keys)
    await mysqlConnection.commit()
    console.log(`Verified ${tables.length} tables; every source row and foreign-key relationship is present in PostgreSQL.`)
  } catch (error) {
    await mysqlConnection.rollback()
    throw error
  } finally {
    await mysqlConnection.end()
    await postgresClient.end()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
