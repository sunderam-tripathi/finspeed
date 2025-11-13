#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

const ACTIVE_PATH = 'specs/working-memory/active-slice.json';

if (!existsSync(ACTIVE_PATH)) {
  console.log('ACTIVE: IDLE (no active-slice.json)');
  process.exit(0);
}

try {
  const data = JSON.parse(readFileSync(ACTIVE_PATH, 'utf8'));
  if (!data || data.state === 'IDLE' || !data.id) {
    console.log('ACTIVE: IDLE');
  } else {
    console.log(`ACTIVE: ${data.id} [domain=${data.domain || 'unknown'}]`);
    if (Array.isArray(data.allow)) {
      console.log(`ALLOW PATTERNS: ${data.allow.length}`);
    }
  }
} catch (err) {
  console.error('Failed to read active-slice.json:', err.message);
  process.exit(1);
}

// post-done test
// another post-done test
