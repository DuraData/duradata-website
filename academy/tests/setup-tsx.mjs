import os from "node:os"

// Some locked-down Windows runners deny the account lookup used by tsx.
if (process.platform === "win32") {
  os.userInfo = () => ({ uid: -1, gid: -1, username: process.env.USERNAME || "test", homedir: process.env.USERPROFILE || process.cwd(), shell: null })
}
