#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';

function safeRead(path) {
  if (!existsSync(path)) return null;
  try { return readFileSync(path, 'utf8'); } catch { return null; }
}

const args = process.argv.slice(2);
const idx = args.indexOf('--slice');
const sliceId = idx >= 0 ? args[idx + 1] : undefined;

const files = [
  'AGENTS.md',
  'AGENTS/charter/global-charter.md',
  'AGENTS/charter/navigation-matrix.md',
  'AGENTS/charter/proof-telemetry.md',
  'AGENTS/charter/automation-matrix.md',
];

try {
  for (const f of readdirSync('AGENTS/domains')) files.push('AGENTS/domains/' + f);
} catch {}

if (sliceId && existsSync(`AGENTS/slices/${sliceId}.md`)) files.push(`AGENTS/slices/${sliceId}.md`);

for (const f of files) {
  const text = safeRead(f);
  if (text == null) continue;
  console.log(`\n===== ${f} =====\n`);
  console.log(text);
}

