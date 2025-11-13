#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const LEDGER = 'specs/project-progress/slice-ledger.json';
const OUT = 'specs/project-progress/progress-summary.json';

const ledger = JSON.parse(readFileSync(LEDGER, 'utf8'));
let total = 0, done = 0, inProgress = 0, todo = 0;
for (const step of ledger.steps || []) {
  for (const s of step.slices || []) {
    total++;
    if (s.status === 'done') done++; else if (s.status === 'in_progress') inProgress++; else todo++;
  }
}
const summary = { total, done, in_progress: inProgress, todo, generated_at: new Date().toISOString() };
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log('Progress summary updated at', OUT);

