import { test, expect } from '@playwright/test';

const EN_HEADLINE = 'Ride Beyond Boundaries';

test.describe('SCN-001 site shell contract', () => {
  test('hero conveys brand promise and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: EN_HEADLINE })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'Find your ride' })).toBeVisible();
  });

  test('light homepage selects dedicated responsive campaign assets', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const lightHero = page.locator('.store-trail-background.store-theme-light-only');
    const darkHero = page.locator('.store-trail-background.store-theme-dark-only');
    await expect(lightHero).toBeVisible();
    await expect(darkHero).toBeHidden();
    await expect(lightHero.locator('img')).toHaveAttribute('src', '/assets/campaign/light-summit-hero.webp');

    const lightTerrainSources = await page.locator('.store-terrain-link > img.store-theme-light-only').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src')),
    );
    expect(lightTerrainSources).toEqual([
      '/assets/campaign/light-terrain-mountain.webp',
      '/assets/campaign/light-terrain-city.webp',
      '/assets/campaign/light-terrain-hybrid.webp',
    ]);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileCurrentSource = await page.locator('.store-trail-background.store-theme-light-only img').evaluate(
      (image: HTMLImageElement) => new URL(image.currentSrc).pathname,
    );
    expect(mobileCurrentSource).toBe('/assets/campaign/light-summit-hero-mobile.webp');

    await page.locator('html').evaluate((root) => {
      root.dataset.theme = 'dark';
    });
    await expect(lightHero).toBeHidden();
    await expect(darkHero).toBeVisible();
    await expect(darkHero.locator('img')).toHaveAttribute('src', '/assets/campaign/quiet-summit-hero.webp');
  });

  test('primary CTA opens the redesigned catalog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Find your ride' }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Shop all cycles' })).toBeVisible();
  });

  test('shared header geometry remains stable between home and catalog', async ({ page }) => {
    const readGeometry = async () => {
      await page.evaluate(() => document.fonts.ready);
      return page.locator('.store-header').evaluate((header) => {
        const metric = (selector: string) => {
          const element = header.querySelector(selector) as HTMLElement;
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            width: Math.round(rect.width * 100) / 100,
            height: Math.round(rect.height * 100) / 100,
            fontSize: style.fontSize,
            gap: style.gap,
          };
        };
        return {
          headerHeight: Math.round(header.getBoundingClientRect().height * 100) / 100,
          brand: metric('.store-brand'),
          logo: metric('.store-brand img'),
          name: metric('.store-brand-name'),
          nav: metric('.store-primary-nav'),
          actions: metric('.store-header-actions'),
          action: metric('.store-header-actions button'),
        };
      });
    };

    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const home = await readGeometry();
      await page.goto('/shop');
      const shop = await readGeometry();
      expect(shop).toEqual(home);
    }
  });

  test('brand mark and wordmark retain their optical alignment', async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900, expectedCenterDelta: -4 },
      { width: 390, height: 844, expectedCenterDelta: -1 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const centerDelta = await page.locator('.store-brand').evaluate((brand) => {
        const logo = brand.querySelector('img') as HTMLImageElement;
        const name = brand.querySelector('.store-brand-name') as HTMLElement;
        const logoRect = logo.getBoundingClientRect();
        const nameRect = name.getBoundingClientRect();
        const logoCenter = logoRect.top + logoRect.height / 2;
        const nameCenter = nameRect.top + nameRect.height / 2;
        return Math.round((logoCenter - nameCenter) * 100) / 100;
      });

      expect(centerDelta).toBe(viewport.expectedCenterDelta);
    }
  });

  test('shared header visual treatment remains stable across storefront routes', async ({ page }) => {
    const readTreatment = async () => page.locator('.store-header').evaluate((header) => {
      const style = (selector: string) => {
        const element = header.querySelector(selector) as HTMLElement;
        const computed = getComputedStyle(element);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          borderBottomColor: computed.borderBottomColor,
        };
      };
      const headerStyle = getComputedStyle(header);
      return {
        className: header.className,
        header: {
          backgroundColor: headerStyle.backgroundColor,
          borderBottomColor: headerStyle.borderBottomColor,
        },
        logoSource: (header.querySelector('.store-brand img') as HTMLImageElement).getAttribute('src'),
        wordmark: style('.store-brand-name'),
        navigation: style('.store-primary-nav > button'),
        action: style('.store-header-actions > button'),
      };
    });

    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const home = await readTreatment();
      for (const route of ['/shop', '/products/mako-shark', '/about']) {
        await page.goto(route);
        const treatment = await readTreatment();
        expect(treatment).toEqual(home);
        expect(treatment.className).toContain('store-header--dark');
        expect(treatment.logoSource).toBe('/assets/logos/finspeed-mark-light.png');
        expect(['rgba(2, 5, 8, 0.96)', 'rgb(2, 5, 8)']).toContain(treatment.header.backgroundColor);
        expect(treatment.wordmark.color).toBe('rgb(255, 255, 255)');
        expect(treatment.navigation.color).toBe('rgb(240, 244, 246)');
        expect(treatment.action.color).toBe('rgb(255, 255, 255)');
      }
    }
  });

  test('shared header controls retain their navigation routes', async ({ page }) => {
    await page.goto('/about');
    const header = page.getByRole('banner');

    await header.getByRole('navigation', { name: 'Store categories' }).getByRole('button', { name: 'Shop' }).click();
    await expect(page).toHaveURL(/\/shop$/);

    await header.getByRole('button', { name: 'Finspeed home' }).click();
    await expect(page).toHaveURL(/\/$/);

    await header.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/search$/);

    await header.getByRole('button', { name: 'Account' }).click();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('shared header routes render without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    for (const route of ['/', '/shop', '/products/mako-shark', '/about']) {
      await page.goto(route);
      await expect(page.getByRole('banner')).toBeVisible();
    }

    expect(errors).toEqual([]);
  });

  test('store locator remains available from the support footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('contentinfo').getByText('Find a store')).toBeVisible();
  });

  test('support footer exposes warranty and contact routes', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByText('Warranty')).toBeVisible();
    await expect(footer.getByText('Contact')).toBeVisible();
  });

  test('accept dismisses consent immediately and persists the choice', async ({ page }) => {
    await page.goto('/');
    const notice = page.getByRole('region', { name: 'Analytics consent notice' });
    await expect(notice).toBeVisible();
    await notice.getByRole('button', { name: 'Accept' }).click();
    await expect(notice).toBeHidden();
    await page.reload();
    await expect(notice).toBeHidden();
  });

  test('decline dismisses consent immediately and persists the choice', async ({ page }) => {
    await page.goto('/');
    const notice = page.getByRole('region', { name: 'Analytics consent notice' });
    await expect(notice).toBeVisible();
    await notice.getByRole('button', { name: 'Decline' }).click();
    await expect(notice).toBeHidden();
    await page.reload();
    await expect(notice).toBeHidden();
  });

  test('consent still dismisses when storage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function setItem(key: string, value: string) {
        if (key === 'finspeed-consent') throw new DOMException('Storage blocked', 'SecurityError');
        return originalSetItem.call(this, key, value);
      };
    });
    await page.goto('/');
    const notice = page.getByRole('region', { name: 'Analytics consent notice' });
    await notice.getByRole('button', { name: 'Accept' }).click();
    await expect(notice).toBeHidden();
  });
});
