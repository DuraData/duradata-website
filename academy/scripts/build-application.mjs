import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const nextBin = require.resolve("next/dist/bin/next")

// Route analysis imports the database client even though it never opens a
// connection. Keep compilation independent from every deployment database;
// the standalone runtime still reads the real environment when it starts.
const env = {
  ...process.env,
  ACADEMY_DATABASE_URL: "postgresql://build:build@127.0.0.1:5432/build",
  NEXT_PUBLIC_APP_URL: "https://academy.duradata.co.za",
}

const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  env,
  stdio: "inherit",
})

if (result.error) throw result.error
process.exitCode = result.status ?? 1
