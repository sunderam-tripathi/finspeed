import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(repoRoot, 'specs', 'proofs', 'web', 'WEB-030', 'artefacts', 'after');
const logPath = path.join(repoRoot, 'specs', 'proofs', 'web', 'WEB-030', 'logs', 'theme-header-browser-proof.json');
const baseURL = process.env.WEB_BASE_URL || 'http://127.0.0.1:3100';
const routes = ['/', '/shop', '/products/mako-shark', '/about'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();
const proof = { baseURL, generatedAt: new Date().toISOString(), viewports: {}, consoleErrors: [] };

async function readHeader(page) {
  return page.locator('.store-header').evaluate((header) => {
    const rect = (selector) => {
      const element = header.querySelector(selector);
      const bounds = element.getBoundingClientRect();
      return {
        x: Math.round(bounds.x * 100) / 100,
        y: Math.round(bounds.y * 100) / 100,
        width: Math.round(bounds.width * 100) / 100,
        height: Math.round(bounds.height * 100) / 100,
      };
    };
    const color = (selector) => getComputedStyle(header.querySelector(selector)).color;
    const computed = getComputedStyle(header);
    return {
      className: header.className,
      backgroundColor: computed.backgroundColor,
      borderBottomColor: computed.borderBottomColor,
      header: rect('.store-header-main'),
      brand: rect('.store-brand'),
      mark: rect('.store-brand img'),
      wordmark: rect('.store-brand-name'),
      actions: rect('.store-header-actions'),
      logoSource: header.querySelector('.store-brand img').getAttribute('src'),
      wordmarkColor: color('.store-brand-name'),
      navigationColor: color('.store-primary-nav > button'),
      actionColor: color('.store-header-actions > button'),
    };
  });
}

async function waitForTheme(page, theme) {
  const expected = theme === 'dark'
    ? { nav: 'rgb(240, 244, 246)', action: 'rgb(255, 255, 255)' }
    : { nav: 'rgb(57, 66, 75)', action: 'rgb(10, 14, 18)' };
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await expect(page.locator('.store-primary-nav > button').first()).toHaveCSS('color', expected.nav);
  await expect(page.locator('.store-header-actions > button').first()).toHaveCSS('color', expected.action);
}

async function readOverflow(page) {
  return page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const header = document.querySelector('.store-header');
    const headerBounds = header.getBoundingClientRect();
    const offenders = [...document.querySelectorAll('body *')]
      .map((element) => ({ element, bounds: element.getBoundingClientRect() }))
      .filter(({ bounds }) => bounds.width > 0 && (bounds.right > clientWidth + 1 || bounds.left < -1))
      .slice(0, 12)
      .map(({ element, bounds }) => ({
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === 'string' ? element.className : '',
        left: Math.round(bounds.left * 100) / 100,
        right: Math.round(bounds.right * 100) / 100,
        width: Math.round(bounds.width * 100) / 100,
      }));
    return {
      clientWidth,
      scrollWidth,
      pageHasOverflow: scrollWidth > clientWidth,
      headerHasOverflow: header.scrollWidth > header.clientWidth || headerBounds.left < -1 || headerBounds.right > clientWidth + 1,
      offenders,
    };
  });
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    colorScheme: 'light',
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') proof.consoleErrors.push(`${viewport.name}: ${message.text()}`);
  });
  page.on('pageerror', (error) => proof.consoleErrors.push(`${viewport.name}: ${error.message}`));

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Ride Beyond Boundaries' }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  if (await page.locator('html').getAttribute('data-theme') === 'dark') {
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
  }
  await waitForTheme(page, 'light');

  const light = await readHeader(page);
  await page.screenshot({ path: path.join(outputDir, `theme-header-${viewport.name}-light.png`) });
  await page.locator('.store-header').screenshot({ path: path.join(outputDir, `theme-header-${viewport.name}-light-focused.png`) });

  const lightRoutes = {};
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.store-header').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await waitForTheme(page, 'light');
    lightRoutes[route] = { treatment: await readHeader(page), overflow: await readOverflow(page) };
  }

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await waitForTheme(page, 'dark');
  const dark = await readHeader(page);
  await page.screenshot({ path: path.join(outputDir, `theme-header-${viewport.name}-dark.png`) });
  await page.locator('.store-header').screenshot({ path: path.join(outputDir, `theme-header-${viewport.name}-dark-focused.png`) });

  const darkRoutes = {};
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.store-header').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await waitForTheme(page, 'dark');
    darkRoutes[route] = { treatment: await readHeader(page), overflow: await readOverflow(page) };
  }

  proof.viewports[viewport.name] = {
    viewport,
    light,
    dark,
    lightRoutes,
    darkRoutes,
    overflow: await readOverflow(page),
  };
  await context.close();
}

await browser.close();
await writeFile(logPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');

if (proof.consoleErrors.length > 0) {
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log(`Theme header proof written to ${path.relative(repoRoot, logPath)}`);
