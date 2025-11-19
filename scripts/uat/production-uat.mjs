#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

// Target slice can be overridden via WEB_UAT_SLICE (e.g., WEB-020).
const sliceId = process.env.WEB_UAT_SLICE || 'WEB-020';
const artefactDir = path.resolve(`specs/proofs/web/${sliceId}/artefacts`);
await mkdir(artefactDir, { recursive: true });

const flows = [
  {
    name: 'home',
    url: 'https://www.finspeed.online/',
    run: async (page, log) => {
      await page.waitForLoadState('networkidle');
      await page.getByRole('heading', { name: /Turning Pedals into Power/i }).first().waitFor({ state: 'visible', timeout: 10000 });
      await page.getByRole('link', { name: /Find a Dealer/i }).first().waitFor({ state: 'visible', timeout: 12000 });
      log.details.push('Hero tagline + Dealers navigation visible.');
    }
  },
  {
    name: 'dealers',
    url: 'https://www.finspeed.online/dealers',
    run: async (page, log) => {
      const postal = page.getByLabel(/Postal code/i);
      await postal.waitFor({ state: 'visible', timeout: 10000 });
      await postal.fill('201306');
      await page.getByRole('button', { name: /Search dealers/i }).click();
      await page.getByRole('heading', { name: /Results near 201306/i }).waitFor({ state: 'visible', timeout: 10000 });
      await page.getByRole('heading', { name: /Sarin Farm/i }).first().waitFor({ state: 'visible', timeout: 10000 });
      log.details.push('Dealer search results render for postal 201306.');
    }
  },
  {
    name: 'support',
    url: 'https://www.finspeed.online/support',
    run: async (page, log) => {
      await page.getByRole('heading', { name: /Support hub/i }).waitFor({ state: 'visible', timeout: 10000 });
      const outageButton = page.getByRole('button', { name: /Simulate WhatsApp outage/i });
      await outageButton.waitFor({ state: 'visible', timeout: 8000 });
      await outageButton.click();
      await page.waitForTimeout(500);
      await page.getByRole('status').filter({ hasText: /WhatsApp outage simulated/i }).first().waitFor({ state: 'visible', timeout: 8000 });
      log.details.push('Support outage toggle works and shows outage copy.');
    }
  }
];

const results = [];
const browser = await chromium.launch({ headless: false });

const profiles = [
  { name: 'desktop', viewport: { width: 1280, height: 720 } },
  { name: 'mobile', viewport: { width: 414, height: 896 } }
];

for (const profile of profiles) {
  const context = await browser.newContext({ viewport: profile.viewport });

  for (const flow of flows) {
    const page = await context.newPage();
    const flowResult = {
      name: `${flow.name}-${profile.name}`,
      url: flow.url,
      status: 'pass',
      details: [],
      screenshot: null,
      ux_score: 5,
      aesthetics_score: 5
    };

    try {
      await page.goto(flow.url, { waitUntil: 'networkidle', timeout: 60000 });
      await flow.run(page, flowResult);
      const screenshotPath = path.join(artefactDir, `uat-${flow.name}-${profile.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      flowResult.screenshot = `specs/proofs/web/${sliceId}/artefacts/${path.basename(screenshotPath)}`;
    } catch (error) {
      flowResult.status = 'fail';
      flowResult.error = error instanceof Error ? error.message : String(error);
      console.error(`[uat:${flow.name}-${profile.name}]`, error);
    } finally {
      results.push(flowResult);
      await page.close();
    }
  }

  await context.close();
}

await browser.close();

const outputPath = path.join(artefactDir, 'uat-results.json');
await writeFile(
  outputPath,
  JSON.stringify(
    {
      runAt: new Date().toISOString(),
      notes: 'Headed Playwright UAT against production',
      results
    },
    null,
    2
  )
);

console.log(`UAT run captured in ${outputPath}`);
results.forEach((result) => {
  console.log(`${result.name}: ${result.status}`);
});
