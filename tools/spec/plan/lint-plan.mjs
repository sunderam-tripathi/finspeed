#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: lint-plan.mjs <path-to-plan.md>');
  process.exit(2);
}
if (!existsSync(path)) {
  console.error('Plan not found:', path);
  process.exit(2);
}
const text = readFileSync(path, 'utf8');
const required = ['# Plan', '## Steps', '## Execution Checklist'];
const missing = required.filter(k => !text.includes(k));
if (missing.length) {
  console.error('Plan lint failed. Missing sections:', missing.join(', '));
  process.exit(3);
}
console.log('Plan lint OK');

