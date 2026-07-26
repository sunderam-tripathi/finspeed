import { products } from './data/storefront.js';

// Single source of truth for route naming, titles and descriptions. The design
// client (StorefrontApp) derives document.title from these maps after
// hydration, and the Next route pages export the same values as
// server-rendered metadata, so the two layers cannot drift.

export const routePaths = {
  home: '/',
  shop: '/shop',
  build: '/build',
  engineering: '/engineering',
  about: '/about',
  contact: '/contact',
  warranty: '/warranty',
  assembly: '/assembly',
  stores: '/stores',
  dealers: '/dealers',
  support: '/support',
  journal: '/blog',
  stories: '/testimonials',
  search: '/search',
  auth: '/sign-in',
  account: '/account',
  checkout: '/checkout',
};

export const routeTitleLabels = {
  home: 'Ride Beyond Boundaries',
  shop: 'Shop',
  build: 'Build your ride',
  engineering: 'Engineering',
  about: 'Our story',
  contact: 'Contact',
  warranty: 'Warranty',
  assembly: 'Assembly guide',
  stores: 'Stores',
  dealers: 'Dealers',
  support: 'Support',
  journal: 'Journal',
  stories: 'Rider stories',
  search: 'Search',
  auth: 'Sign in',
  account: 'Account',
  checkout: 'Checkout',
  product: 'Product',
  'not-found': 'Page not found',
};

export const categoryTitleLabels = {
  all: 'Signature range',
  mountain: 'Mountain bikes',
  city: 'City bikes',
  hybrid: 'Hybrid bikes',
};

export const DEFAULT_DESCRIPTION =
  'Finspeed performance bicycles and distributor ordering portal.';

const routeDescriptions = {
  home: DEFAULT_DESCRIPTION,
  shop: 'Shop the Finspeed range of mountain, city and hybrid bicycles.',
  build: 'Choose a Finspeed model and configure drivetrain, brakes, colour and accessories stage by stage.',
  engineering: 'How a Finspeed is engineered: the decisions beneath the paint.',
  about: 'The Finspeed story — performance cycles from Greater Noida, shipped to riders across India.',
  contact: 'Contact Finspeed by WhatsApp or email for products, fit and orders.',
  warranty: 'The Finspeed warranty summary.',
  assembly: 'Step-by-step assembly guidance for your Finspeed.',
  stores: 'Visit Finspeed in Greater Noida: two locations to meet the bikes in person.',
  dealers: 'Search Finspeed locations by name, area or PIN code and filter by sales, service and test rides.',
  support: 'Rider support for products, fit, orders and service.',
  journal: 'Stories, guides and updates from Finspeed.',
  stories: 'Rider stories from the Finspeed community.',
  search: 'Search Finspeed bicycles and pages.',
  'not-found': 'The page you are looking for does not exist.',
};

const privateRoutes = new Set(['auth', 'account', 'checkout']);

function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

export function productForPath(pathname) {
  const normalized = normalizePath(pathname);
  if (!normalized.startsWith('/products/')) return null;
  const id = decodeURIComponent(normalized.split('/').filter(Boolean).pop() || '');
  return products.find((product) => product.id === id) || null;
}

export function routeName(pathname) {
  const normalized = normalizePath(pathname);
  if (normalized.startsWith('/products/')) {
    return productForPath(normalized) ? 'product' : 'not-found';
  }
  const aliases = {
    '/catalog': 'shop',
    '/models': 'shop',
    '/brand-story': 'about',
  };
  return aliases[normalized] || Object.entries(routePaths).find(([, path]) => path === normalized)?.[0] || 'not-found';
}

export function pageTitle(label) {
  return `Finspeed — ${label.charAt(0).toUpperCase()}${label.slice(1)}`;
}

export function routeServerMetadata(routeId) {
  const label = routeTitleLabels[routeId] || routeTitleLabels['not-found'];
  const metadata = {
    title: pageTitle(label),
    description: routeDescriptions[routeId] || DEFAULT_DESCRIPTION,
  };
  if (privateRoutes.has(routeId)) metadata.robots = { index: false };
  return metadata;
}

// Metadata for a [...designPath] request, or null when the path is unknown to
// the design router and the server should respond 404.
export function designPathMetadata(designPath) {
  const segments = Array.isArray(designPath) ? designPath : [];
  if (segments[0] === 'distributor') {
    return {
      title: 'Finspeed Distributor',
      description: 'Finspeed distributor ordering portal.',
      robots: { index: false },
    };
  }
  const pathname = `/${segments.join('/')}`;
  const routeId = routeName(pathname);
  if (routeId === 'not-found') return null;
  if (routeId === 'product') {
    const product = productForPath(pathname);
    return {
      title: pageTitle(product.name),
      description: product.desc || DEFAULT_DESCRIPTION,
    };
  }
  return routeServerMetadata(routeId);
}
