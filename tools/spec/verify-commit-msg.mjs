#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { loadActiveSlice, validateCommitMessage } from './lib/commit-message.js';

const msgFile = process.argv[2];
if (!msgFile || !existsSync(msgFile)) {
  console.error('verify-commit-msg: message file not found');
  process.exit(2);
}
const msg = readFileSync(msgFile, 'utf8');
const active = loadActiveSlice();
const result = validateCommitMessage(msg, {
  activeId: active && active.state === 'ACTIVE' ? active.id : null
});

if (!result.ok) {
  console.error(result.error?.message || 'Commit message invalid');
  process.exit(result.error?.code === 'active-id' ? 4 : 3);
}

console.log('Commit message OK');
process.exit(0);
