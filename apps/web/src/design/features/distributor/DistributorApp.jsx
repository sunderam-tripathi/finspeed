import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '../../ui/index.js';
import { fetchPortal, openPortalSession } from './portal-session.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import { usePersistentState } from '../../lib/usePersistentState.js';
import Account from './Account.jsx';
import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';
import Invoices from './Invoices.jsx';
import OrderBuilder from './OrderBuilder.jsx';
import Orders from './Orders.jsx';
import PriceList from './PriceList.jsx';
import Sidebar from './Sidebar.jsx';
import Support from './Support.jsx';
import Topbar from './Topbar.jsx';

const routePaths = {
  dashboard: '/distributor',
  pricelist: '/distributor/price-list',
  orders: '/distributor/order-builder',
  orderhistory: '/distributor/orders',
  invoices: '/distributor/invoices',
  account: '/distributor/account',
  support: '/distributor/support',
};

const headings = {
  dashboard: ['Dashboard', 'Welcome back, Ravi Stores — here is your account at a glance.'],
  pricelist: ['Price list', 'Consolidated distributor pricing · 2024/25 catalog.'],
  orders: ['Order builder', 'Build and submit a purchase order.'],
  orderhistory: ['Orders', 'Track shipments and review past purchase orders.'],
  invoices: ['Invoices', 'Statements, balances and Net-30 payments.'],
  account: ['Account', 'Business profile, credit line and team access.'],
  support: ['Support', 'Reach your success manager and track tickets.'],
};

function routeName(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return Object.entries(routePaths).find(([, path]) => path === normalized)?.[0] || 'dashboard';
}

