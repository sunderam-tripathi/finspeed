import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Newsletter, Toast } from '../../ui/index.js';
import { demoUser, products, seedOrders } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import { usePersistentState } from '../../lib/usePersistentState.js';
import Account from './Account.jsx';
import Auth from './Auth.jsx';
import CartDrawer from './CartDrawer.jsx';
import Checkout from './Checkout.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Home from './Home.jsx';
import { About, Assembly, Contact, Stores, Warranty } from './Pages.jsx';
import ProductDetail from './ProductDetail.jsx';
import Search from './Search.jsx';
import Shop from './Shop.jsx';

const routePaths = {
  home: '/',
  shop: '/shop',
  about: '/about',
  contact: '/contact',
  warranty: '/warranty',
  assembly: '/assembly',
  stores: '/stores',
  search: '/search',
  auth: '/sign-in',
  account: '/account',
  checkout: '/checkout',
};

function routeName(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (normalized.startsWith('/products/')) {
    const id = decodeURIComponent(normalized.split('/').filter(Boolean).pop() || '');
    return products.some((product) => product.id === id) ? 'product' : 'not-found';
  }
  return Object.entries(routePaths).find(([, path]) => path === normalized)?.[0] || 'not-found';
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
  const route = routeName(location.pathname);
  const filter = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';

  useLucideIcons();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setCartOpen(false);
    const label = route === 'home' ? 'Performance bicycles' : route.replace('-', ' ');
    document.title = `Finspeed — ${label.charAt(0).toUpperCase() + label.slice(1)}`;
  }, [location.pathname, route]);

  React.useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

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
    setOrders((current) => [order, ...current]);
    setCart({});
    if (!user) setUser(demoUser);
  }

  function goProduct(id) {
    navigate(`/products/${encodeURIComponent(id)}`);
  }

  function addToCart(id, quantity = 1) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + quantity }));
    const product = products.find((item) => item.id === id);
    setToast(product ? `${product.name} added to cart` : 'Item added to cart');
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
      return { ...current, [id]: quantity };
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
    <div className={`store-app${route === 'home' ? ' store-app--home' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
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

      <main className="store-main" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home {...shared} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/shop" element={<Shop {...shared} filter={filter} setFilter={setFilter} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/products/:productId" element={<ProductRoute {...shared} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/about" element={<About {...shared} />} />
          <Route path="/contact" element={<Contact {...shared} />} />
          <Route path="/warranty" element={<Warranty {...shared} />} />
          <Route path="/assembly" element={<Assembly {...shared} />} />
          <Route path="/stores" element={<Stores {...shared} />} />
          <Route path="/search" element={<Search {...shared} query={query} setQuery={setQuery} onAdd={addToCart} onProduct={goProduct} />} />
          <Route path="/sign-in" element={<Auth onAuth={signIn} onNav={nav} />} />
          <Route path="/account" element={user ? <Account user={user} orders={orders} {...shared} onProduct={goProduct} onSignOut={signOut} /> : <Navigate to="/sign-in" replace />} />
          <Route path="/checkout" element={<Checkout items={cart} onQty={setQuantity} onRemove={removeItem} {...shared} onProduct={goProduct} onPlaced={recordOrder} />} />
          <Route path="*" element={<NotFound onHome={() => navigate('/')} />} />
        </Routes>
      </main>

      {route !== 'auth' && route !== 'not-found' && (
        <>
          <div className="store-newsletter-section" style={{ background: 'var(--bg-page)' }}>
            <div className="store-page-shell store-newsletter-inner" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-9) var(--space-7)' }}>
              <Newsletter
                className="store-newsletter"
                eyebrow="Join the network"
                title="Be first to the next drop"
                description="New launches, restocks and rider stories — straight to your inbox. No spam, ever."
                cta="Subscribe"
                tone="light"
              />
            </div>
          </div>
          <Footer onNav={nav} tone="light" />
        </>
      )}

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onQty={setQuantity}
        onRemove={removeItem}
        onProduct={(id) => { setCartOpen(false); goProduct(id); }}
        onCheckout={() => { setCartOpen(false); navigate('/checkout'); }}
      />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 1200 }}>
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
