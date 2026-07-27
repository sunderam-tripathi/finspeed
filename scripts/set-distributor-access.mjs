// Steward tool: set the distributor portal access passphrase (WEB-040).
//
// Run this yourself — the passphrase is read from your terminal, hashed with
// scrypt, and only the hash leaves this process. Plaintext is never printed,
// logged, or sent anywhere.
//
//   node scripts/set-distributor-access.mjs            # print the hash + instructions
//   node scripts/set-distributor-access.mjs --apply    # merge-set it on the Amplify app via AWS CLI
//
// --apply requires an authenticated AWS CLI (`aws login`, per the release
// runbook) and MERGES the variable into the app's existing environment map —
// it fetches current variables first and never replaces or prints them.
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';

const APP_ID = 'd2h8tz7elv2xy8';
const REGION = 'ap-south-1';
const ENV_KEY = 'DISTRIBUTOR_ACCESS_HASH';
const [N, r, p] = [16384, 8, 1];

function ask(question, { hidden } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  if (hidden) {
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(question); };
  }
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(answer); }));
}

const passphrase = await ask('New access passphrase (min 12 chars, input hidden): ', { hidden: true });
if (!passphrase || passphrase.length < 12) {
  console.error('Refusing: passphrase must be at least 12 characters.');
  process.exit(1);
}
const confirm = await ask('Repeat it: ', { hidden: true });
if (confirm !== passphrase) {
  console.error('Refusing: passphrases did not match.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(passphrase, salt, 32, { N, r, p });
const value = `scrypt$${N}$${r}$${p}$${salt.toString('base64url')}$${hash.toString('base64url')}`;

if (!process.argv.includes('--apply')) {
  console.log('\nHash value (safe to store as an environment variable):\n');
  console.log(`${ENV_KEY}=${value}`);
  console.log('\nSet it on the Amplify app (merge — do not replace the existing map):');
  console.log(`  node scripts/set-distributor-access.mjs --apply`);
  console.log('or in the Amplify console: App settings -> Environment variables.');
  console.log('A new build is required for the runtime to pick it up (Amplify -> Redeploy this version).');
  process.exit(0);
}

console.log('\nFetching current Amplify environment variable KEYS (values are never printed)…');
const app = JSON.parse(execFileSync('aws', ['amplify', 'get-app', '--app-id', APP_ID, '--region', REGION], { encoding: 'utf8' }));
const current = app.app.environmentVariables || {};
console.log('existing keys:', Object.keys(current).join(', ') || '(none)');
const merged = { ...current, [ENV_KEY]: value };
const args = ['amplify', 'update-app', '--app-id', APP_ID, '--region', REGION, '--environment-variables'];
const kv = Object.entries(merged).map(([k, v]) => `${k}=${v}`).join(',');
execFileSync('aws', [...args, kv], { stdio: ['ignore', 'ignore', 'inherit'] });
console.log(`${ENV_KEY} merged onto app ${APP_ID}. Trigger a redeploy so the runtime picks it up.`);