export default function DistributorApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedPath = location.pathname.length > 1 ? location.pathname.replace(/\/+$/, '') : location.pathname;
  const route = routeName(normalizedPath);
  const [order, setOrder] = usePersistentState('finspeed.distributor.order-draft', {
    'bull-shark-29"': 20,
    'mako-shark-27.5" Geared': 12,
  });
  const [placedOrders, setPlacedOrders] = usePersistentState('finspeed.distributor.orders', []);
  const [query, setQuery] = React.useState('');
  const [toast, setToast] = React.useState(null);
  const [justPlaced, setJustPlaced] = React.useState(null);
  const toastTimer = React.useRef(null);
  // The portal is gated on an in-session sign-in rather than on the current
  // path, so a deep link cannot render dealer pricing to a visitor who never
  // signed in. A reload returns to the sign-in screen by design. Since
  // WEB-039 the dataset itself lives server-side: sign-in opens a session
  // token and the portal payload is fetched over it, so pricing is never in
  // the client bundle.
  const [authenticated, setAuthenticated] = React.useState(false);
  const [portal, setPortal] = React.useState(null);
  const [portalError, setPortalError] = React.useState(null);
  const sessionToken = React.useRef(null);

  const loadPortal = React.useCallback(async () => {
    setPortalError(null);
    try {
      if (!sessionToken.current) sessionToken.current = await openPortalSession();
      try {
        setPortal(await fetchPortal(sessionToken.current));
      } catch (error) {
        if (!error.expired) throw error;
        sessionToken.current = await openPortalSession();
        setPortal(await fetchPortal(sessionToken.current));
      }
    } catch {
      setPortalError('The portal data could not be loaded.');
    }
  }, []);
  const atSignIn = normalizedPath === '/distributor/sign-in';
  const signedOut = !authenticated;

  useLucideIcons();

  React.useEffect(() => {
    if (!signedOut) {
      const [title] = headings[route];
      document.title = `Finspeed Distributor — ${title}`;
    } else {
      document.title = 'Finspeed Distributor — Sign in';
    }
    window.scrollTo(0, 0);
  }, [route, signedOut]);

  React.useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function notify(message, tone = 'default') {
    setToast({ message, tone });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }

  function setRoute(nextRoute) {
    navigate(routePaths[nextRoute] || routePaths.dashboard);
  }

  function addToOrder(key, quantity) {
    setOrder((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[key];
      else next[key] = quantity;
      return next;
    });
  }

  function removeLine(key) {
    setOrder((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  const distributorProducts = portal?.products ?? [];
  const distributorOrderDetails = portal?.orderDetails ?? {};

  function reorder(purchaseOrder) {
    const detail = purchaseOrder.detail || distributorOrderDetails[purchaseOrder.no];
    const next = {};
    (detail?.lines || []).forEach(([id, variant, quantity]) => {
      const row = distributorProducts.find((item) => item.id === id && item.variant === variant);
      if (row && quantity > 0) next[`${row.id}-${row.variant}`] = quantity;
    });
    if (Object.keys(next).length === 0) {
      notify('Order line details are unavailable', 'danger');
      return;
    }
    setOrder(next);
    setRoute('orders');
    notify('Reorder added to the order builder', 'success');
  }

  function placeOrder() {
    const lines = Object.entries(order)
      .map(([key, quantity]) => {
        const row = distributorProducts.find((item) => `${item.id}-${item.variant}` === key);
        return row ? { row, quantity } : null;
      })
      .filter(Boolean);
    if (lines.length === 0) {
      notify('Add at least one product before placing an order', 'danger');
      return;
    }

    const units = lines.reduce((sum, line) => sum + line.quantity, 0);
    const value = lines.reduce((sum, line) => sum + line.row.dp * line.quantity, 0);
    const purchaseOrder = {
      no: `PO-${String(Date.now()).slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      units,
      value,
      status: 'Processing',
      detail: {
        eta: 'Awaiting production schedule',
        lines: lines.map(({ row, quantity }) => [row.id, row.variant, quantity]),
      },
    };

    setPlacedOrders((current) => [purchaseOrder, ...current]);
    setJustPlaced(purchaseOrder);
    setOrder({});
    setRoute('orderhistory');
    notify(`Order ${purchaseOrder.no} placed · Net-30`, 'success');
  }

  if (signedOut) {
    if (!atSignIn) return <Navigate to="/distributor/sign-in" replace />;
    return <Auth onEnter={() => { setAuthenticated(true); loadPortal(); navigate('/distributor'); }} />;
  }

  if (atSignIn) return <Navigate to="/distributor" replace />;

  if (!portal) {
    return (
      <div className="dist-app-shell" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <div role="status" style={{ textAlign: 'center', maxWidth: 420, padding: 'var(--space-6)' }}>
          <div style={{ font: 'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--cyan-electric)' }}>Distributor portal</div>
          <p style={{ font: 'var(--text-body-md)', color: 'var(--text-secondary)', margin: 'var(--space-4) 0 0' }}>
            {portalError || 'Loading your pricing, orders and account…'}
          </p>
          {portalError ? (
            <button type="button" className="btn btn--primary" style={{ marginTop: 'var(--space-5)' }} onClick={loadPortal}>
              Try again
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const [title, subtitle] = headings[route];
  const orderCount = Object.keys(order).length;
  const toastIcon = { success: 'check-circle-2', danger: 'alert-circle', info: 'info', default: 'bell' };

  return (
    <div className="dist-app-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar route={route} onNav={setRoute} orderCount={orderCount} onSignOut={() => { setAuthenticated(false); setPortal(null); setPortalError(null); sessionToken.current = null; navigate('/distributor/sign-in'); }} />
      <div className="dist-main" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} subtitle={subtitle} query={query} onSearch={setQuery} />
        <div className="dist-route-body" style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route index element={<Dashboard portal={portal} onNav={setRoute} />} />
            <Route path="price-list" element={<PriceList portal={portal} query={query} order={order} onAdd={addToOrder} onNav={setRoute} />} />
            <Route path="order-builder" element={<OrderBuilder portal={portal} order={order} onAdd={addToOrder} onRemove={removeLine} onNav={setRoute} onPlace={placeOrder} />} />
            <Route path="orders" element={<Orders portal={portal} justPlaced={justPlaced} placedOrders={placedOrders} onClearPlaced={() => setJustPlaced(null)} onNav={setRoute} onReorder={reorder} />} />
            <Route path="invoices" element={<Invoices portal={portal} notify={notify} />} />
            <Route path="account" element={<Account portal={portal} notify={notify} />} />
            <Route path="support" element={<Support portal={portal} notify={notify} />} />
            <Route path="*" element={<Navigate to="/distributor" replace />} />
          </Routes>
        </div>
      </div>

      <div className="dist-toast-wrap" style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 200, pointerEvents: 'none' }}>
        {toast && (
          <div style={{ pointerEvents: 'auto' }}>
            <Toast tone={toast.tone} open icon={<i data-lucide={toastIcon[toast.tone] || 'bell'} style={{ width: 18, height: 18 }} />} onClose={() => setToast(null)}>{toast.message}</Toast>
          </div>
        )}
      </div>
    </div>
  );
}
