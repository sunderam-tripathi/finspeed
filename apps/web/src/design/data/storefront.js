import {
  configuratorBasePrice,
  configuratorVisual,
  createDefaultBuild,
  resolveBuild,
} from './configurator.js';

// Finspeed storefront product catalogue.
export const products = [
  { id:'bull-shark', name:'Bull Shark', series:'Big Wheel Series', tag:'mountain', sub:'29" Terrain Dominator',
    price:configuratorBasePrice('bull-shark'), badge:'29 inch', wheels:'29"', speed:'21-Speed', brakes:'Disc',
    desc:'Built for rough trails and broken roads, with 29-inch wheels and wide tyres that roll steadily over uneven ground.',
    colors:['#2f7fb5','#9aa3ab'] },
  { id:'mako-shark', name:'Mako Shark', series:'Geared Elite', tag:'mountain', sub:'27.5" 21-Speed MTB',
    price:configuratorBasePrice('mako-shark'), badge:'Flagship', wheels:'27.5"', speed:'21-Speed', brakes:'Disc',
    desc:'Climb, descend and explore with confidence. Front suspension, disc brakes and 21 gears help you stay in control as the terrain changes.',
    colors:['#8fd9c4','#5a6570'] },
  { id:'tiger-shark', name:'Tiger Shark', series:'Tiger Series', tag:'mountain', sub:'Performance Hardtail',
    price:configuratorBasePrice('tiger-shark'), badge:null, wheels:'26"', speed:'Single', brakes:'Disc',
    desc:'A capable trail bike with wide tyres, front suspension and disc brakes for steady control on rough ground.',
    colors:['#e8853a','#5a6570'] },
  { id:'lemon-shark', name:'Lemon Shark', series:'Big Wheel Series', tag:'mountain', sub:'27.5" Performance Hardtail',
    price:configuratorBasePrice('lemon-shark'), badge:null, stock:3, wheels:'27.5"', speed:'Single', brakes:'Disc',
    desc:'Quick to handle and steady on rough roads, with 27.5-inch wheels and wide tyres for confident grip.',
    colors:['#b5c23a','#5a6570'] },
  { id:'great-white-shark', name:'Great White Shark', series:'Street Series', tag:'city', sub:'Grip & Presence',
    price:configuratorBasePrice('great-white-shark'), badge:null, stock:0, wheels:'26"', speed:'Single', brakes:'Power',
    desc:'A strong city bike with wide tyres for a planted, confident feel on busy and uneven streets.',
    colors:['#e8eef2','#cfd6dc'] },
  { id:'hammerhead', name:'Hammerhead', series:'Street Series', tag:'city', sub:'Urban Commute Specialist',
    price:configuratorBasePrice('hammerhead'), badge:null, wheels:'24"', speed:'Single', brakes:'Power',
    desc:'Tough, simple and dependable, made for daily commutes, errands and familiar roads.',
    colors:['#7c848c','#3a4651'] },
  { id:'lightning-marlin', name:'Lightning Marlin', series:'Hybrid Series', tag:'hybrid', sub:'700C Single Speed',
    price:configuratorBasePrice('lightning-marlin'), badge:'New', wheels:'700C', speed:'Single', brakes:'Disc',
    desc:'Quick on smooth roads, comfortable over rough patches and easy to ride every day.',
    colors:['#e8c93a','#5a6570'] },
  { id:'sunset-marlin', name:'Sunset Marlin', series:'Hybrid Series', tag:'hybrid', sub:'700C 21-Speed',
    price:configuratorBasePrice('sunset-marlin'), badge:'New', wheels:'700C', speed:'21-Speed', brakes:'Disc',
    desc:'Built for faster commutes and longer city rides, with 21 gears to make flyovers, starts and changing pace feel easier.',
    colors:['#e8623a','#5a6570'] },
  { id:'shark-blue', name:'Shark Blue', series:'Geared Elite', tag:'mountain', sub:'26" Geared All-Terrain',
    price:configuratorBasePrice('shark-blue'), badge:null, wheels:'26"', speed:'21-Speed', brakes:'Disc',
    desc:'A versatile 21-speed bike for rough roads and weekend trails, with front suspension and sturdy double-wall wheels.',
    colors:['#4a90d0','#9aa3ab'] },
  { id:'red-snapper', name:'Red Snapper', series:'Urban Series', tag:'city', sub:'Unisex City Commuter',
    price:configuratorBasePrice('red-snapper'), badge:'Best value', wheels:'24 / 26"', speed:'Single', brakes:'Power',
    desc:'An easy-to-ride city bike for daily commutes and errands, with simple braking and an optional rear carrier.',
    colors:['#b5302f','#3a4651'] },
  { id:'sea-breeze', name:'Sea Breeze', series:'Urban Series', tag:'city', sub:'Unisex City Cruiser',
    price:configuratorBasePrice('sea-breeze'), badge:null, wheels:'24 / 26"', speed:'Single', brakes:'Power',
    desc:'Easy to get on, comfortable to ride and ready for everyday errands with an optional rear carrier.',
    colors:['#2f9b96','#3a4651'] },
];
const PRODUCT_IMAGE_WIDTHS = [480, 960, 1600];
export const productImage = (id, width = 480) => `/assets/products/upscaled/${id}-${width}.webp`;
export const productImageSrcSet = (id) => PRODUCT_IMAGE_WIDTHS
  .map((width) => `${productImage(id, width)} ${width}w`)
  .join(', ');

