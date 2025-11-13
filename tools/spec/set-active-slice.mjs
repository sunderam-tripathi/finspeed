#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ACTIVE_PATH = 'specs/working-memory/active-slice.json';
const LEDGER_PATH = 'specs/project-progress/slice-ledger.json';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { idle: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--idle') out.idle = true;
    else if (a === '--slice') out.slice = args[++i];
    else if (a === '--domain') out.domain = args[++i];
    else if (a === '--title') out.title = args[++i];
  }
  return out;
}

function findSlice(domain, id) {
  try {
    // Try to read domain spec for allow list
    const specPath = `specs/contracts/${domain}/json/spec.json`;
    const spec = JSON.parse(readFileSync(specPath, 'utf8'));
    const slice = (spec.slices || []).find(s => s.id === id);
    return slice || null;
  } catch {
    return null;
  }
}

function guessDomainFromLedger(id) {
  try {
    const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
    for (const step of ledger.steps || []) {
      for (const s of step.slices || []) {
        if (s.id === id) return s.domain || null;
      }
    }
  } catch {}
  return null;
}

const opts = parseArgs();

if (opts.idle) {
  writeFileSync(ACTIVE_PATH, JSON.stringify({ state: 'IDLE' }, null, 2));
  console.log('Set to IDLE');
  process.exit(0);
}

if (!opts.slice) {
  console.error('Usage: set-active-slice.mjs --slice <ID> [--domain <domain>] [--title <title>] | --idle');
  process.exit(2);
}

let domain = opts.domain || guessDomainFromLedger(opts.slice) || 'docs';
let title = opts.title || '';
let allow = [];

const found = findSlice(domain, opts.slice);
if (found) {
  title = title || found.title || '';
  if (Array.isArray(found.allow)) allow = found.allow;
}

// Fallback allow list if none from spec
if (allow.length === 0) {
  allow = [
    'AGENTS/**',
    'specs/**',
    '.github/**',
    'tools/**',
    'Makefile',
    '.gitignore',
    'package.json',
    'package-lock.json'
  ];
}

const payload = {
  state: 'ACTIVE',
  id: opts.slice,
  domain,
  title,
  allow
};

writeFileSync(ACTIVE_PATH, JSON.stringify(payload, null, 2));
console.log(`Activated slice ${opts.slice} [domain=${domain}]`);

