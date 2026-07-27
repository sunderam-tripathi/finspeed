// WEB-040 production verification driver.
//
// Run from apps/web (copy in, run, remove — see WEB-039 pattern):
//   CHECK_OUT=<proof dir> node ./pc-tmp.mjs [--state unconfigured|configured]
//
// Two-state verification:
//   unconfigured (post-merge, before the steward sets the secret):
//     session POST -> 503 with the honest not-configured error; sign-in page
//     shows the invited-access notice.
//   configured (after the steward sets DISTRIBUTOR_ACCESS_HASH + redeploy):
//     wrong passphrase -> 401 (API and UI inline error); portal dataset stays
//     401 without a token. The POSITIVE case — the real passphrase entering —
//     is confirmed by the steward in a browser and recorded in the proof
//     README; the passphrase is never given to automation.
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.CHECK_BASE || 'https://www.finspeed.online';
const OUT = process.env.CHECK_OUT || path.dirname(fileURLToPath(import.meta.url));
const state = process.argv.includes('--state')
  ? process.argv[process.argv.indexOf('--state') + 1]
  : 'configured';
const results = [];
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail: String(detail).slice(0, 200) });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + String(detail).slice(0, 120) : ''}`);
};

const post = (body) => fetch(`${BASE}/api/distributor/session`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

if (state === 'unconfigured') {
  const response = await post({ passphrase: 'anything' });
  const body = await response.json().catch(() => ({}));
  record('unconfigured deployment refuses sessions with 503', response.status === 503, `status=${response.status}`);
  record('503 carries the honest not-configured error', String(body.error || '').includes('not configured'), body.error);
} else {
  const wrong = await post({ passphrase: `definitely-wrong-${Math.random().toString(36).slice(2)}` });
  record('wrong passphrase is rejected with 401', wrong.status === 401, `status=${wrong.status}`);
  const bodiless = await fetch(`${BASE}/api/distributor/session`, { method: 'POST' });
  record('bodiless session request is rejected with 401', bodiless.status === 401, `status=${bodiless.status}`);
}

{
  const portal = await fetch(`${BASE}/api/distributor/portal`);
  record('portal dataset stays 401 without a token', portal.status === 401, `status=${portal.status}`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => window.localStorage.setItem('finspeed-consent', 'denied'));
  await page.goto(`${BASE}/distributor/sign-in`, { waitUntil: 'networkidle', timeout: 45000 });
  const notice = await page.getByText(/Access is limited to invited partners and the passphrase is verified/i)
    .waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
  record('sign-in shows the invited-access notice', notice);
  if (state === 'configured') {
    await page.getByLabel('Dealer ID or email').fill('probe@example.com');
    await page.getByLabel('Access passphrase').fill('definitely-wrong-passphrase');
    await page.getByRole('button', { name: 'Enter portal' }).click();
    const rejected = await page.getByRole('alert').waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
    record('UI rejects a wrong passphrase inline and stays signed out', rejected && page.url().includes('/distributor/sign-in'));
  }
  await page.screenshot({ path: path.join(OUT, `production-signin-${state}.png`) });
  await browser.close();
}

writeFileSync(path.join(OUT, `production-results-${state}.json`), JSON.stringify({ base: BASE, state, when: new Date().toISOString(), results }, null, 2) + '\n');
const failed = results.filter((r) => !r.ok);
console.log(`\nRESULT (${state}): ${failed.length === 0 ? 'PASS' : 'FAIL'} — ${results.length - failed.length}/${results.length} pass`);
process.exit(failed.length === 0 ? 0 : 1);
