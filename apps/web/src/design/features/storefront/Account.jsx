// Finspeed storefront — account, order history, and ownership details.
import React from 'react';
import Image from 'next/image';
import { Badge, Breadcrumb, Button, EmptyState } from '../../ui/index.js';
import { productImage, products, trackingStages } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import { createOrderReceipt, normalizeOrder, receiptFilename } from './account-orders.mjs';

const ACCOUNT_TABS = [
  { value: 'orders', label: 'Orders' },
  { value: 'addresses', label: 'Delivery details' },
  { value: 'profile', label: 'Profile' },
];

const SUPPORT_EMAIL = 'support@finspeed.online';
const SUPPORT_PHONE = '+91 96506 08982';
const SUPPORT_WHATSAPP = 'https://wa.me/919650608982';

const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function statusFor(step = 0) {
  if (step >= 4) return { tone: 'success', label: 'Delivered' };
  if (step >= 2) return { tone: 'brand', label: 'In transit' };
  return { tone: 'neutral', label: 'Processing' };
}

function downloadOrderSummary(order, user) {
  const receipt = createOrderReceipt(order, products, user);
  const url = URL.createObjectURL(new Blob([receipt], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = receiptFilename(order.no);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function ProductThumb({ line, compact = false, onProduct }) {
  const content = line.product ? (
    <Image
      src={productImage(line.product.id, compact ? 480 : 960)}
      alt=""
      fill
      sizes={compact ? '70px' : '112px'}
    />
  ) : (
    <i data-lucide="bike" aria-hidden="true" />
  );

  if (!line.product || !onProduct) {
    return <span className={`account-product-thumb${compact ? ' is-compact' : ''}`}>{content}</span>;
  }

  return (
    <button
      type="button"
      className={`account-product-thumb${compact ? ' is-compact' : ''}`}
      onClick={() => onProduct(line.product.id)}
      aria-label={`View ${line.name}`}
    >
      {content}
    </button>
  );
}

function OrderRow({ order, onOpen }) {
  const status = statusFor(order.step);
  return (
    <button type="button" className="account-order-row" onClick={onOpen}>
      <span className="account-order-row__meta">
        <span className="account-order-row__number">Order {order.no}</span>
        <span>Placed {order.date} · {order.eta}</span>
      </span>
      <span className="account-order-row__status"><Badge tone={status.tone} dot>{status.label}</Badge></span>
      <span className="account-order-row__products" aria-hidden="true">
        {order.items.slice(0, 3).map((line) => <ProductThumb key={line.lineId} line={line} compact />)}
      </span>
      <span className="account-order-row__summary">
        <span>
          {order.items.map((line) => `${line.name}${line.quantity > 1 ? ` ×${line.quantity}` : ''}`).join(', ')}
        </span>
        {order.items.some((line) => line.configurationEntries.length > 0) && (
          <small>Includes a configured build</small>
        )}
      </span>
      <strong>{inr(order.total)}</strong>
      <i data-lucide="arrow-up-right" aria-hidden="true" />
    </button>
  );
}

function Tracking({ step = 0 }) {
  const safeStep = Math.max(0, Math.min(step, trackingStages.length - 1));
  return (
    <section className="account-tracking" aria-labelledby="tracking-title">
      <header>
        <p className="account-kicker">Live status</p>
        <h3 id="tracking-title">Tracking</h3>
      </header>
      <ol style={{ '--tracking-progress': `${(safeStep / (trackingStages.length - 1)) * 100}%` }}>
        {trackingStages.map((stage, index) => {
          const done = index <= safeStep;
          return (
            <li key={stage} className={done ? 'is-complete' : ''} aria-current={index === safeStep ? 'step' : undefined}>
              <span>{done ? <i data-lucide="check" aria-hidden="true" /> : index + 1}</span>
              <small>{stage}</small>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function OrderDetail({ order, user, onBack, onNav, onProduct }) {
  const status = statusFor(order.step);
  return (
    <article className="account-order-detail">
      <button type="button" className="account-text-action account-order-detail__back" onClick={onBack}>
        <i data-lucide="arrow-left" aria-hidden="true" /> All orders
      </button>

      <header className="account-order-detail__header">
        <div>
          <p className="account-kicker">Ownership record</p>
          <h2>Order {order.no}</h2>
          <p>Placed {order.date} · {order.eta}</p>
        </div>
        <Badge tone={status.tone} dot>{status.label}</Badge>
      </header>

      <Tracking step={order.step} />

      <div className="account-order-detail__grid">
        <section className="account-order-items" aria-labelledby="order-items-title">
          <header>
            <p className="account-kicker">Your specification</p>
            <h3 id="order-items-title">The ride</h3>
          </header>
          {order.items.map((line) => (
            <article className="account-order-item" key={line.lineId}>
              <ProductThumb line={line} onProduct={onProduct} />
              <div className="account-order-item__copy">
                <div className="account-order-item__title">
                  <div>
                    <h4>{line.name}</h4>
                    <p>Quantity {line.quantity}</p>
                  </div>
                  <strong>{inr(line.lineTotal)}</strong>
                </div>
                {line.configurationEntries.length > 0 ? (
                  <dl className="account-order-item__configuration">
                    {line.configurationEntries.map(({ key, label, value }) => (
                      <div key={key}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                  </dl>
                ) : line.specification ? (
                  <p className="account-order-item__standard">Standard specification · {line.specification}</p>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <aside className="account-order-summary" aria-label="Order summary">
          <p className="account-kicker">Order summary</p>
          <div className="account-order-summary__total"><span>Total</span><strong>{inr(order.total)}</strong></div>
          <ul>
            <li><i data-lucide="shield-check" aria-hidden="true" /> 2-year frame warranty</li>
            <li><i data-lucide="wrench" aria-hidden="true" /> Two complimentary services in the first six months</li>
          </ul>
          <div className="account-order-actions">
            <Button
              className="account-action-button"
              variant="dark"
              full
              iconLeft={<i data-lucide="download" aria-hidden="true" />}
              onClick={() => downloadOrderSummary(order, user)}
            >
              Download summary
            </Button>
            <Button
              className="account-action-button"
              variant="outline"
              full
              iconLeft={<i data-lucide="printer" aria-hidden="true" />}
              onClick={() => window.print()}
            >
              Print order
            </Button>
            <Button
              className="account-action-button"
              variant="ghost"
              full
              iconLeft={<i data-lucide="life-buoy" aria-hidden="true" />}
              disabled={!onNav}
              onClick={() => onNav?.('support')}
            >
              Order help
            </Button>
          </div>
          <div className="account-order-support">
            <p>Rider support</p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <a href={SUPPORT_WHATSAPP} target="_blank" rel="noreferrer">
              WhatsApp {SUPPORT_PHONE}
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Account({ user, orders = [], deliveryAddresses = [], onNav, onProduct, onSignOut }) {
  const [tab, setTab] = React.useState('orders');
  const [openOrderNo, setOpenOrderNo] = React.useState(null);
  const tabRefs = React.useRef({});
  const normalizedOrders = React.useMemo(
    () => orders.map((order) => normalizeOrder(order, products)),
    [orders],
  );
  const openOrder = normalizedOrders.find((order) => order.no === openOrderNo) || null;
  const initials = (user?.name || 'Rider').split(' ').map((word) => word[0]).slice(0, 2).join('');
  useLucideIcons([tab, openOrderNo, normalizedOrders.length]);

  function selectTab(nextTab, moveFocus = false) {
    setTab(nextTab);
    setOpenOrderNo(null);
    if (moveFocus) tabRefs.current[nextTab]?.focus();
  }

  function handleTabKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = ACCOUNT_TABS.length - 1;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % ACCOUNT_TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + ACCOUNT_TABS.length) % ACCOUNT_TABS.length;
    selectTab(ACCOUNT_TABS[nextIndex].value, true);
  }

  return (
    <div className="account-page">
      <div className="account-shell">
        <div className="account-breadcrumb">
          <Breadcrumb items={[{ label: 'Home', onClick: () => onNav?.('home') }, { label: 'My account' }]} />
        </div>

        <header className="account-hero">
          <div className="account-hero__intro">
            <p className="account-kicker">Owners / Account</p>
            <h1>Your rides,<br />kept in one place.</h1>
          </div>
          <div className="account-identity">
            <span aria-hidden="true">{initials}</span>
            <div>
              <strong>{user?.name || 'My account'}</strong>
              <small>Member since {user?.since || '2024'}</small>
            </div>
            <Button variant="ghost" disabled={!onSignOut} onClick={onSignOut} iconLeft={<i data-lucide="log-out" aria-hidden="true" />}>Sign out</Button>
          </div>
        </header>

        <nav className="account-tabs" role="tablist" aria-label="Account sections" aria-orientation="horizontal">
          {ACCOUNT_TABS.map((item, index) => (
            <button
              type="button"
              role="tab"
              id={`account-tab-${item.value}`}
              ref={(node) => { tabRefs.current[item.value] = node; }}
              aria-selected={tab === item.value}
              aria-controls={`account-panel-${item.value}`}
              tabIndex={tab === item.value ? 0 : -1}
              className={tab === item.value ? 'is-active' : ''}
              key={item.value}
              onClick={() => selectTab(item.value)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>0{index + 1}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="account-content">
          {tab === 'orders' && (openOrder ? (
            <section
              id="account-panel-orders"
              className="account-tab-panel"
              role="tabpanel"
              aria-labelledby="account-tab-orders"
              tabIndex={0}
            >
              <OrderDetail
                order={openOrder}
                user={user}
                onBack={() => setOpenOrderNo(null)}
                onNav={onNav}
                onProduct={onProduct}
              />
            </section>
          ) : normalizedOrders.length === 0 ? (
            <section
              id="account-panel-orders"
              className="account-tab-panel"
              role="tabpanel"
              aria-labelledby="account-tab-orders"
              tabIndex={0}
            >
              <EmptyState
                icon={<i data-lucide="package" aria-hidden="true" />}
                title="No orders yet"
                message="When you place an order, its specification and delivery status will live here."
                action={<Button variant="dark" disabled={!onNav} onClick={() => onNav?.('shop')}>Explore the bikes</Button>}
              />
            </section>
          ) : (
            <section
              id="account-panel-orders"
              className="account-orders account-tab-panel"
              role="tabpanel"
              aria-labelledby="account-tab-orders orders-title"
              tabIndex={0}
            >
              <header>
                <div><p className="account-kicker">Order history</p><h2 id="orders-title">Your rides</h2></div>
                <p>{normalizedOrders.length} {normalizedOrders.length === 1 ? 'order' : 'orders'} on record</p>
              </header>
              <div className="account-orders__list">
                {normalizedOrders.map((order, index) => (
                  <OrderRow key={order.no || index} order={order} onOpen={() => setOpenOrderNo(order.no)} />
                ))}
              </div>
            </section>
          ))}

          {tab === 'addresses' && (
            <section
              id="account-panel-addresses"
              className="account-readonly-section account-tab-panel"
              role="tabpanel"
              aria-labelledby="account-tab-addresses delivery-title"
              tabIndex={0}
            >
              <header>
                <div><p className="account-kicker">Delivery details</p><h2 id="delivery-title">Addresses on file</h2></div>
                <p>For your security, address changes are confirmed by rider support before the next dispatch.</p>
              </header>
              <div className="account-addresses">
                {deliveryAddresses.map((address, index) => (
                  <article key={address.id} className="account-address">
                    <div><span>0{index + 1}</span><h3>{address.label}</h3>{address.primary && <Badge tone="brand">Default</Badge>}</div>
                    <address>{address.name}<br />{address.line}<br />{address.city}, {address.state} {address.pin}<br />{address.phone}</address>
                  </article>
                ))}
                {deliveryAddresses.length === 0 && (
                  <EmptyState
                    icon={<i data-lucide="map-pin" aria-hidden="true" />}
                    title="No delivery address yet"
                    message="Your delivery details will appear here after your first order."
                    action={<Button variant="dark" disabled={!onNav} onClick={() => onNav?.('shop')}>Choose a bike</Button>}
                  />
                )}
              </div>
              <button type="button" className="account-support-link" disabled={!onNav} onClick={() => onNav?.('support')}>
                Update a delivery address with rider support <i data-lucide="arrow-right" aria-hidden="true" />
              </button>
            </section>
          )}

          {tab === 'profile' && (
            <section
              id="account-panel-profile"
              className="account-readonly-section account-profile account-tab-panel"
              role="tabpanel"
              aria-labelledby="account-tab-profile profile-title"
              tabIndex={0}
            >
              <header>
                <div><p className="account-kicker">Rider profile</p><h2 id="profile-title">Personal details</h2></div>
                <p>Your verified details are shown here. Rider support handles changes so order and warranty records remain connected.</p>
              </header>
              <dl>
                <div><dt>Full name</dt><dd>{user?.name || 'Not provided'}</dd></div>
                <div><dt>Email</dt><dd>{user?.email || 'Not provided'}</dd></div>
                <div><dt>Phone</dt><dd>{user?.phone || 'Not provided'}</dd></div>
                <div><dt>Member since</dt><dd>{user?.since || '2024'}</dd></div>
              </dl>
              <button type="button" className="account-support-link" disabled={!onNav} onClick={() => onNav?.('support')}>
                Request a profile update <i data-lucide="arrow-right" aria-hidden="true" />
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
