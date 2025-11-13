#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';

const STATE = 'specs/working-memory/parity-state.json';

const cmd = process.argv[2] || 'status';
if (cmd === 'ensure') {
  mkdirSync('specs/working-memory', { recursive: true });
  let state = { status: 'running', started_at: new Date().toISOString() };
  if (existsSync(STATE)) {
    try { state = JSON.parse(readFileSync(STATE, 'utf8')); } catch {}
    state.status = 'running';
    state.last_ensure = new Date().toISOString();
  }
  writeFileSync(STATE, JSON.stringify(state, null, 2));
  console.log('Parity stack ensured.');
  process.exit(0);
}
if (cmd === 'status') {
  if (!existsSync(STATE)) {
    console.log('Parity: not running');
  } else {
    console.log(readFileSync(STATE, 'utf8'));
  }
  process.exit(0);
}
console.log('Usage: parity-stack.mjs [ensure|status]');

