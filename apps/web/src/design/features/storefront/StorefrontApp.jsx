import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Newsletter, Toast } from '../../ui/index.js';
import { addresses as seedAddresses, cartLines, demoUser, products, seedOrders } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import { usePersistentState } from '../../lib/usePersistentState.js';
import Account from './Account.jsx';
import Auth from './Auth.jsx';
import BuildRide from './BuildRide.jsx';
import CartDrawer from './CartDrawer.jsx';
import Checkout from './Checkout.jsx';
import Engineering from './Engineering.jsx';
import { About, Assembly, Contact, Journal, RiderStories, Stores, Support, Warranty } from './EditorialPages.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Home from './Home.jsx';
import { BlogPage, BrandStory, Dealers, SupportHub, TestimonialsPage } from './LegacyEditorialPages.jsx';
import ProductDetail from './ProductDetail.jsx';
import Search from './Search.jsx';
import Shop from './Shop.jsx';

const routePaths = {
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

const DEMO_OWNER_EMAIL = demoUser.email.toLowerCase();

function normalizedEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function orderOwnerEmail(order) {
  return normalizedEmail(order?.ownerEmail || order?.customer?.email);
}

function routeName(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (normalized.startsWith('/products/')) {
    const id = decodeURIComponent(normalized.split('/').filter(Boolean).pop() || '');
    return products.some((product) => product.id === id) ? 'product' : 'not-found';
  }
  const aliases = {
    '/catalog': 'shop',
    '/models': 'shop',
    '/brand-story': 'about',
  };
  return aliases[normalized] || Object.entries(routePaths).find(([, path]) => path === normalized)?.[0] || 'not-found';
}

export default function StorefrontApp({ theme, onThemeToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cart, setCart] = usePersistentState('finspeed.cart', {});
  const [cartOpen, setCartOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [user, setUser] = usePersistentState('finspeed.user', null);
  const [orders, setOrders] = usePersistentState('finspeed.orders', () => seedOrders.slice());
  const toastTimer = React.useRef(null);
  const mainRef = React.useRef(null);
  const closeCart = React.useCallback(() => setCartOpen(false), []);
  const route = routeName(location.pathname);
  const filter = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';
  const activeOwnerEmail = normalizedEmail(user?.email);
  const ownerOrders = React.useMemo(() => {
    if (!activeOwnerEmail) return [];
    return orders.filter((order) => {
      const email = orderOwnerEmail(order);
      return email ? email === activeOwnerEmail : activeOwnerEmail === DEMO_OWNER_EMAIL;
    });
  }, [activeOwnerEmail, orders]);
  const deliveryAddresses = React.useMemo(() => {
    const seen = new Set();
    const fromOrders = ownerOrders.flatMap((order) => {
      const address = order?.shippingAddress;
      if (!address?.line || !address?.city || !address?.state || !address?.pin) return [];
      const key = [address.line, address.city, address.state, address.pin].map((part) => String(part).toLowerCase()).join('|');
      if (seen.has(key)) return [];
      seen.add(key);
      return [{
        id: `order-${order.no || seen.size}`,
        label: seen.size === 1 ? 'Latest delivery' : 'Previous delivery',
        primary: seen.size === 1,
        name: address.name || user?.name || 'Finspeed rider',
        line: address.landmark ? `${address.line} · ${address.landmark}` : address.line,
        city: address.city,
        state: address.state,
        pin: address.pin,
        phone: address.phone || user?.phone || '',
      }];
    });
    if (fromOrders.length) return fromOrders;
    return activeOwnerEmail === DEMO_OWNER_EMAIL ? seedAddresses : [];
  }, [activeOwnerEmail, ownerOrders, user?.name, user?.phone]);

  useLucideIcons();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setCartOpen(false);
    const label = route === 'home' ? 'Performance bicycles' : route.replace('-', ' ');
    document.title = `Finspeed — ${label.charAt(0).toUpperCase() + label.slice(1)}`;
    const focusFrame = window.requestAnimationFrame(() => {
      if (document.activeElement === document.body) mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [location.pathname, route]);

  React.useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const cartCount = cartLines(cart).reduce((total, line) => total + line.quantity, 0);

  function nav(destination, category) {
    if (destination === 'shop') {
      const nextCategory = category || 'all';
      navigate(nextCategory === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(nextCategory)}`);
      return;
    }
    navigate(routePaths[destination] || '/');
  }

  function setFilter(nextFilter) {
    navigate(nextFilter === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(nextFilter)}`);
  }

  function setQuery(nextQuery) {
    const next = new URLSearchParams(searchParams);
    if (nextQuery) next.set('q', nextQuery);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  }

  function signIn(nextUser) {
    setUser(nextUser || demoUser);
    navigate('/account');
  }

  function signOut() {
    setUser(null);
    navigate('/');
  }

  function recordOrder(order) {
    const checkoutCustomer = order?.customer || {};
    const nextUser = user || {
      ...demoUser,
      name: checkoutCustomer.name || demoUser.name,
      email: checkoutCustomer.email || demoUser.email,
      phone: checkoutCustomer.phone || demoUser.phone,
      since: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    };
    const ownerEmail = normalizedEmail(nextUser.email);
    setOrders((current) => [{ ...order, ownerEmail }, ...current]);
    setCart({});
    if (!user) setUser(nextUser);
  }

  function goProduct(id) {
    navigate(`/products/${encodeURIComponent(id)}`);
  }

  function addToCart(id, quantity = 1) {
    setCart((current) => {
      const existing = typeof current?.[id] === 'number' ? current[id] : 0;
      return { ...current, [id]: existing + quantity };
    });
    const product = products.find((item) => item.id === id);
    setToast(product ? `${product.name} added to cart` : 'Item added to cart');
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }

  function buyNow(id, quantity = 1) {
    addToCart(id, quantity);
    closeCart();
    navigate('/checkout');
  }

  function addConfiguredToCart({ productId, unitPrice, configuration }) {
    const fingerprint = ['base', 'brakes', 'suspension', 'gears', 'finish']
      .map((key) => configuration?.[key]?.id || 'standard')
      .join('-');
    const lineId = `configured:${productId}:${fingerprint}`;
    setCart((current) => {
      const existing = current?.[lineId];
      const quantity = existing && typeof existing === 'object' ? Number(existing.quantity) || 0 : 0;
      return {
        ...current,
        [lineId]: { productId, quantity: quantity + 1, unitPrice, configuration },
      };
    });
    const product = products.find((item) => item.id === productId);
    setToast(`${product?.name || 'Configured bike'} added to cart`);
    setCartOpen(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }

  function setQuantity(id, quantity) {
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      const existing = current?.[id];
      return {
        ...current,
        [id]: existing && typeof existing === 'object'
          ? { ...existing, quantity }
          : quantity,
      };
    });
  }

  function removeItem(id) {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  const shared = { onNav: nav };

  return (
    <div className={`store-app${route === 'home' ? ' store-app--home' : ''}`}>
      <Header
        cartCount={cartCount}
        theme={theme}
        route={route}
        onNav={nav}
        onCart={() => setCartOpen(true)}
        onAccount={() => navigate(user ? '/account' : '/sign-in')}
        onSearch={() => navigate('/search')}
        onThemeToggle={onThemeToggle}
      />

      <main ref={mainRef} className="store-main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home {...shared} theme={theme} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/shop" element={<Shop {...shared} filter={filter} setFilter={setFilter} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/catalog" element={<Shop {...shared} filter={filter} setFilter={setFilter} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/models" element={<Shop {...shared} filter={filter} setFilter={setFilter} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/build" element={<BuildRide {...shared} onAddConfigured={addConfiguredToCart} />} />
          <Route path="/products/:productId" element={<ProductRoute {...shared} onAdd={addToCart} onBuyNow={buyNow} onProduct={goProduct} />} />
          <Route path="/about" element={<About {...shared} />} />
          <Route path="/brand-story" element={<BrandStory />} />
          <Route path="/engineering" element={<Engineering {...shared} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<Contact {...shared} />} />
          <Route path="/warranty" element={<Warranty {...shared} />} />
          <Route path="/assembly" element={<Assembly {...shared} />} />
          <Route path="/stores" element={<Stores {...shared} />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/support" element={<SupportHub />} />
          <Route path="/search" element={<Search {...shared} query={query} setQuery={setQuery} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/sign-in" element={<Auth onAuth={signIn} onNav={nav} />} />
          <Route path="/account" element={user ? <Account user={user} orders={ownerOrders} deliveryAddresses={deliveryAddresses} {...shared} onProduct={goProduct} onSignOut={signOut} /> : <Navigate to="/sign-in" replace />} />
          <Route path="/checkout" element={<Checkout items={cart} onQty={setQuantity} onRemove={removeItem} {...shared} onProduct={goProduct} onPlaced={recordOrder} />} />
          <Route path="*" element={<NotFound onHome={() => navigate('/')} />} />
        </Routes>
      </main>

      {route !== 'auth' && route !== 'not-found' && (
        <>
          <section className="store-newsletter-section" aria-label="Finspeed newsletter">
            <div className="store-page-shell store-newsletter-inner">
              <Newsletter
                className="store-newsletter"
                eyebrow="Join the network"
                title="Be first to the next drop"
                description="New launches, restocks and rider stories — straight to your inbox. No spam, ever."
                cta="Subscribe"
                tone="light"
              />
            </div>
          </section>
          <Footer onNav={nav} tone="light" />
        </>
      )}

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={closeCart}
        onQty={setQuantity}
        onRemove={removeItem}
        onProduct={(id) => { setCartOpen(false); goProduct(id); }}
        onCheckout={() => { setCartOpen(false); navigate('/checkout'); }}
      />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 'var(--z-toast)' }}>
          <Toast open tone="success" icon={<i data-lucide="check-circle" style={{ width: 18, height: 18 }} />}>{toast}</Toast>
        </div>
      )}
    </div>
  );
}

function ProductRoute(props) {
  const { productId = 'bull-shark' } = useParams();
  const navigate = useNavigate();
  const id = decodeURIComponent(productId);
  if (!products.some((product) => product.id === id)) {
    return <NotFound onHome={() => navigate('/')} />;
  }
  return <ProductDetail key={id} id={id} {...props} />;
}

function NotFound({ onHome }) {
  return (
    <section style={{ minHeight: '62vh', display: 'grid', placeItems: 'center', padding: 'var(--space-7)', textAlign: 'center' }}>
      <div>
        <p className="fin-eyebrow">404 · Route not found</p>
        <h1 style={{ font: 'var(--fw-bold) var(--fs-4xl)/1 var(--font-display)', margin: 'var(--space-3) 0' }}>This trail ends here.</h1>
        <Button type="button" variant="primary" onClick={onHome}>Return home</Button>
      </div>
    </section>
  );
}
