// WEB-038 production verification driver.
//
// Run after the release reaches https://www.finspeed.online:
//   node specs/proofs/web/WEB-038/production-check.mjs
//
// Uses the Playwright dependency installed in apps/web. Read-only and
// privacy-preserving: raw HTML checks use plain HTTPS requests; the single
// browser journey declines nothing and stores nothing (fresh context, no
// consent interaction is required to reach the locator UI).
//
// Checks:
//   1. Server-delivered titles differ per route and match the shared map.
//   2. An unknown path returns HTTP 404 with the not-found title.
//   3. /dealers renders the dealer locator (search form, service filters,
//      map pins, two location cards) — the corrected WEB-037 dealers check
//      (the old driver required the literal word "dealer" in body text, which
//      the redesigned locator copy legitimately never contains).
//
// Results land in production-results.json and screenshots/ next to this file.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.WEB038_BASE || 'https://www.finspeed.online';
const HERE = dirname(fileURLToPath(import.meta.url));
const results = { base: BASE, executed: new Date().toISOString(), checks: [] };

function record(name, ok, detail = '') {
  results.checks.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

const titleOf = (html) => /<title>([^<]*)<\/title>/.exec(html)?.[1];

const titleCases = [
  ['/', 'Finspeed — Ride Beyond Boundaries'],
  ['/dealers', 'Finspeed — Dealers'],
  ['/blog', 'Finspeed — Journal'],
  ['/shop', 'Finspeed — Shop'],
  ['/stores', 'Finspeed — Stores'],
  ['/products/bull-shark', 'Finspeed — Bull Shark'],
];

for (const [path, expected] of titleCases) {
  const response = await fetch(`${BASE}${path}`, { redirect: 'follow' });
  const html = await response.text();
  const title = titleOf(html);
  record(`title ${path}`, response.status === 200 && title === expected,
    `status=${response.status} title=${JSON.stringify(title)}`);
}

{
  const response = await fetch(`${BASE}/definitely-not-a-route`);
  const html = await response.text();
  record('unknown path returns 404 with not-found title',
    response.status === 404 && titleOf(html) === 'Finspeed — Page not found',
    `status=${response.status} title=${JSON.stringify(titleOf(html))}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/dealers`, { waitUntil: 'networkidle', timeout: 45000 });
record('locator search form visible',
  await page.getByLabel('Location, area or PIN code').isVisible().catch(() => false));
record('locator service filters visible',
  await page.getByRole('button', { name: 'Test rides' }).isVisible().catch(() => false));
record('locator renders two location cards',
  await page.getByTestId('dealer-card').count() === 2,
  `count=${await page.getByTestId('dealer-card').count()}`);
record('locator map renders two pins',
  await page.locator('[data-testid="dealer-map"] button').count() === 2);
mkdirSync(join(HERE, 'screenshots'), { recursive: true });
await page.locator('.editorial-dealer-search').scrollIntoViewIfNeeded().catch(() => {});
await page.screenshot({ path: join(HERE, 'screenshots', 'dealers-locator-production.png'), fullPage: false });
await browser.close();

const failed = results.checks.filter((check) => !check.ok).length;
results.summary = `${results.checks.length - failed}/${results.checks.length} pass`;
writeFileSync(join(HERE, 'production-results.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(`RESULT: ${failed === 0 ? 'PASS' : 'FAIL'} — ${results.summary}`);
process.exit(failed === 0 ? 0 : 1);
