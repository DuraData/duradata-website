import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { rmSync } from 'node:fs';
import path from 'node:path';

const branchName = process.env.DIST_BRANCH || 'dist-only';

function run(command, env = process.env) {
  return execSync(command, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    env,
  }).trim();
}

try {
  run('git rev-parse --is-inside-work-tree');
} catch {
  console.error('Not inside a git repository.');
  process.exit(1);
}

if (!existsSync('dist')) {
  console.error('The dist folder does not exist. Run npm run build first.');
  process.exit(1);
}

const distNodeModulesPath = path.resolve('dist', 'node_modules');
if (existsSync(distNodeModulesPath)) {
  rmSync(distNodeModulesPath, { recursive: true, force: true });
}

const distVitePath = path.resolve('dist', '.vite');
if (existsSync(distVitePath)) {
  rmSync(distVitePath, { recursive: true, force: true });
}

try {
  const gitDir = run('git rev-parse --git-dir');
  const indexFile = path.resolve(gitDir, `${branchName}.index`);
  const env = {
    ...process.env,
    GIT_INDEX_FILE: indexFile,
    GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME || 'Build Bot',
    GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL || 'buildbot@example.com',
    GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME || 'Build Bot',
    GIT_COMMITTER_EMAIL: process.env.GIT_COMMITTER_EMAIL || 'buildbot@example.com',
  };

  run('git read-tree --empty', env);
  run('git --work-tree=dist add -A --force .', env);
  const tree = run('git write-tree', env);

  let parentArg = '';
  try {
    const parent = run(`git rev-parse --verify refs/heads/${branchName}`);
    parentArg = `-p ${parent}`;
  } catch {
    parentArg = '';
  }

  const message = `Update dist build ${new Date().toISOString()}`;
  const commit = run(`git commit-tree ${tree} ${parentArg} -m "${message}"`, env);
  run(`git update-ref refs/heads/${branchName} ${commit}`);
  rmSync(indexFile, { force: true });

  console.log(`Updated branch ${branchName} -> ${commit}`);
} catch (error) {
  console.error('Failed to update dist-only branch.');
  const stderr = error?.stderr?.toString?.() || '';
  if (stderr) {
    console.error(stderr.trim());
  } else {
    console.error(String(error));
  }
  process.exit(1);
}
