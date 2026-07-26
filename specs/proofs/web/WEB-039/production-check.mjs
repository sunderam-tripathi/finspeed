// WEB-039 production verification driver.
//
// Run after the release reaches https://www.finspeed.online:
//   cd apps/web && cp ../../specs/proofs/web/WEB-039/production-check.mjs ./pc-tmp.mjs && node ./pc-tmp.mjs && rm ./pc-tmp.mjs
//
// Checks:
//   1. GET /api/distributor/portal without a session -> 401, no-store.
//   2. POST /api/distributor/session -> token; portal fetch -> 200 with dealer rows.
//   3. Every script chunk referenced by the served sign-in page is free of
//      portal-data sentinels (the exhaustive scan is the build-time unit test;
//      this confirms the deployed artefact).
//   4. Signed-in browser flow renders dealer pricing from the API (screenshot).
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.CHECK_BASE || 'https://www.finspeed.online';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const SENTINELS = ['AABCR1234F', 'INV-8967', 'TK-3421', 'Neha Verma'];
const results = [];
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail: String(detail).slice(0, 200) });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + String(detail).slice(0, 120) : ''}`);
};

// 1 + 2: API contract
{
  const bare = await fetch(`${BASE}/api/distributor/portal`);
  record('unauthenticated portal request returns 401', bare.status === 401, `status=${bare.status}`);
  record('401 response is no-store', (bare.headers.get('cache-control') || '').includes('no-store'));

  const session = await fetch(`${BASE}/api/distributor/session`, { method: 'POST' });
  const { token } = await session.json();
  record('session endpoint mints a token', session.status === 200 && typeof token === 'string');

  const portal = await fetch(`${BASE}/api/distributor/portal`, { headers: { Authorization: `Bearer ${token}` } });
  const payload = portal.status === 200 ? await portal.json() : null;
  record('token unlocks the portal dataset', Boolean(payload?.portal?.products?.some((row) => row.dp === 3300)), `status=${portal.status}`);
}

// 3: served chunks
{
  const html = await (await fetch(`${BASE}/distributor/sign-in`)).text();
  const scripts = [...new Set([...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]))];
  record('sign-in page references script chunks', scripts.length > 0, `count=${scripts.length}`);
  let dirty = [];
  for (const src of scripts) {
    const body = await (await fetch(`${BASE}${src}`)).text();
    for (const sentinel of SENTINELS) if (body.includes(sentinel)) dirty.push(`${src}:${sentinel}`);
  }
  record('served chunks are free of portal-data sentinels', dirty.length === 0, dirty.join(', '));
}

// 4: signed-in flow
{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => window.localStorage.setItem('finspeed-consent', 'denied'));
  await page.goto(`${BASE}/distributor/sign-in`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.getByLabel('Dealer ID or email').fill('ravi@ravistores.in');
  await page.getByLabel('Password').fill('preview');
  await page.getByRole('button', { name: 'Enter portal' }).click();
  await page.getByRole('button', { name: 'Price list' }).click();
  const priceVisible = await page.locator('th', { hasText: 'Distributor price' }).isVisible({ timeout: 20000 }).catch(() => false);
  const marginVisible = await page.getByText('37.9%').first().isVisible({ timeout: 10000 }).catch(() => false);
  record('signed-in price list renders API-served dealer pricing', priceVisible && marginVisible);
  await page.screenshot({ path: path.join(OUT, 'production-price-list.png') });
  await browser.close();
}

writeFileSync(path.join(OUT, 'production-results.json'), JSON.stringify({ base: BASE, when: new Date().toISOString(), results }, null, 2) + '\n');
const failed = results.filter((r) => !r.ok);
console.log(`\nRESULT: ${failed.length === 0 ? 'PASS' : 'FAIL'} — ${results.length - failed.length}/${results.length} pass`);
process.exit(failed.length === 0 ? 0 : 1);
