import test from "node:test"
import assert from "node:assert/strict"
import { postgresConnectionOptions, postgresSchema } from "../../lib/database-url"

test("production PostgreSQL options enable verified TLS and parse pool details", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  const previousNodeEnv = process.env.NODE_ENV
  process.env.ACADEMY_DATABASE_URL = "postgresql://user:pass@example.com:5433/academy?schema=academy&sslmode=require&connection_limit=4&connect_timeout=7"
  Object.assign(process.env, { NODE_ENV: "production" })
  try {
    const options = postgresConnectionOptions()
    assert.equal(options.max, 4)
    assert.equal(options.connectionTimeoutMillis, 7_000)
    assert.deepEqual(options.ssl, { rejectUnauthorized: true })
    assert.equal(postgresSchema(), "academy")
    assert.equal(options.connectionString, "postgresql://user:pass@example.com:5433/academy?sslmode=require")
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
    Object.assign(process.env, { NODE_ENV: previousNodeEnv })
  }
})

test("connection options decode a percent-encoded password", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  process.env.ACADEMY_DATABASE_URL = "postgresql://user:p%3Fssword@example.com:5432/academy"
  try {
    const options = postgresConnectionOptions()
    assert.match(String(options.connectionString), /p%3Fssword/)
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
  }
})

test("an unencoded reserved character in the URL raises a clear configuration error", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  process.env.ACADEMY_DATABASE_URL = "postgresql://user:p?ssword@example.com:5432/academy"
  try {
    assert.throws(() => postgresConnectionOptions(), /percent-encoded/)
  } finally {
    process.env.ACADEMY_DATABASE_URL = previousUrl
  }
})

test("marketing-only deployments never parse the retired Academy database URL", () => {
  const previousUrl = process.env.ACADEMY_DATABASE_URL
  const previousMarketingOnly = process.env.MARKETING_ONLY_DEPLOYMENT
  process.env.ACADEMY_DATABASE_URL = "mysql://retired-source.invalid/academy"
  process.env.MARKETING_ONLY_DEPLOYMENT = "true"
  try {
    const options = postgresConnectionOptions()
    assert.equal(options.connectionString, "postgresql://marketing-only:disabled@127.0.0.1:5432/disabled")
  } finally {
    if (previousUrl === undefined) delete process.env.ACADEMY_DATABASE_URL
    else process.env.ACADEMY_DATABASE_URL = previousUrl
    if (previousMarketingOnly === undefined) delete process.env.MARKETING_ONLY_DEPLOYMENT
    else process.env.MARKETING_ONLY_DEPLOYMENT = previousMarketingOnly
  }
})
