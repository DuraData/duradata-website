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
    assert.equal(options.charset, "utf8mb4")
    assert.equal(options.collation, "utf8mb4_unicode_ci")
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
    Object.assign(process.env, { NODE_ENV: previousNodeEnv })
  }
})

test("connection options decode a percent-encoded password", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  process.env.ACADEMY_DATABASE_URL = "mysql://user:B%3F4puCMuUN@example.com:3306/academy"
  try {
    const options = mysqlConnectionOptions()
    assert.equal(options.password, "B?4puCMuUN")
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
  }
})

test("an unencoded reserved character in the URL raises a clear configuration error", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  process.env.ACADEMY_DATABASE_URL = "mysql://user:B?4puCMuUN@example.com:3306/academy"
  try {
    assert.throws(() => mysqlConnectionOptions(), /percent-encoded/)
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
  }
})
