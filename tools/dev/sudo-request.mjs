#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const QUEUE = 'specs/working-memory/sudo-queue.json';
mkdirSync('specs/working-memory', { recursive: true });
mkdirSync('tmp/sudo-requests', { recursive: true });

let ledger = { requests: [] };
if (existsSync(QUEUE)) {
  try { ledger = JSON.parse(readFileSync(QUEUE, 'utf8')); } catch {}
}

const [mode, ...rest] = process.argv.slice(2);
if (mode === 'request') {
  const cmdIdx = rest.indexOf('--command');
  const reasonIdx = rest.indexOf('--reason');
  if (cmdIdx === -1 || reasonIdx === -1) {
    console.error('Usage: sudo-request.mjs request --command "<cmd>" --reason "<why>"');
    process.exit(2);
  }
  const command = rest[cmdIdx + 1];
  const reason = rest[reasonIdx + 1];
  const id = 'SR-' + Date.now();
  const scriptPath = `tmp/sudo-requests/${id}.sh`;
  writeFileSync(scriptPath, `#!/usr/bin/env bash\nset -euo pipefail\n${command}\n`);
  ledger.requests.push({ id, command, reason, scriptPath, status: 'pending', requested_at: new Date().toISOString() });
  writeFileSync(QUEUE, JSON.stringify(ledger, null, 2));
  console.log('Queued sudo request', id, 'script:', scriptPath);
  process.exit(0);
}
if (mode === 'ack') {
  const idIdx = rest.indexOf('--id');
  const notesIdx = rest.indexOf('--notes');
  if (idIdx === -1) {
    console.error('Usage: sudo-request.mjs ack --id <ID> [--notes "..."]');
    process.exit(2);
  }
  const id = rest[idIdx + 1];
  const notes = notesIdx !== -1 ? rest[notesIdx + 1] : '';
  const req = ledger.requests.find(r => r.id === id);
  if (!req) {
    console.error('No such request:', id);
    process.exit(3);
  }
  req.status = 'acknowledged';
  req.notes = notes;
  req.acknowledged_at = new Date().toISOString();
  writeFileSync(QUEUE, JSON.stringify(ledger, null, 2));
  console.log('Acknowledged', id);
  process.exit(0);
}
console.log('Usage: sudo-request.mjs <request|ack> ...');

