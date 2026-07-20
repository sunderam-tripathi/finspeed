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
    const hero = page.locator('.store-trail-background');
    await expect(hero).toHaveCount(1);
    await expect(hero).toBeVisible();
    await expect(hero.locator('img')).toHaveAttribute('src', '/assets/campaign/light-summit-hero.webp');
    await expect(hero.locator('img')).toHaveAttribute(
      'srcset',
      '/assets/campaign/light-summit-hero-1440.webp 1440w, /assets/campaign/light-summit-hero.webp 2880w',
    );

    const lightTerrainSources = await page.locator('.store-terrain-link > img').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src')),
    );
    expect(lightTerrainSources).toEqual([
      '/assets/campaign/light-terrain-mountain.webp',
      '/assets/campaign/light-terrain-city.webp',
      '/assets/campaign/light-terrain-hybrid.webp',
    ]);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileCurrentSource = await page.locator('.store-trail-background img').evaluate(
      (image: HTMLImageElement) => new URL(image.currentSrc).pathname,
    );
    expect(mobileCurrentSource).toBe('/assets/campaign/light-summit-hero-mobile-720.webp');

    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(hero).toHaveCount(1);
    await expect(hero.locator('img')).toHaveAttribute('src', '/assets/campaign/quiet-summit-hero.webp');
  });

  test('catalog and product detail use responsive upscaled product imagery', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/shop');

    const firstProduct = page.locator('.range-feature__image img').first();
    await expect(firstProduct).toHaveAttribute('src', '/assets/products/upscaled/mako-shark-1600.webp');
    await expect(firstProduct).toHaveAttribute(
      'srcset',
      '/assets/products/upscaled/mako-shark-480.webp 480w, /assets/products/upscaled/mako-shark-960.webp 960w, /assets/products/upscaled/mako-shark-1600.webp 1600w',
    );

    await page.goto('/products/bull-shark');
    const productHero = page.locator('.store-product-gallery img');
    await expect(productHero).toHaveAttribute('src', '/assets/products/upscaled/bull-shark-1600.webp');
    await expect(productHero).toHaveJSProperty('complete', true);
    expect(await productHero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(640);
  });

  test('header theme control exposes both campaign treatments', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const toggle = page.getByRole('button', { name: 'Switch to dark theme' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
    await expect(page.locator('.store-trail-background')).toHaveCount(1);
    await expect(page.locator('.store-trail-background img')).toHaveAttribute('src', '/assets/campaign/quiet-summit-hero.webp');
  });

  test('primary CTA opens the redesigned catalog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Find your ride' }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole('heading', { level: 1, name: 'The Signature Range' })).toBeVisible();
  });

  test('shared header geometry remains stable between home and catalog', async ({ page }) => {
    const readGeometry = async () => {
      await page.locator('.editorial-brand__wordmark').waitFor();
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
          brand: metric('.editorial-brand'),
          logo: metric('.editorial-brand__mark'),
          name: metric('.editorial-brand__wordmark'),
          actions: metric('.editorial-header__actions'),
          action: metric('.editorial-icon-button'),
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
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const centerDelta = await page.locator('.editorial-brand').evaluate((brand) => {
        const logo = brand.querySelector('.editorial-brand__mark') as HTMLImageElement;
        const name = brand.querySelector('.editorial-brand__wordmark') as HTMLImageElement;
        const logoRect = logo.getBoundingClientRect();
        const nameRect = name.getBoundingClientRect();
        const logoCenter = logoRect.top + logoRect.height / 2;
        const nameCenter = nameRect.top + nameRect.height / 2;
        return Math.round((logoCenter - nameCenter) * 100) / 100;
      });

      expect(Math.abs(centerDelta)).toBeLessThanOrEqual(3);
    }
  });

  test('shared header visual treatment remains stable across storefront routes', async ({ page }) => {
    const readTreatment = async () => page.locator('.store-header').evaluate((header) => {
      const headerStyle = getComputedStyle(header);
      return {
        className: header.className,
        header: {
          backgroundColor: headerStyle.backgroundColor,
          borderBottomColor: headerStyle.borderBottomColor,
        },
        logoSource: (header.querySelector('.editorial-brand__mark') as HTMLImageElement).getAttribute('src'),
        wordmarkSource: (header.querySelector('.editorial-brand__wordmark') as HTMLImageElement).getAttribute('src'),
        actionColor: getComputedStyle(header.querySelector('.editorial-icon-button') as HTMLElement).color,
      };
    });

    const assertRouteTreatment = async (expected: ReturnType<typeof readTreatment> extends Promise<infer T> ? T : never) => {
      for (const route of ['/shop', '/build', '/products/mako-shark', '/engineering']) {
        await page.goto(route);
        expect(await readTreatment()).toEqual(expected);
      }
    };

    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      if (await page.locator('html').getAttribute('data-theme') === 'dark') {
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
        await page.getByRole('button', { name: 'Switch to light theme' }).click();
        await page.getByRole('button', { name: 'Close', exact: true }).click();
      }
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect(page.locator('.editorial-icon-button').first()).toHaveCSS('color', 'rgb(16, 18, 21)');

      const light = await readTreatment();
      expect(light.className).toContain('editorial-header--light');
      expect(light.logoSource).toBe('/assets/logos/finspeed-mark.png');
      expect(light.wordmarkSource).toBe('/assets/logos/finspeed-wordmark-light.svg');
      expect(light.header.backgroundColor).toBe('rgba(248, 246, 242, 0.97)');
      expect(light.actionColor).toBe('rgb(16, 18, 21)');
      await assertRouteTreatment(light);

      await page.goto('/');
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('.editorial-icon-button').first()).toHaveCSS('color', 'rgb(247, 246, 242)');
      const dark = await readTreatment();
      expect(dark.className).toContain('editorial-header--dark');
      expect(dark.logoSource).toBe('/assets/logos/finspeed-mark-light.png');
      expect(dark.wordmarkSource).toBe('/assets/logos/finspeed-wordmark-dark.svg');
      expect(dark.header.backgroundColor).toBe('rgba(10, 14, 18, 0.97)');
      expect(dark.actionColor).toBe('rgb(247, 246, 242)');
      await assertRouteTreatment(dark);
    }
  });

  test('shared header controls retain their navigation routes', async ({ page }) => {
    await page.goto('/about');
    const header = page.getByRole('banner');

    await header.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: '01 The Bikes' }).click();
    await expect(page).toHaveURL(/\/shop$/);

    await header.getByRole('button', { name: 'Finspeed home' }).click();
    await expect(page).toHaveURL(/\/$/);

    await header.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/search$/);

    await header.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('dialog', { name: 'Finspeed menu' }).getByRole('button', { name: 'Account' }).click();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('editorial menu exposes the four premium journeys and closes with Escape', async ({ page }) => {
    await page.goto('/build');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();

    const menu = page.getByRole('dialog', { name: 'Finspeed menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: '01 The Bikes' })).toBeVisible();
    await expect(menu.getByRole('button', { name: '02 Build Your Ride' })).toHaveAttribute('aria-current', 'page');
    await expect(menu.getByRole('button', { name: '03 Our Engineering' })).toBeVisible();
    await expect(menu.getByRole('button', { name: '04 Visit Finspeed' })).toBeVisible();

    const menuBike = menu.getByRole('img', { name: 'Finspeed Mako Shark bicycle in profile' });
    await expect(menuBike).toHaveAttribute('src', '/assets/products/cutouts/mako-shark-side-transparent.png');
    await expect(menuBike).toHaveJSProperty('complete', true);
    const cornerAlpha = await menuBike.evaluate((image: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return [];
      context.drawImage(image, 0, 0);
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
      ];
      return corners.map(([x, y]) => context.getImageData(x, y, 1, 1).data[3]);
    });
    expect(cornerAlpha).toEqual([0, 0, 0, 0]);

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  test('editorial menu preserves its hovered journey while the pointer enters the feature pane', async ({ page }) => {
    await page.goto('/build');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();

    const menu = page.getByRole('dialog', { name: 'Finspeed menu' });
    const engineering = menu.getByRole('button', { name: '03 Our Engineering' });

    await engineering.hover();
    await expect(engineering).toHaveClass(/is-active/);
    await expect(menu.getByText('Built around the rider.')).toBeVisible();

    const itemBox = await engineering.boundingBox();
    const featureBox = await menu.locator('.editorial-menu__feature').boundingBox();
    expect(itemBox).not.toBeNull();
    expect(featureBox).not.toBeNull();

    const pointerY = itemBox!.y + itemBox!.height / 2;
    await page.mouse.move(itemBox!.x + itemBox!.width - 4, pointerY);
    await page.mouse.move(featureBox!.x + 120, pointerY, { steps: 24 });
    await page.waitForTimeout(180);

    await expect(engineering).toHaveClass(/is-active/);
    await expect(menu.getByText('Built around the rider.')).toBeVisible();
    await expect(menu.getByRole('img', { name: 'Finspeed Shark Blue performance bicycle' })).toBeVisible();
  });

  test('editorial menu keeps the complete product stage inside compressed desktop viewports', async ({ page }) => {
    for (const viewport of [
      { width: 1920, height: 1140 },
      { width: 1536, height: 912 },
      { width: 1280, height: 720 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Menu', exact: true }).click();

      const menu = page.getByRole('dialog', { name: 'Finspeed menu' });
      await expect(menu).toBeVisible();
      await page.waitForTimeout(450);

      const geometry = await menu.evaluate((element) => {
        const imageWell = element.querySelector('.editorial-menu__image-well');
        const image = imageWell?.querySelector('img');
        const owners = element.querySelector('.editorial-menu__owners');
        const primaryItems = [...element.querySelectorAll('.editorial-menu__item')];

        if (!imageWell || !image || !owners || primaryItems.length !== 4) return null;

        const box = (node: Element) => {
          const rect = node.getBoundingClientRect();
          return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          };
        };

        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          well: box(imageWell),
          image: box(image),
          owners: box(owners),
          items: primaryItems.map(box),
        };
      });

      expect(geometry).not.toBeNull();
      expect(geometry!.image.left).toBeGreaterThanOrEqual(geometry!.well.left - 1);
      expect(geometry!.image.right).toBeLessThanOrEqual(geometry!.well.right + 1);
      expect(geometry!.image.top).toBeGreaterThanOrEqual(geometry!.well.top - 1);
      expect(geometry!.image.bottom).toBeLessThanOrEqual(geometry!.well.bottom + 1);
      expect(geometry!.owners.bottom).toBeLessThanOrEqual(geometry!.viewport.height);
      expect(Math.max(...geometry!.items.map((item) => item.bottom))).toBeLessThanOrEqual(geometry!.viewport.height);

      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
    }
  });

  test('bespoke build advances through compatible component choices', async ({ page }) => {
    await page.goto('/build');
    await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '01 Base' })).toHaveAttribute('aria-selected', 'true');

    await page.getByRole('button', { name: 'Continue your build' }).click();
    await expect(page.getByRole('tab', { name: '02 Brakes' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: /Power Brakes/ })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Save configuration' }).click();
    await expect(page.getByRole('status')).toHaveText('Configuration saved on this device.');
  });

  test('build base selection updates the official product identity and persists it', async ({ page }) => {
    await page.goto('/build');
    await page.getByRole('button', { name: /Bull Shark 29-inch big-wheel geometry/ }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Bull Shark' })).toBeVisible();
    await expect(page.getByText('₹9,500', { exact: true })).toBeVisible();
    await expect(page.locator('.build-studio__price').getByText('29″ wheels', { exact: true })).toBeVisible();

    const image = page.locator('.build-studio__image-stage img');
    await expect(image).toHaveAttribute('src', '/assets/products/upscaled/bull-shark-1600.webp');
    await expect(image).toHaveAttribute('alt', 'Finspeed Bull Shark bicycle in side profile');

    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Bull Shark' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Bull Shark 29-inch big-wheel geometry/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(image).toHaveAttribute('src', '/assets/products/upscaled/bull-shark-1600.webp');
  });

  test('build tabs use roving focus and support arrow, Home, and End keys', async ({ page }) => {
    await page.goto('/build');

    const base = page.getByRole('tab', { name: '01 Base' });
    const brakes = page.getByRole('tab', { name: '02 Brakes' });
    const finish = page.getByRole('tab', { name: '05 Finish' });

    await expect(base).toHaveAttribute('tabindex', '0');
    await expect(brakes).toHaveAttribute('tabindex', '-1');
    await base.focus();
    await page.keyboard.press('ArrowRight');
    await expect(brakes).toBeFocused();
    await expect(brakes).toHaveAttribute('aria-selected', 'true');
    await expect(brakes).toHaveAttribute('tabindex', '0');
    await expect(base).toHaveAttribute('tabindex', '-1');
    await expect(brakes).toHaveAttribute('aria-controls', 'build-step-panel');
    await expect(page.locator('#build-step-panel')).toHaveAttribute('aria-labelledby', 'build-step-tab-brakes');

    await page.keyboard.press('End');
    await expect(finish).toBeFocused();
    await expect(finish).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(base).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(finish).toBeFocused();
  });

  test('finish choice stays explicit and Finish your build opens a truthful review', async ({ page }) => {
    await page.goto('/build');
    const productImage = page.locator('.build-studio__image-stage img');
    await expect(productImage).toHaveAttribute('src', '/assets/products/upscaled/mako-shark-1600.webp');

    await page.getByRole('tab', { name: '05 Finish' }).click();
    await page.getByRole('button', { name: /Deep Graphite/ }).click();
    await expect(page.getByText('Selected finish: Deep Graphite. Official product photography is shown unchanged.')).toBeVisible();
    await expect(productImage).toHaveAttribute('src', '/assets/products/upscaled/mako-shark-1600.webp');

    await page.getByRole('button', { name: 'Finish your build' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Your Mako Shark build' })).toBeVisible();
    await expect(page.getByText('Mako Shark · 27.5″ wheels', { exact: true })).toBeVisible();
    await expect(page.getByText('Deep Graphite', { exact: true })).toBeVisible();
    await expect(page.getByText('Review total: ₹10,450. Your choices remain saved on this device.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit your build' })).toBeVisible();
  });

  test('build studio keeps the product image on one seamless porcelain canvas', async ({ page }) => {
    await page.setViewportSize({ width: 1486, height: 1059 });
    await page.goto('/build');

    const productImage = page.locator('.build-studio__image-stage img');
    await expect(productImage).toHaveAttribute('src', '/assets/products/upscaled/mako-shark-1600.webp');
    await expect(productImage).toHaveJSProperty('complete', true);

    const treatment = await page.locator('.build-studio').evaluate((studio) => {
      const controls = studio.querySelector('.build-studio__controls') as HTMLElement;
      const visual = studio.querySelector('.build-studio__visual') as HTMLElement;
      const stage = studio.querySelector('.build-studio__image-stage') as HTMLElement;
      const image = studio.querySelector('.build-studio__image-stage img') as HTMLImageElement;
      const detailStrip = document.querySelector('.build-detail-strip') as HTMLElement;
      const studioRect = studio.getBoundingClientRect();

      return {
        studioBackground: getComputedStyle(studio).backgroundImage,
        controlsBackground: getComputedStyle(controls).backgroundColor,
        visualBackground: getComputedStyle(visual).backgroundColor,
        stageBackground: getComputedStyle(stage).backgroundColor,
        imageBlendMode: getComputedStyle(image).mixBlendMode,
        imageNaturalWidth: image.naturalWidth,
        imageCurrentSource: new URL(image.currentSrc).pathname,
        studioTop: Math.round(studioRect.top),
        studioHeight: Math.round(studioRect.height),
        detailTop: Math.round(detailStrip.getBoundingClientRect().top),
      };
    });

    expect(treatment.studioBackground).toContain('linear-gradient');
    expect(treatment.studioBackground).toContain('rgb(247, 243, 239)');
    expect(treatment.studioBackground).toContain('rgb(241, 235, 230)');
    expect(treatment.controlsBackground).toBe('rgba(0, 0, 0, 0)');
    expect(treatment.visualBackground).toBe('rgba(0, 0, 0, 0)');
    expect(treatment.stageBackground).toBe('rgba(0, 0, 0, 0)');
    expect(treatment.imageBlendMode).toBe('multiply');
    expect([
      '/assets/products/upscaled/mako-shark-960.webp',
      '/assets/products/upscaled/mako-shark-1600.webp',
    ]).toContain(treatment.imageCurrentSource);
    expect(treatment.imageNaturalWidth).toBeGreaterThanOrEqual(900);
    expect(treatment.studioTop).toBe(92);
    expect(treatment.studioHeight).toBe(672);
    expect(treatment.detailTop).toBe(764);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileActionButtons = page.locator('.build-studio__actions .editorial-cta');
    await expect(mobileActionButtons).toHaveCount(2);
    const mobileActions = await mobileActionButtons.evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      }),
    );
    expect(mobileActions).toHaveLength(2);
    expect(mobileActions[0].left).toBeGreaterThanOrEqual(0);
    expect(mobileActions[0].right).toBeLessThanOrEqual(390);
    expect(mobileActions[1].left).toBeGreaterThanOrEqual(0);
    expect(mobileActions[1].right).toBeLessThanOrEqual(390);
    expect(mobileActions[1].top).toBeGreaterThanOrEqual(mobileActions[0].bottom);
  });

  test('build detail strip uses four distinct generated component studies', async ({ page }) => {
    await page.goto('/build');

    const detailImages = page.locator('.build-detail-card img');
    await expect(detailImages).toHaveCount(4);

    const sources = await detailImages.evaluateAll((images) => images.map((image) => image.getAttribute('src')));
    expect(sources).toEqual([
      '/assets/campaign/build-detail-brakes-ai.webp',
      '/assets/campaign/build-detail-suspension-ai.webp',
      '/assets/campaign/build-detail-drivetrain-ai.webp',
      '/assets/campaign/build-detail-frame-ai.webp',
    ]);
    expect(new Set(sources).size).toBe(4);

    await expect.poll(async () => detailImages.evaluateAll((images) => (
      images.every((image) => image.complete && image.naturalWidth >= 960)
    ))).toBe(true);
  });

  test('engineering journey tells a dedicated component story and routes its calls to action', async ({ page }) => {
    await page.goto('/engineering');

    await expect(page.getByRole('heading', { level: 1, name: 'Built like a predator.' })).toBeVisible();
    await expect(page.locator('.engineering-hero__media img')).toHaveAttribute('src', '/assets/campaign/mako-shark-hero-v4.webp');
    await expect(page.locator('.engineering-chapter')).toHaveCount(4);

    const chapterImages = page.locator('.engineering-chapter__media img');
    const chapterSources = await chapterImages.evaluateAll((images) => images.map((image) => image.getAttribute('src')));
    expect(chapterSources).toEqual([
      '/assets/campaign/build-detail-frame-ai.webp',
      '/assets/campaign/build-detail-brakes-ai.webp',
      '/assets/campaign/build-detail-suspension-ai.webp',
      '/assets/campaign/build-detail-drivetrain-ai.webp',
    ]);
    await expect.poll(async () => chapterImages.evaluateAll((images) => (
      images.every((image) => image.complete && image.naturalWidth >= 960)
    ))).toBe(true);

    await page.getByRole('button', { name: 'Explore the bikes' }).click();
    await expect(page).toHaveURL(/\/shop$/);

    await page.goto('/engineering');
    await page.getByRole('button', { name: 'Build your ride' }).first().click();
    await expect(page).toHaveURL(/\/build$/);

    await page.goto('/engineering');
    await page.locator('.engineering-configure').getByRole('button', { name: 'Visit Finspeed' }).click();
    await expect(page).toHaveURL(/\/stores$/);
  });

  test('shared header routes render without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    for (const route of ['/', '/shop', '/build', '/products/mako-shark', '/engineering']) {
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
