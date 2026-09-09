import test from "node:test"
import assert from "node:assert/strict"
import { mysqlConnectionOptions } from "../../lib/database-url"

test("production MySQL options enable TLS and parse connection details", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  const previousNodeEnv = process.env.NODE_ENV
  process.env.ACADEMY_DATABASE_URL = "mysql://user:pass@example.com:3307/academy?sslmode=require&connection_limit=4"
  Object.assign(process.env, { NODE_ENV: "production" })
  try {
    const options = mysqlConnectionOptions()
    assert.equal(options.host, "example.com")
    assert.equal(options.port, 3307)
    assert.equal(options.database, "academy")
    assert.equal(options.connectionLimit, 4)
    assert.equal(options.ssl, true)
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
    Object.assign(process.env, { NODE_ENV: previousNodeEnv })
  }
})
