// WEB-038 Amplify delivery-rule audit.
//
// Run with live AWS credentials (aws sso login first):
//   node specs/proofs/web/WEB-038/amplify-audit.mjs
//
// Captures the delivery-relevant configuration of the production Amplify app
// into amplify-rules.json next to this file. Environment variables and any
// other secret-bearing fields are stripped before anything is written
// (credential hygiene: secrets never enter the repo).

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ID = 'd2h8tz7elv2xy8';
const REGION = 'ap-south-1';
const HERE = dirname(fileURLToPath(import.meta.url));

function aws(args) {
  return JSON.parse(execFileSync('aws', [...args, '--region', REGION, '--output', 'json'], { encoding: 'utf8' }));
}

const app = aws(['amplify', 'get-app', '--app-id', APP_ID]).app;
const branch = aws(['amplify', 'get-branch', '--app-id', APP_ID, '--branch-name', 'main']).branch;

const audit = {
  captured: new Date().toISOString(),
  app: {
    appId: app.appId,
    name: app.name,
    platform: app.platform,
    defaultDomain: app.defaultDomain,
    customRules: app.customRules ?? null,
    customHeaders: app.customHeaders ?? null,
    enableBranchAutoBuild: app.enableBranchAutoBuild,
    buildSpecPresent: Boolean(app.buildSpec),
  },
  branchMain: {
    branchName: branch.branchName,
    framework: branch.framework,
    stage: branch.stage,
    enableAutoBuild: branch.enableAutoBuild,
    activeJobId: branch.activeJobId,
  },
  note: 'environmentVariables and buildSpec contents deliberately omitted (secret hygiene).',
};

writeFileSync(join(HERE, 'amplify-rules.json'), `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit, null, 2));
console.log('\nWrote amplify-rules.json');
if (!app.customRules || app.customRules.length === 0) {
  console.log('VERDICT: no custom rewrite/redirect rules configured on the app.');
} else {
  console.log('VERDICT: custom rules present — review each against the WEB-038 plan before touching anything.');
}
