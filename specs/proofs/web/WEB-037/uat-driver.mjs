/**
 * WEB-037 production UAT driver.
 *
 * Read-only, privacy-preserving sweep of https://www.finspeed.online.
 * Records objective observations (checks, console errors, screenshots) into
 * uat-observations.json; UX/aesthetics scoring happens during human review of
 * the captures, not here.
 *
 * Run from apps/web so Playwright resolves (the canonical copy lives with the
 * proof bundle):
 *   cp ../../specs/proofs/web/WEB-037/uat-driver.mjs ./uat-tmp.mjs
 *   UAT_OUT=<abs proof dir> node ./uat-tmp.mjs && rm ./uat-tmp.mjs
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.UAT_BASE || 'https://www.finspeed.online';
const OUT = process.env.UAT_OUT;
if (!OUT) throw new Error('UAT_OUT is required');
const SHOTS = path.join(OUT, 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const results = { base: BASE, started: new Date().toISOString(), journeys: [] };

function journey(id, name) {
  const entry = { id, name, checks: [], consoleErrors: [], screenshots: [], notes: [] };
  results.journeys.push(entry);
  return entry;
}

function check(entry, name, ok, detail = '') {
  entry.checks.push({ name, ok: Boolean(ok), detail: String(detail).slice(0, 400) });
  console.log(`${ok ? 'ok ' : 'FAIL'} [${entry.id}] ${name}${detail ? ' — ' + String(detail).slice(0, 120) : ''}`);
}

function watchConsole(page, entry) {
  page.on('pageerror', (error) => entry.consoleErrors.push(`pageerror: ${error.message}`.slice(0, 300)));
  page.on('console', (message) => {
    if (message.type() === 'error') entry.consoleErrors.push(`console: ${message.text()}`.slice(0, 300));
  });
}

async function shot(page, entry, name) {
  const file = path.join(SHOTS, `${name}.png`);
  await page.screenshot({ path: file });
  entry.screenshots.push(`screenshots/${name}.png`);
}

async function noHorizontalScroll(page, entry, label) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.scrollingElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  check(entry, `${label}: no horizontal scroll`, metrics.scrollWidth <= metrics.innerWidth + 1,
    `scrollWidth=${metrics.scrollWidth} innerWidth=${metrics.innerWidth}`);
}

async function declineConsentIfPresent(page) {
  const decline = page.getByRole('button', { name: 'Decline' });
  if (await decline.isVisible({ timeout: 3000 }).catch(() => false)) {
    await decline.click();
    return true;
  }
  return false;
}

async function toDark(page) {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');
}

const browser = await chromium.launch();

// ---- 1. Consent fail-closed (fresh context, nothing clicked first) ----------
{
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();
  const entry = journey('consent', 'Consent fails closed and stored denial survives reload');
  watchConsole(page, entry);
  await page.goto(`${BASE}/dealers`, { waitUntil: 'networkidle', timeout: 45000 });
  const before = await page.evaluate(() => (Array.isArray(window.dataLayer) ? window.dataLayer.map((e) => JSON.stringify(e).slice(0, 160)) : null));
  const analyticsBefore = (before || []).filter((e) => !e.includes('gtm.js') && !e.includes('gtm.load') && !e.includes('gtm.dom') && !e.includes('consent'));
  check(entry, 'no analytics events before a consent decision', analyticsBefore.length === 0, `dataLayer=${JSON.stringify(before)}`);
  await shot(page, entry, 'consent-banner-dealers-desktop');
  const declined = await declineConsentIfPresent(page);
  check(entry, 'consent banner present and declinable', declined);
  const stored = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([k]) => /consent/i.test(k))));
  check(entry, 'denial persisted to storage', Object.keys(stored).length > 0, JSON.stringify(stored));
  await page.reload({ waitUntil: 'networkidle' });
  const bannerAgain = await page.getByRole('button', { name: 'Decline' }).isVisible({ timeout: 3000 }).catch(() => false);
  check(entry, 'banner does not reappear after stored denial', !bannerAgain);
  const after = await page.evaluate(() => (Array.isArray(window.dataLayer) ? window.dataLayer.map((e) => JSON.stringify(e).slice(0, 160)) : null));
  const analyticsAfter = (after || []).filter((e) => !e.includes('gtm.js') && !e.includes('gtm.load') && !e.includes('gtm.dom') && !e.includes('consent'));
  check(entry, 'stored denial keeps analytics silent after reload', analyticsAfter.length === 0, `dataLayer=${JSON.stringify(after)}`);
  await context.close();
}

// ---- 2. Desktop light sweep -------------------------------------------------
{
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 });
  await declineConsentIfPresent(page);

  // Home + first-time visitor
  {
    const entry = journey('home', 'Home orients a first-time visitor');
    watchConsole(page, entry);
    check(entry, 'primary CTA "Find your ride" visible', await page.getByRole('button', { name: 'Find your ride' }).isVisible().catch(() => false));
    await noHorizontalScroll(page, entry, 'home');
    await shot(page, entry, 'home-desktop-light');
  }

  // Editorial menu
  {
    const entry = journey('menu', 'Editorial menu exposes the four journeys');
    watchConsole(page, entry);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    for (const label of ['The Bikes', 'Build Your Ride', 'Our Engineering', 'Visit Finspeed']) {
      check(entry, `menu journey "${label}" present`, await page.getByText(label, { exact: false }).first().isVisible().catch(() => false));
    }
    await shot(page, entry, 'menu-open-desktop-light');
    await page.keyboard.press('Escape');
    check(entry, 'Escape closes the menu', await page.getByRole('button', { name: 'Find your ride' }).isVisible().catch(() => false));
  }

  // Keyboard basics
  {
    const entry = journey('keyboard', 'Keyboard reaches interactive elements with visible focus');
    watchConsole(page, entry);
    const chain = [];
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      chain.push(await page.evaluate(() => {
        const el = document.activeElement;
        return el ? `${el.tagName.toLowerCase()}${el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : ''}` : 'none';
      }));
    }
    check(entry, 'tab order reaches interactive elements', chain.some((t) => t.startsWith('button') || t.startsWith('a')), chain.join(' > '));
    await shot(page, entry, 'keyboard-focus-desktop-light');
  }

  // Catalog
  {
    const entry = journey('shop', 'Catalog presents governed product imagery');
    watchConsole(page, entry);
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' });
    const first = page.locator('.range-feature__image img').first();
    const src = await first.getAttribute('src').catch(() => null);
    check(entry, 'first product uses configurator v1 poster path', Boolean(src && src.includes('/assets/configurator/v1/')), src);
    check(entry, 'first product image decodes', (await first.evaluate((img) => img.naturalWidth).catch(() => 0)) >= 480);
    await noHorizontalScroll(page, entry, 'shop');
    await shot(page, entry, 'shop-desktop-light');
  }

  // Product detail (identity-conflict product shows governed stock poster)
  {
    const entry = journey('product-detail', 'Product detail uses the governed stock master');
    watchConsole(page, entry);
    await page.goto(`${BASE}/products/bull-shark`, { waitUntil: 'networkidle' });
    const hero = page.locator('.store-product-gallery img');
    const src = await hero.getAttribute('src').catch(() => null);
    check(entry, 'bull-shark hero is the stock poster', Boolean(src && src.includes('bull-shark-29-r01')), src);
    check(entry, 'hero image decodes', (await hero.evaluate((img) => img.naturalWidth).catch(() => 0)) >= 640);
    await shot(page, entry, 'product-bull-shark-desktop-light');
  }

  // Configurator stock path
  {
    const entry = journey('configurator-stock', 'Configurator resolves the verified catalog build');
    watchConsole(page, entry);
    await page.goto(`${BASE}/build`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.getByRole('heading', { level: 1, name: 'Mako Shark' }).waitFor({ timeout: 30000 }).catch(() => {});
    const preview = page.locator('.configurator-stage__bike');
    const defaultSrc = await preview.getAttribute('src').catch(() => null);
    check(entry, 'default preview is the governed Mako stock poster', Boolean(defaultSrc && defaultSrc.includes('mako-shark-27-5-geared-r01')), defaultSrc);
    check(entry, 'seven-stage progress rail present', (await page.getByRole('navigation', { name: 'Build progress' }).getByRole('button').count().catch(() => 0)) === 7);
    await shot(page, entry, 'build-default-desktop-light');

    const chooseRadio = async (pattern) => {
      const radio = page.getByRole('radio', { name: pattern }).first();
      const label = page.locator('label.configurator-option').filter({ has: radio }).first();
      await label.waitFor({ timeout: 10000 });
      await label.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await label.click();
    };
    try {
    await chooseRadio(/^City /);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await chooseRadio(/^Red Snapper /);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await chooseRadio(/^24-inch /);
    check(entry, 'Red Snapper 24-inch prices at ₹4,800', (await page.locator('.configurator-price strong').innerText().catch(() => '')).includes('4,800'));
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    check(entry, 'ride setup exposes six component radios', (await page.locator('.configurator-panel').getByRole('radio').count().catch(() => 0)) === 6);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await chooseRadio(/^IBC frame-mounted carrier /);
    const ibcSrc = await preview.getAttribute('src').catch(() => null);
    check(entry, 'IBC catalog state resolves the governed SKU poster', Boolean(ibcSrc && ibcSrc.includes('red-snapper-24-ibc-r01')), ibcSrc);
    check(entry, 'IBC build prices at ₹5,000', (await page.locator('.configurator-price strong').innerText().catch(() => '')).includes('5,000'));
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    check(entry, 'review reaches a purchasable verified build', await page.getByRole('button', { name: /Add .*build/ }).isVisible().catch(() => false));
    await shot(page, entry, 'build-review-stock-desktop-light');
    } catch (error) {
      check(entry, 'journey completed without driver error', false, error.message);
      await shot(page, entry, 'build-stock-driver-error');
    }
  }

  // Configurator custom path
  {
    const entry = journey('configurator-custom', 'Custom choices become an honest build request');
    watchConsole(page, entry);
    try {
      await page.getByRole('button', { name: 'Finish' }).click();
      const deepBlue = page.getByRole('radio', { name: /^Deep blue / }).first();
      const label = page.locator('label.configurator-option').filter({ has: deepBlue }).first();
      await label.waitFor({ timeout: 10000 });
      await label.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await label.click();
      await page.getByRole('button', { name: 'Review' }).click();
      check(entry, 'custom build shows request CTA instead of cart', await page.getByRole('button', { name: 'Request this build' }).isVisible().catch(() => false));
      check(entry, 'cart CTA absent for custom request', !(await page.getByRole('button', { name: /Add .*build/ }).isVisible().catch(() => false)));
      await shot(page, entry, 'build-review-custom-desktop-light');
    } catch (error) {
      check(entry, 'journey completed without driver error', false, error.message);
      await shot(page, entry, 'build-custom-driver-error');
    }
  }

  // Search
  {
    const entry = journey('search', 'Search returns catalog results');
    watchConsole(page, entry);
    await page.goto(`${BASE}/search?q=shark`, { waitUntil: 'networkidle' });
    await shot(page, entry, 'search-shark-desktop-light');
    check(entry, 'search page renders results region', (await page.locator('main').innerText().catch(() => '')).toLowerCase().includes('shark'));
  }

  // Distributor gate (WEB-036 live verification)
  {
    const entry = journey('distributor-gate', 'Distributor portal gates unauthenticated access');
    watchConsole(page, entry);
    for (const route of ['/distributor', '/distributor/price-list', '/distributor/orders']) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
      const url = page.url();
      check(entry, `${route} redirects to sign-in`, url.includes('/distributor/sign-in'), url);
    }
    const bodyText = (await page.locator('main').innerText().catch(() => '')).toLowerCase();
    check(entry, 'sign-in states credentials are not verified', bodyText.includes('not verified') || bodyText.includes('preview'));
    check(entry, 'no dealer pricing leaks before sign-in', !bodyText.includes('margin'));
    await shot(page, entry, 'distributor-sign-in-desktop-light');
  }

  // Content routes
  for (const [id, route, marker] of [
    ['dealers', '/dealers', 'dealer'],
    ['support', '/support', 'support'],
    ['brand-story', '/brand-story', 'finspeed'],
    ['testimonials', '/testimonials', ''],
    ['blog', '/blog', ''],
  ]) {
    const entry = journey(id, `${route} renders its journey`);
    watchConsole(page, entry);
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    const text = (await page.locator('main').innerText().catch(() => '')).toLowerCase();
    check(entry, `${route} renders content`, text.length > 200 && (!marker || text.includes(marker)), `chars=${text.length}`);
    await noHorizontalScroll(page, entry, id);
    await shot(page, entry, `${id}-desktop-light`);
  }

  // Dark theme
  {
    const entry = journey('dark-theme', 'Dark theme holds across home and configurator');
    watchConsole(page, entry);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await toDark(page);
    await shot(page, entry, 'home-desktop-dark');
    await page.goto(`${BASE}/build`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1, name: 'Mako Shark' }).waitFor({ timeout: 30000 }).catch(() => {});
    check(entry, 'dark theme persists across navigation', (await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'dark');
    const darkSrc = await page.locator('.configurator-stage__bike').getAttribute('src').catch(() => null);
    check(entry, 'dark preview uses the dark stock poster', Boolean(darkSrc && darkSrc.includes('/dark/') && darkSrc.includes('mako-shark-27-5-geared-r01')), darkSrc);
    await shot(page, entry, 'build-default-desktop-dark');
  }

  await context.close();
}

// ---- 3. Mobile pass ---------------------------------------------------------
{
  const context = await browser.newContext({ viewport: MOBILE });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 });
  await declineConsentIfPresent(page);

  for (const [id, route] of [['mobile-home', '/'], ['mobile-shop', '/shop'], ['mobile-build', '/build']]) {
    const entry = journey(id, `${route} at 390px`);
    watchConsole(page, entry);
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    if (route === '/build') await page.getByRole('heading', { level: 1, name: 'Mako Shark' }).waitFor({ timeout: 30000 }).catch(() => {});
    await noHorizontalScroll(page, entry, id);
    await shot(page, entry, `${id}-light`);
  }
  await context.close();
}

await browser.close();
results.finished = new Date().toISOString();
writeFileSync(path.join(OUT, 'uat-observations.json'), JSON.stringify(results, null, 2) + '\n');
const failed = results.journeys.flatMap((j) => j.checks.filter((c) => !c.ok).map((c) => `${j.id}: ${c.name}`));
console.log(`\nJourneys: ${results.journeys.length}; checks: ${results.journeys.reduce((n, j) => n + j.checks.length, 0)}; failed: ${failed.length}`);
for (const f of failed) console.log('FAILED:', f);
