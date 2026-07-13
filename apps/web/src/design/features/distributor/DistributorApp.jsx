import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '../../ui/index.js';
import { distributorOrderDetails, distributorProducts } from '../../data/distributor.js';
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
  const signedOut = normalizedPath === '/distributor/sign-in';

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
    return <Auth onEnter={() => navigate('/distributor')} />;
  }

  const [title, subtitle] = headings[route];
  const orderCount = Object.keys(order).length;
  const toastIcon = { success: 'check-circle-2', danger: 'alert-circle', info: 'info', default: 'bell' };

  return (
    <div className="dist-app-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar route={route} onNav={setRoute} orderCount={orderCount} onSignOut={() => navigate('/distributor/sign-in')} />
      <div className="dist-main" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} subtitle={subtitle} query={query} onSearch={setQuery} />
        <div className="dist-route-body" style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route index element={<Dashboard onNav={setRoute} />} />
            <Route path="price-list" element={<PriceList query={query} order={order} onAdd={addToOrder} onNav={setRoute} />} />
            <Route path="order-builder" element={<OrderBuilder order={order} onAdd={addToOrder} onRemove={removeLine} onNav={setRoute} onPlace={placeOrder} />} />
            <Route path="orders" element={<Orders justPlaced={justPlaced} placedOrders={placedOrders} onClearPlaced={() => setJustPlaced(null)} onNav={setRoute} onReorder={reorder} />} />
            <Route path="invoices" element={<Invoices notify={notify} />} />
            <Route path="account" element={<Account notify={notify} />} />
            <Route path="support" element={<Support notify={notify} />} />
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
