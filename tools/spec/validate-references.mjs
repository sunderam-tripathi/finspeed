#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    handoffDir: 'specs/references/handoff',
    readme: 'specs/references/handoff/README.md'
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--handoff-dir') out.handoffDir = args[++i];
    else if (a === '--readme') out.readme = args[++i];
  }
  return out;
}

function listScenarioDirs(dir) {
  return readdirSync(dir)
    .filter(name => name.startsWith('SCN-'))
    .filter(name => statSync(join(dir, name)).isDirectory())
    .sort();
}

function parseReadmeEntries(path) {
  const text = readFileSync(path, 'utf8');
  const regex = /\[(SCN-\d{3})[^\]]*\]\((SCN-[^)\/]+[^)]*)\)/g;
  const ids = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    const linkTarget = match[2];
    const dir = linkTarget.split('/')[0];
    if (dir.startsWith('SCN-')) ids.add(dir);
  }
  return Array.from(ids).sort();
}

function main() {
  const opts = parseArgs();
  const dirs = listScenarioDirs(opts.handoffDir);
  const readmeIds = parseReadmeEntries(opts.readme);
  const dirSet = new Set(dirs);
  const readmeSet = new Set(readmeIds);

  const missingInReadme = dirs.filter(id => !readmeSet.has(id));
  const staleInReadme = readmeIds.filter(id => !dirSet.has(id));

  if (missingInReadme.length === 0 && staleInReadme.length === 0) {
    console.log('Reference validation passed.');
    console.log('Scenarios:', dirs.length);
    dirs.forEach(id => console.log(' -', id));
    process.exit(0);
  }

  if (missingInReadme.length) {
    console.error('Missing from README:', missingInReadme.join(', '));
  }
  if (staleInReadme.length) {
    console.error('Stale entries in README:', staleInReadme.join(', '));
  }
  process.exit(1);
}

try {
  main();
} catch (err) {
  console.error('Reference validation failed:', err.message);
  process.exit(2);
}
