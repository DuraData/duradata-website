import { copyFile, cp, mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const academyRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const nextRoot = path.join(academyRoot, ".next")
const standaloneRoot = path.join(nextRoot, "standalone")
const nestedAppRoot = path.join(standaloneRoot, "academy")
const nestedNextRoot = path.join(nestedAppRoot, ".next")

// Next preserves the workspace path when the Turbopack root is the monorepo.
// Hostinger launches the first standalone server it finds as the deployment
// root, so flatten that server beside the traced node_modules it requires.
await copyFile(path.join(nestedAppRoot, "server.js"), path.join(standaloneRoot, "server.js"))
await cp(nestedNextRoot, path.join(standaloneRoot, ".next"), {
  recursive: true,
  force: true,
  // Turbopack gives externalized packages hash-suffixed links under
  // .next/node_modules. Materialize their targets so Hostinger's artifact
  // packager cannot drop the links or their runtime contents.
  dereference: true,
})

await mkdir(path.join(standaloneRoot, ".next"), { recursive: true })
await cp(path.join(nextRoot, "static"), path.join(standaloneRoot, ".next", "static"), {
  recursive: true,
  force: true,
})
await cp(path.join(academyRoot, "public"), path.join(standaloneRoot, "public"), {
  recursive: true,
  force: true,
})

// Avoid leaving a second server entrypoint that Hostinger could package
// without the sibling standalone node_modules directory.
await rm(path.join(nestedAppRoot, "server.js"))

console.log("Prepared flattened Hostinger standalone bundle")
