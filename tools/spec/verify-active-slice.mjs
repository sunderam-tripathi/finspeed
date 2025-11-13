#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { minimatch } from 'minimatch';

const ACTIVE_PATH = 'specs/working-memory/active-slice.json';
const LEDGER_PATH = 'specs/project-progress/slice-ledger.json';

function inGitRepo() {
  try {
    const out = execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
    return out === 'true';
  } catch { return false; }
}

function getChangedFilesForMode() {
  if (!inGitRepo()) return [];
  const mode = process.env.VERIFY_MODE || '';
  try {
    if (mode === 'pre-commit') {
      const out = execSync('git diff --cached --name-only', { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
      return out.split(/\r?\n/).filter(Boolean);
    }
    if (mode === 'pre-push') {
      // Compare last commit range
      const out = execSync('git rev-parse HEAD^ && git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
      const [base, head] = out.split(/\r?\n/).filter(Boolean);
      const diff = execSync(`git diff --name-only ${base} ${head}`, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
      return diff.split(/\r?\n/).filter(Boolean);
    }
    // CI/default: compute against base ref if available
    const baseRef = process.env.GITHUB_BASE_REF || 'main';
    try { execSync('git fetch --no-tags --depth=1 origin ' + baseRef, { stdio: ['ignore','ignore','ignore'] }); } catch {}
    const mergeBase = execSync(`git merge-base HEAD origin/${baseRef}`, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
    const diff = execSync(`git diff --name-only ${mergeBase}..HEAD`, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
    return diff.split(/\r?\n/).filter(Boolean);
  } catch (e) {
    // Fallback: staged files
    try {
      const out = execSync('git diff --cached --name-only', { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
      return out.split(/\r?\n/).filter(Boolean);
    } catch {
      return [];
    }
  }
}

function main() {
  if (!existsSync(ACTIVE_PATH)) {
    console.error('Guard: missing active-slice.json');
    process.exit(1);
  }
  const active = JSON.parse(readFileSync(ACTIVE_PATH, 'utf8'));
  const files = getChangedFilesForMode();
  const defaults = [
    'specs/working-memory/**',
    'tmp/**',
    '.githooks/**'
  ];

  if (!active || active.state === 'IDLE' || !active.id) {
    // When IDLE, only allow working-memory and meta edits
    const allowed = defaults.concat([
      'AGENTS/**', 'specs/**', '.github/**', 'tools/**', 'package.json', 'package-lock.json', 'Makefile', '.gitignore'
    ]);
    const violations = files.filter(f => !allowed.some(p => minimatch(f, p)));
    if (violations.length) {
      console.error('Guard: Repository is IDLE. Disallowed changes detected:\n' + violations.join('\n'));
      process.exit(2);
    }
    console.log('Guard: IDLE — no violations');
    return;
  }

  // If slice is marked as done in ledger, restrict post-done changes to coordination/proof only
  let donePhase = false;
  try {
    const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
    for (const step of ledger.steps || []) {
      for (const s of step.slices || []) {
        if (s.id === active.id && s.status === 'done') donePhase = true;
      }
    }
  } catch {}

  const allow = Array.isArray(active.allow) ? active.allow.slice() : [];
  let allowed;
  if (donePhase) {
    const proofScope = `specs/proofs/${active.domain || '*'}/${active.id}/**`;
    allowed = [
      proofScope,
      'specs/notes/indexes/**',
      'specs/project-progress/**',
      `AGENTS/slices/${active.id}.md`,
      ...defaults
    ];
  } else {
    allowed = allow.concat(defaults);
  }
  const violations = files.filter(f => !allowed.some(p => minimatch(f, p)));
  if (violations.length) {
    console.error(`Guard: Slice ${active.id} scope violations:`);
    for (const v of violations) console.error(' - ' + v);
    process.exit(3);
  }
  console.log(`Guard: Slice ${active.id} — OK (${files.length} changed)`);
}

main();