const PRODUCT_VISUAL_TARGET = Object.freeze({ width: 84, height: 80, baseline: 88 });

function registeredVisual({ width, height, centerX, centerY, bottom, sourceLimited = false }) {
  const scale = Math.min(
    PRODUCT_VISUAL_TARGET.width / width,
    PRODUCT_VISUAL_TARGET.height / height,
  );
  return Object.freeze({
    subject: Object.freeze({ width, height, centerX, centerY, bottom }),
    scale: Number(scale.toFixed(3)),
    position: '50% 50%',
    baseline: PRODUCT_VISUAL_TARGET.baseline,
    origin: `${centerX}% ${bottom}%`,
    translateX: Number((50 - centerX).toFixed(2)),
    translateY: Number((PRODUCT_VISUAL_TARGET.baseline - bottom).toFixed(2)),
    renderedWidth: Number((width * scale).toFixed(2)),
    renderedHeight: Number((height * scale).toFixed(2)),
    sourceLimited,
  });
}

// Direct measurements of the actual resolver sources. Light bounds use the
// alpha subject; dark bounds use the lit subject against the edge-black field.
// Scaling is anchored at the measured product baseline, then translated to a
// shared 88% tyre line. This normalizes visible bicycle size without clipping
// or stretching the product pixels.
export const productVisualRegistration = Object.freeze({
  'bull-shark': Object.freeze({
    light: registeredVisual({ width: 83.8, height: 76.8, centerX: 49.9, centerY: 49.6, bottom: 87.9 }),
    dark: registeredVisual({ width: 88.0, height: 83.2, centerX: 49.8, centerY: 49.8, bottom: 91.3 }),
  }),
  'mako-shark': Object.freeze({
    light: registeredVisual({ width: 84.0, height: 77.6, centerX: 50.0, centerY: 49.2, bottom: 87.9 }),
    dark: registeredVisual({ width: 84.6, height: 74.2, centerX: 49.9, centerY: 50.9, bottom: 87.9 }),
  }),
  'tiger-shark': Object.freeze({
    light: registeredVisual({ width: 83.9, height: 76.6, centerX: 50.0, centerY: 49.7, bottom: 87.9 }),
    dark: registeredVisual({ width: 86.8, height: 83.9, centerX: 51.4, centerY: 53.3, bottom: 95.1 }),
  }),
  'lemon-shark': Object.freeze({
    light: registeredVisual({ width: 84.0, height: 74.8, centerX: 50.0, centerY: 50.6, bottom: 87.9 }),
    dark: registeredVisual({ width: 79.8, height: 69.8, centerX: 49.9, centerY: 57.3, bottom: 92.1 }),
  }),
  'great-white-shark': Object.freeze({
    light: registeredVisual({ width: 84.0, height: 76.0, centerX: 50.0, centerY: 50.0, bottom: 87.9 }),
    dark: registeredVisual({ width: 87.4, height: 77.5, centerX: 50.2, centerY: 51.5, bottom: 90.1 }),
  }),
  hammerhead: Object.freeze({
    light: registeredVisual({ width: 83.9, height: 79.9, centerX: 50.0, centerY: 48.0, bottom: 87.9 }),
    dark: registeredVisual({ width: 83.2, height: 85.6, centerX: 50.8, centerY: 54.7, bottom: 97.5 }),
  }),
  'lightning-marlin': Object.freeze({
    light: registeredVisual({ width: 84.0, height: 74.5, centerX: 50.0, centerY: 50.7, bottom: 87.9 }),
    dark: registeredVisual({ width: 80.3, height: 75.1, centerX: 49.9, centerY: 55.5, bottom: 93.0 }),
  }),
  'sunset-marlin': Object.freeze({
    light: registeredVisual({ width: 69.4, height: 81.0, centerX: 50.0, centerY: 47.5, bottom: 87.9, sourceLimited: true }),
    dark: registeredVisual({ width: 64.5, height: 73.1, centerX: 51.3, centerY: 52.4, bottom: 88.9, sourceLimited: true }),
  }),
  'shark-blue': Object.freeze({
    light: registeredVisual({ width: 84.0, height: 75.5, centerX: 50.0, centerY: 50.2, bottom: 87.9 }),
    dark: registeredVisual({ width: 90.4, height: 78.8, centerX: 48.6, centerY: 48.4, bottom: 87.7 }),
  }),
  'red-snapper': Object.freeze({
    light: registeredVisual({ width: 82.1, height: 85.3, centerX: 50.0, centerY: 50.4, bottom: 93.0 }),
    dark: registeredVisual({ width: 79.2, height: 83.7, centerX: 49.9, centerY: 51.8, bottom: 93.6 }),
  }),
  'sea-breeze': Object.freeze({
    light: registeredVisual({ width: 84.0, height: 77.8, centerX: 50.0, centerY: 49.1, bottom: 87.9 }),
    dark: registeredVisual({ width: 90.2, height: 83.4, centerX: 50.9, centerY: 47.5, bottom: 89.1 }),
  }),
});

