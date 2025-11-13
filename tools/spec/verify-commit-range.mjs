#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { validateCommitMessage } from './lib/commit-message.js';

const args = process.argv.slice(2);
let base = null;
let head = null;
let messagesFile = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--base') base = args[++i];
  else if (a === '--head') head = args[++i];
  else if (a === '--messages-file') messagesFile = args[++i];
}

function inGitRepo() {
  try {
    const res = execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8' }).trim();
    return res === 'true';
  } catch {
    return false;
  }
}

function getMessagesFromGit(baseSha, headSha) {
  if (!inGitRepo()) {
    throw new Error('Not inside a git repository and no --messages-file provided');
  }
  if (!headSha) {
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    headSha = sha;
  }
  if (!baseSha) {
    baseSha = execSync(`git rev-parse ${headSha}^`, { encoding: 'utf8' }).trim();
  }
  const list = execSync(`git rev-list ${baseSha}..${headSha}`, { encoding: 'utf8' }).trim();
  if (!list) return [];
  const commits = list.split(/\r?\n/).filter(Boolean);
  return commits.map(sha => {
    const subject = execSync(`git log --format=%B -n 1 ${sha}`, { encoding: 'utf8' });
    return { sha, message: subject };
  });
}

function getMessagesFromFile(path) {
  if (!existsSync(path)) throw new Error('messages file not found: ' + path);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  return data.map((entry, idx) => ({ sha: entry.sha || `sample-${idx + 1}`, message: entry.message || entry }));
}

let entries;
if (messagesFile) {
  entries = getMessagesFromFile(messagesFile);
} else {
  entries = getMessagesFromGit(base, head);
}

if (!entries || entries.length === 0) {
  console.log('No commits to verify');
  process.exit(0);
}

let failures = 0;
for (const entry of entries) {
  const result = validateCommitMessage(entry.message, { requireIdPattern: true });
  if (!result.ok) {
    failures++;
    console.error(`Commit ${entry.sha}: ${result.error?.message}`);
  } else {
    console.log(`Commit ${entry.sha}: OK`);
  }
}

if (failures > 0) {
  console.error(`Commit message verification failed (${failures} commits).`);
  process.exit(5);
}
console.log('All commit messages look good');
