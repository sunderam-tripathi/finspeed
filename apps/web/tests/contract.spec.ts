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

  test('catalog and product detail use responsive canonical product imagery', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/shop');

    const firstProduct = page.locator('.range-feature__image img').first();
    await expect(firstProduct).toHaveAttribute(
      'src',
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    );
    await expect(firstProduct).toHaveAttribute(
      'srcset',
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w480.webp 480w, '
        + '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w960.webp 960w, '
        + '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp 1600w',
    );

    await page.goto('/products/bull-shark');
    const productHero = page.locator('.store-product-gallery img');
    await expect(productHero).toHaveAttribute(
      'src',
      '/assets/configurator/v1/bull-shark/side-r/light/poster/bull-shark-29-r01-w1600.webp',
    );
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
    await expect(page.getByRole('heading', { level: 1, name: 'Find your Finspeed' })).toBeVisible();
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
      await expect(page.locator('.editorial-icon-button').first()).toHaveCSS('color', 'rgb(247, 245, 241)');
      const dark = await readTreatment();
      expect(dark.className).toContain('editorial-header--dark');
      expect(dark.logoSource).toBe('/assets/logos/finspeed-mark-light.png');
      expect(dark.wordmarkSource).toBe('/assets/logos/finspeed-wordmark-dark.svg');
      expect(dark.header.backgroundColor).toBe('rgba(8, 10, 12, 0.96)');
      expect(dark.actionColor).toBe('rgb(247, 245, 241)');
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
    await expect(menuBike).toHaveAttribute(
      'src',
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    );
    await expect(menuBike).toHaveJSProperty('complete', true);
    expect(await menuBike.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(640);

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
        const primaryItems = [...element.querySelectorAll('.editorial-menu__item')];

        if (!imageWell || !image || primaryItems.length !== 4) return null;

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
          itemCount: primaryItems.length,
          horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
          dialogHorizontalOverflow: element.scrollWidth - element.clientWidth,
        };
      });

      expect(geometry).not.toBeNull();
      expect(geometry!.image.left).toBeGreaterThanOrEqual(geometry!.well.left - 1);
      expect(geometry!.image.right).toBeLessThanOrEqual(geometry!.well.right + 2);
      expect(geometry!.image.top).toBeGreaterThanOrEqual(geometry!.well.top - 1);
      expect(geometry!.image.bottom).toBeLessThanOrEqual(geometry!.well.bottom + 1);
      expect(geometry!.itemCount).toBe(4);
      expect(geometry!.horizontalOverflow).toBeLessThanOrEqual(1);
      expect(geometry!.dialogHorizontalOverflow).toBeLessThanOrEqual(1);

      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
    }
  });

  test('bespoke build exposes seven ordered stages and advances through the current flow', async ({ page }) => {
    await page.goto('/build');
    await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible();

    const progress = page.getByRole('navigation', { name: 'Build progress' });
    await expect(progress.getByRole('button')).toHaveText([
      'Ride',
      'Bicycle',
      'Fit',
      'Setup',
      'Finish',
      'Extras',
      'Review',
    ]);
    await expect(progress.getByRole('button', { name: 'Ride' })).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('.configurator-panel__header').getByRole('heading', { level: 2 })).toHaveText('Ride type');

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(progress.getByRole('button', { name: 'Bicycle' })).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('.configurator-panel__header').getByRole('heading', { level: 2 })).toHaveText('Choose bicycle');
  });

  test('build bicycle selection updates the official product identity and persists it', async ({ page }) => {
    await page.goto('/build');
    await page.getByRole('navigation', { name: 'Build progress' }).getByRole('button', { name: 'Bicycle' }).click();

    const bullShark = page.getByRole('radio', { name: /^Bull Shark / });
    await page.locator('label.configurator-option').filter({ has: bullShark }).click();
    await expect(bullShark).toBeChecked();
    await expect(page.getByRole('heading', { level: 1, name: 'Bull Shark' })).toBeVisible();
    await expect(page.locator('.configurator-price strong')).toHaveText('₹9,500');

    const image = page.locator('.configurator-stage__bike');
    await expect(image).toHaveAttribute(
      'src',
      '/assets/configurator/v1/bull-shark/side-r/light/poster/bull-shark-29-r01-w1600.webp',
    );
    await expect(image).toHaveAttribute('alt', /Finspeed Bull Shark.*29-inch/);

    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Bull Shark' })).toBeVisible();
    await page.getByRole('navigation', { name: 'Build progress' }).getByRole('button', { name: 'Bicycle' }).click();
    await expect(bullShark).toBeChecked();
    await expect(image).toHaveAttribute(
      'src',
      '/assets/configurator/v1/bull-shark/side-r/light/poster/bull-shark-29-r01-w1600.webp',
    );
  });

  test('build progress buttons expose and update the active step accessibly', async ({ page }) => {
    await page.goto('/build');

    const progress = page.getByRole('navigation', { name: 'Build progress' });
    const ride = progress.getByRole('button', { name: 'Ride' });
    const extras = progress.getByRole('button', { name: 'Extras' });

    await expect(ride).toHaveAttribute('aria-current', 'step');
    await extras.focus();
    await expect(extras).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(extras).toHaveAttribute('aria-current', 'step');
    await expect(ride).not.toHaveAttribute('aria-current', 'step');
    await expect(page.locator('.configurator-panel__header').getByRole('heading', { level: 2 })).toHaveText('Add-ons');
  });

  test('Review opens a truthful summary of the selected build', async ({ page }) => {
    await page.goto('/build');
    const productImage = page.locator('.configurator-stage__bike');
    await expect(productImage).toHaveAttribute(
      'src',
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    );

    await page.getByRole('navigation', { name: 'Build progress' }).getByRole('button', { name: 'Review' }).click();
    await expect(page.locator('.configurator-panel__header').getByRole('heading', { level: 2 })).toHaveText('Review');
    await expect(page.locator('.configurator-review')).toContainText('Mako Shark');
    await expect(page.locator('.configurator-review__total strong')).toHaveText('₹10,100');
    await expect(page.getByRole('button', { name: 'Add selected build' })).toBeVisible();
  });

  test('configurator keeps the selected bicycle contained across desktop and mobile canvases', async ({ page }) => {
    await page.setViewportSize({ width: 1486, height: 1059 });
    await page.goto('/build');

    const productImage = page.locator('.configurator-stage__bike');
    await expect(productImage).toHaveAttribute(
      'src',
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    );
    await expect(productImage).toHaveJSProperty('complete', true);

    const desktop = await page.locator('.configurator-shell').evaluate((layout) => {
      const controls = layout.querySelector('.configurator-controls') as HTMLElement;
      const stage = layout.querySelector('.configurator-stage') as HTMLElement;
      const frame = layout.querySelector('.configurator-stage__frame') as HTMLElement;
      const image = layout.querySelector('.configurator-stage__bike') as HTMLImageElement;
      const rect = (element: Element) => {
        const box = element.getBoundingClientRect();
        return { top: box.top, right: box.right, bottom: box.bottom, left: box.left };
      };
      return {
        controls: rect(controls),
        stage: rect(stage),
        frame: rect(frame),
        image: rect(image),
        naturalWidth: image.naturalWidth,
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });

    expect(desktop.stage.left).toBeGreaterThanOrEqual(desktop.controls.right - 1);
    expect(desktop.image.left).toBeGreaterThanOrEqual(desktop.frame.left - 1);
    expect(desktop.image.right).toBeLessThanOrEqual(desktop.frame.right + 1);
    expect(desktop.image.top).toBeGreaterThanOrEqual(desktop.frame.top - 1);
    expect(desktop.image.bottom).toBeLessThanOrEqual(desktop.frame.bottom + 1);
    expect(desktop.naturalWidth).toBeGreaterThanOrEqual(640);
    expect(desktop.horizontalOverflow).toBeLessThanOrEqual(1);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(productImage).toBeVisible();
    const mobile = await page.locator('.configurator-shell').evaluate((layout) => {
      const controls = layout.querySelector('.configurator-controls') as HTMLElement;
      const stage = layout.querySelector('.configurator-stage') as HTMLElement;
      const controlsBox = controls.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      return {
        controlsTop: controlsBox.top,
        stageTop: stageBox.top,
        stageBottom: stageBox.bottom,
        stageLeft: stageBox.left,
        stageRight: stageBox.right,
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    expect(mobile.stageBottom).toBeLessThanOrEqual(mobile.controlsTop + 1);
    expect(mobile.stageLeft).toBeGreaterThanOrEqual(0);
    expect(mobile.stageRight).toBeLessThanOrEqual(390);
    expect(mobile.horizontalOverflow).toBeLessThanOrEqual(1);
  });

  test('build detail strip uses four deliberate crops of the selected canonical product', async ({ page }) => {
    await page.goto('/build');

    const detailImages = page.locator('.build-detail-card img');
    await expect(detailImages).toHaveCount(4);

    const sources = await detailImages.evaluateAll((images) => images.map((image) => image.getAttribute('src')));
    expect(new Set(sources)).toEqual(new Set([
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    ]));
    const regions = await page.locator('.build-detail-card').evaluateAll((cards) => (
      cards.map((card) => card.getAttribute('data-region'))
    ));
    expect(regions).toEqual([
      'brakes',
      'suspension',
      'drivetrain',
      'frame',
    ]);

    const naturalWidths = await detailImages.evaluateAll(async (nodes) => Promise.all(
      (nodes as HTMLImageElement[]).map(async (image) => {
        await image.decode();
        return image.naturalWidth;
      }),
    ));
    expect(naturalWidths.every((width) => width > 0)).toBe(true);
  });

  test('engineering journey tells a dedicated component story and routes its calls to action', async ({ page }) => {
    await page.goto('/engineering');

    await expect(page.getByRole('heading', { level: 1, name: /Steady on rough roads\..*Confident in every turn\./ })).toBeVisible();
    await expect(page.locator('.engineering-hero__media img')).toHaveAttribute(
      'src',
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    );
    await expect(page.locator('.engineering-chapter')).toHaveCount(4);

    const chapterMedia = page.locator('.engineering-chapter__media');
    const chapterRegions = await chapterMedia.evaluateAll((items) => items.map((item) => item.getAttribute('data-region')));
    expect(chapterRegions).toEqual(['frame', 'brakes', 'suspension', 'drivetrain']);
    const chapterImages = chapterMedia.locator('img');
    const chapterSources = await chapterImages.evaluateAll((images) => images.map((image) => image.getAttribute('src')));
    expect(new Set(chapterSources)).toEqual(new Set([
      '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp',
    ]));
    await expect.poll(async () => chapterImages.evaluateAll((nodes) => (
      (nodes as HTMLImageElement[]).every((image) => image.complete && image.naturalWidth >= 640)
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
    await expect(footer.getByRole('link', { name: 'Warranty', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
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