const PRODUCT_IMAGE_ROLES = Object.freeze({
  feature: Object.freeze({ scale: 1, sizes: '(max-width: 900px) 100vw, 65vw' }),
  hero: Object.freeze({ scale: 1, sizes: '(max-width: 900px) 100vw, 60vw' }),
  related: Object.freeze({ scale: 1, sizes: '(max-width: 700px) 82vw, 31vw' }),
  search: Object.freeze({ scale: 1, sizes: '150px' }),
  engineering: Object.freeze({ scale: 1, sizes: '(max-width: 900px) 100vw, 58vw' }),
  menu: Object.freeze({ scale: 1, sizes: '(max-width: 900px) 100vw, 50vw' }),
});

// The storefront dark roles use complete, edge-black relights so their canvas
// disappears into the dark product stage. Four products have passed the v3
// accuracy review; the remaining governed relights stay on v2 until their own
// review is complete.
const DARK_STUDIO_IMAGE_BY_PRODUCT = Object.freeze({
  'bull-shark': '/assets/products/dark-studio-v2/bull-shark-studio.webp',
  'mako-shark': '/assets/products/dark-studio-v2/mako-shark-studio.webp',
  'tiger-shark': '/assets/products/dark-studio-v3/tiger-shark-studio-v3.webp',
  'lemon-shark': '/assets/products/dark-studio-v2/lemon-shark-studio.webp',
  'great-white-shark': '/assets/products/dark-studio-v2/great-white-shark-studio.webp',
  hammerhead: '/assets/products/dark-studio-v3/hammerhead-studio-v3.webp',
  'lightning-marlin': '/assets/products/dark-studio-v3/lightning-marlin-studio-v3.webp',
  'sunset-marlin': '/assets/products/dark-studio-v2/sunset-marlin-studio.webp',
  'shark-blue': '/assets/products/dark-studio-v2/shark-blue-studio.webp',
  'red-snapper': '/assets/products/dark-studio-v3/red-snapper-studio-v3.webp',
  'sea-breeze': '/assets/products/dark-studio-v2/sea-breeze-studio.webp',
});

function requestedProductWidth(width) {
  const numericWidth = Number(width);
  return PRODUCT_IMAGE_WIDTHS.reduce((nearest, candidate) => (
    Math.abs(candidate - numericWidth) < Math.abs(nearest - numericWidth) ? candidate : nearest
  ), PRODUCT_IMAGE_WIDTHS[0]);
}

function visualSourceAtWidth(src, width) {
  return src
    .replace(/-w(?:480|960|1600)\.webp$/, `-w${width}.webp`)
    .replace(/-(?:480|960|1600)\.webp$/, `-${width}.webp`);
}

/**
 * Resolve one canonical, theme-paired product visual for a specific UI role.
 * Light assets are transparent warm-stage registrations; dark assets are the
 * same registered product on the governed edge-black studio. No page-level
 * filters or synthetic exposure changes are needed.
 */
