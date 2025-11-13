#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const LEDGER = 'specs/project-progress/slice-ledger.json';
const OUT = 'specs/notes/indexes/slice-index.md';

const ledger = JSON.parse(readFileSync(LEDGER, 'utf8'));
let md = '# Slice Index\n\n';
for (const step of ledger.steps || []) {
  md += `## ${step.name}\n`;
  for (const s of step.slices || []) {
    md += `- ${s.id} — ${s.title || ''} (${s.status || 'todo'})\n`;
  }
  md += '\n';
}
mkdirSync('specs/notes/indexes', { recursive: true });
writeFileSync(OUT, md);
console.log('Index updated at', OUT);