export function resolveProductImage(id, {
  theme = 'light',
  role = 'feature',
  width = 1600,
} = {}) {
  const product = products.find((item) => item.id === id) || products[0];
  const resolved = resolveBuild(createDefaultBuild({ modelId: product.id }));
  const canonical = configuratorVisual(resolved, theme);
  const themeKey = theme === 'dark' ? 'dark' : 'light';
  const registration = productVisualRegistration[product.id]?.[themeKey] || {
    scale: 1,
    position: '50% 50%',
    baseline: 88,
    origin: '50% 88%',
    translateX: 0,
    translateY: 0,
    renderedWidth: 84,
    renderedHeight: 80,
  };
  const roleRegistration = PRODUCT_IMAGE_ROLES[role] || PRODUCT_IMAGE_ROLES.feature;
  const scale = registration.scale * roleRegistration.scale;
  const selectedWidth = requestedProductWidth(width);
  const isDark = theme === 'dark';
  const darkStudioSrc = isDark ? DARK_STUDIO_IMAGE_BY_PRODUCT[product.id] : null;
  const src = darkStudioSrc || visualSourceAtWidth(canonical.src, selectedWidth);

  return {
    ...canonical,
    src,
    srcSet: darkStudioSrc ? undefined : canonical.srcSet,
    sizes: roleRegistration.sizes,
    registration: {
      ...registration,
      role,
      scale,
    },
    style: {
      '--product-visual-scale': String(scale),
      '--product-visual-position': registration.position,
      '--product-visual-baseline': `${registration.baseline}%`,
      '--product-visual-origin': registration.origin,
      '--product-visual-translate-x': `${registration.translateX}%`,
      '--product-visual-translate-y': `${registration.translateY}%`,
      objectPosition: registration.position,
      transformOrigin: registration.origin,
    },
    transform: `translate(${registration.translateX}%, ${registration.translateY}%) scale(${scale})`,
    commerce: {
      ready: resolved.commerceReady,
      status: resolved.commerceStatus,
      requiresConfirmation: resolved.identityConfirmationRequired,
      note: resolved.issues.find(({ severity }) => severity === 'critical')?.message || '',
    },
    layers: [{ id: 'base', role: 'base', src }],
  };
}

export function productCommerceState(id) {
  return resolveProductImage(id, { role: 'hero', width: 480 }).commerce;
}

// Backward-compatible helpers keep older consumers on the canonical resolver
// while newer screens can request an explicit role and optical metadata.
export const themedProductImage = (id, theme, width = 480) => (
  resolveProductImage(id, { theme, width }).src
);

export const themedProductImageSrcSet = (id, theme) => (
  resolveProductImage(id, { theme, width: 480 }).srcSet
);

// Cart storage supports both legacy product quantity entries and richer
// configured-build entries so existing local carts stay intact.
export function cartLines(items) {
  if (!items || typeof items !== 'object' || Array.isArray(items)) return [];
  return Object.entries(items).flatMap(([lineId, value]) => {
    const legacy = typeof value === 'number';
    const productId = legacy ? lineId : value?.productId;
    const product = products.find((item) => item.id === productId);
    const quantity = legacy ? value : Number(value?.quantity);
    if (!product || !Number.isFinite(quantity) || quantity <= 0) return [];
    return [{
      lineId,
      product,
      quantity,
      unitPrice: legacy || !Number.isFinite(value?.unitPrice) ? product.price : value.unitPrice,
      configuration: legacy ? null : value.configuration || null,
    }];
  });
}

// Signed-in rider profile + saved addresses (mock)
export const demoUser = {
  name:'Arjun Mehta', email:'arjun.mehta@email.com', phone:'+91 98765 43210', since:'Apr 2024',
};
export const addresses = [
  { id:'a1', label:'Home', name:'Arjun Mehta', line:'Flat 402, Lotus Residency, Sector 50', city:'Noida', state:'Uttar Pradesh', pin:'201301', phone:'+91 98765 43210', primary:true },
  { id:'a2', label:'Work', name:'Arjun Mehta', line:'7th Floor, Tower B, Stellar IT Park, Sector 62', city:'Noida', state:'Uttar Pradesh', pin:'201309', phone:'+91 98765 43210', primary:false },
];
// Order-tracking stages (index = current step)
export const trackingStages = ['Confirmed','Packed','Shipped','Out for delivery','Delivered'];
// Past orders (seeded so the account has history)
export const seedOrders = [
  { no:'FS482190', date:'02 Jun 2026', step:4, eta:'Delivered 06 Jun', items:[{id:'tiger-shark',qty:1}], total:6500 },
  { no:'FS476005', date:'21 May 2026', step:2, eta:'Arriving 27 Jun', items:[{id:'red-snapper',qty:1},{id:'sea-breeze',qty:1}], total:9600 },
];

// Verified Finspeed locations from the governed dealer-location handoff.
// Keep this list intentionally narrow: unverified marketplace listings do not
// belong in the customer-facing visit journey.
export const stores = [
  {
    id: 'sarin-farm',
    name: 'Finspeed Dealer - Sarin Farm',
    type: 'Sales, test rides and service',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    addr: 'Shop No. 20, Left Side, Sarin Farm Colony, UPSIDC Site A, Surajpur',
    pin: '201306',
  },
  {
    id: 'krystal-height',
    name: 'Finspeed Dealer - Krystal Height',
    type: 'Sales and service',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    addr: 'Lower Ground Shop No. 8, Krystal Height Market, behind ACE CITY, Sector 1, Noida Extension, Bisrakh Jalalpur',
    pin: '201306',
  },
];
