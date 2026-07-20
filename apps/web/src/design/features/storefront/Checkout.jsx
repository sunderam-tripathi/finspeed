// Finspeed storefront — premium editorial checkout
/* eslint-disable @next/next/no-img-element -- Theme-specific responsive product srcsets are resolved by the storefront media catalogue. */
import React from 'react';
import { Breadcrumb } from '../../ui/index.js';
import {
  cartLines,
  resolveProductImage,
} from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function checkoutLinePreview(configuration, theme, productId) {
  const preview = configuration?.preview;
  const configured = preview?.[theme] || preview?.light || preview?.dark || preview;
  if (configured?.src) return configured;
  return resolveProductImage(productId, { theme, role: 'search', width: 480 });
}

function Checkout({ items, onNav, onProduct, onPlaced, theme = 'light', checkoutMode = 'preview' }) {
  const lines = cartLines(items);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = subtotal;
  const [placed, setPlaced] = React.useState(false);
  const [pay, setPay] = React.useState('cod');
  const paymentRefs = React.useRef([]);
  const outcomeHeadingRef = React.useRef(null);
  const paymentKeys = ['cod', 'upi'];
  const liveCheckout = checkoutMode === 'live' && typeof onPlaced === 'function';
  const [orderNo] = React.useState(() => (
    liveCheckout ? `FS${Math.floor(100000 + Math.random() * 900000)}` : null
  ));
  const inr = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  useLucideIcons();

  React.useEffect(() => {
    if (!placed) return undefined;
    const frame = window.requestAnimationFrame(() => outcomeHeadingRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [placed]);

  if (placed) {
    return (
      <section className="store-checkout-outcome" aria-labelledby="checkout-outcome-title" aria-live="polite" aria-atomic="true">
        <div className="store-checkout-outcome__mark" aria-hidden="true">
          <i data-lucide="check" />
        </div>
        <p className="editorial-kicker">{liveCheckout ? `Order ${orderNo}` : 'Interactive preview complete'}</p>
        <h1 id="checkout-outcome-title" ref={outcomeHeadingRef} tabIndex={-1}>
          {liveCheckout ? 'Order confirmed' : 'No order was placed'}
        </h1>
        <p className="store-checkout-outcome__copy">
          {liveCheckout
            ? 'Your Finspeed is reserved. We’ll send the order details and delivery updates to the email you provided.'
            : 'You have completed the storefront demonstration. Your details stayed in this browser; no bicycle was reserved, no payment was collected and no order was created.'}
        </p>
        <div className="store-checkout-outcome__actions">
          {liveCheckout && (
            <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('account')}>
              Track order <i data-lucide="map-pin" aria-hidden="true" />
            </button>
          )}
          <button type="button" className="editorial-cta editorial-cta--secondary" onClick={() => onNav('shop')}>
            {liveCheckout ? 'Continue shopping' : 'Return to the bikes'} <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="store-checkout-outcome" aria-labelledby="checkout-empty-title">
        <div className="store-checkout-outcome__mark store-checkout-outcome__mark--quiet" aria-hidden="true">
          <i data-lucide="shopping-cart" />
        </div>
        <p className="editorial-kicker">Nothing queued</p>
        <h1 id="checkout-empty-title">Your cart is empty</h1>
        <p className="store-checkout-outcome__copy">Choose a cycle or configure one around the way you ride.</p>
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('shop')}>
          Explore the range <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    );
  }

  function place(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const value = (name) => String(fields.get(name) || '').trim();
    const customer = {
      name: value('name'),
      phone: value('phone'),
      email: value('email'),
    };
    const shippingAddress = {
      name: customer.name,
      line: value('address'),
      city: value('city'),
      state: value('state'),
      pin: value('postal-code'),
      landmark: value('landmark'),
      phone: customer.phone,
    };
    window.scrollTo(0, 0);
    setPlaced(true);
    const order = {
      no: orderNo,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      step: 0,
      eta: 'Arriving in 4–6 days',
      items: lines.map(({ lineId, product, quantity, unitPrice, configuration }) => ({
        lineId,
        id: product.id,
        qty: quantity,
        unitPrice,
        configuration,
      })),
      paymentMethod: pay,
      customer,
      shippingAddress,
      ownerEmail: customer.email.toLowerCase(),
      total,
    };
    if (liveCheckout) onPlaced(order);
  }

  function selectPayment(key, index, moveFocus = false) {
    setPay(key);
    if (moveFocus) paymentRefs.current[index]?.focus();
  }

  function handlePaymentKeyDown(event, index) {
    const last = paymentKeys.length - 1;
    let nextIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index === 0 ? last : index - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = last;
    else return;
    event.preventDefault();
    selectPayment(paymentKeys[nextIndex], nextIndex, true);
  }

  const paymentOption = (key, label, detail, icon, index) => {
    const active = pay === key;
    return (
      <button
        type="button"
        className={`store-checkout-payment${active ? ' is-selected' : ''}`}
        role="radio"
        aria-checked={active}
        tabIndex={active ? 0 : -1}
        ref={(element) => { paymentRefs.current[index] = element; }}
        onClick={() => selectPayment(key, index)}
        onKeyDown={(event) => handlePaymentKeyDown(event, index)}
      >
        <span className="store-checkout-payment__icon" aria-hidden="true"><i data-lucide={icon} /></span>
        <span className="store-checkout-payment__copy">
          <strong>{label}</strong>
          <small>{detail}</small>
        </span>
        <span className="store-checkout-payment__radio" aria-hidden="true" />
      </button>
    );
  };

  return (
    <div className="store-checkout-surface">
      <div className="store-checkout-shell">
        <div className="store-checkout-breadcrumb">
          <Breadcrumb items={[
            { label: 'Home', onClick: () => onNav('home') },
            { label: 'Shop', onClick: () => onNav('shop') },
            { label: 'Checkout' },
          ]} />
        </div>

        <header className="store-checkout-heading">
          <div>
            <p className="editorial-kicker">{liveCheckout ? 'Secure checkout' : 'Checkout preview'} · {count} {count === 1 ? 'cycle' : 'cycles'}</p>
            <h1>{liveCheckout ? 'Complete your ride' : 'Review your ride'}</h1>
          </div>
          <p>
            {liveCheckout
              ? 'We will confirm delivery, warranty terms and final availability before handover.'
              : 'Explore the complete checkout flow without creating an order, reserving stock or sending payment.'}
          </p>
        </header>

        <form className="store-checkout-layout store-checkout-form" onSubmit={place}>
          <div className="store-checkout-form__sections">
            <CheckoutSection number="01" title="Contact">
              <div className="store-checkout-fields">
                <CheckoutField label="Full name" name="name" autoComplete="name" placeholder="Arjun Mehta" required />
                <CheckoutField label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" required />
                <CheckoutField className="store-checkout-field--wide" label="Email" name="email" type="email" autoComplete="email" placeholder="you@email.com" required />
              </div>
            </CheckoutSection>

            <CheckoutSection number="02" title="Shipping address">
              <div className="store-checkout-fields">
                <CheckoutField className="store-checkout-field--wide" label="Address" name="address" autoComplete="street-address" placeholder="Flat / house, street, area" required />
                <CheckoutField label="City" name="city" autoComplete="address-level2" placeholder="Greater Noida" required />
                <CheckoutField label="State" name="state" autoComplete="address-level1" placeholder="Uttar Pradesh" required />
                <CheckoutField label="PIN code" name="postal-code" inputMode="numeric" autoComplete="postal-code" placeholder="201306" required />
                <CheckoutField label="Landmark (optional)" name="landmark" placeholder="Near Sarin Farm Market" />
              </div>
            </CheckoutSection>

            <CheckoutSection number="03" title="Payment">
              <p className="store-checkout-section__intro">
                {liveCheckout
                  ? 'Pay at handover after you have checked your cycle.'
                  : 'Choose a preferred handover method for this preview. No payment details are collected.'}
              </p>
              <div className="store-payment-options" role="radiogroup" aria-label="Payment method">
                {paymentOption('cod', 'Cash on delivery', 'Pay when your cycle arrives', 'banknote', 0)}
                {paymentOption('upi', 'UPI on delivery', 'Scan and pay at handover', 'smartphone', 1)}
              </div>
            </CheckoutSection>
          </div>

          <aside className="store-checkout-summary" aria-labelledby="checkout-summary-title">
            <div className="store-checkout-summary__heading">
              <p className="editorial-kicker">Your selection</p>
              <h2 id="checkout-summary-title">Order summary <span>({count})</span></h2>
            </div>

            <div className="store-checkout-summary__items">
              {lines.map(({ lineId, product, quantity, unitPrice, configuration }) => {
                const preview = checkoutLinePreview(configuration, theme, product.id);
                const configuredSummary = configuration
                  ? [
                    configuration.base?.wheels,
                    configuration.brakes?.title,
                    configuration.suspension?.title,
                    configuration.gears?.title,
                    configuration.finish?.title,
                  ].filter(Boolean).join(' · ')
                  : `${product.wheels} · ${product.speed}`;
                return (
                  <article className="store-checkout-item" key={lineId}>
                    <button type="button" className="store-checkout-item__image" aria-label={`View ${product.name}`} onClick={() => onProduct(product.id)}>
                      <img
                        src={preview.src}
                        srcSet={preview.srcSet}
                        sizes={preview.sizes || '82px'}
                        style={preview.style}
                        data-product-scale={preview.registration?.scale}
                        data-product-baseline={preview.registration?.baseline}
                        alt=""
                      />
                      <span aria-hidden="true">{quantity}</span>
                    </button>
                    <div className="store-checkout-item__copy">
                      <h3>{product.name}</h3>
                      <p className="store-checkout-item__configuration">{configuredSummary}</p>
                    </div>
                    <strong className="store-checkout-item__price">{inr(unitPrice * quantity)}</strong>
                  </article>
                );
              })}
            </div>

            <dl className="store-checkout-totals">
              <OrderSummaryRow label="Subtotal" value={inr(subtotal)} />
              <OrderSummaryRow label="Shipping" value="To be confirmed" />
              <div className="store-checkout-totals__grand">
                <dt>Indicative total</dt>
                <dd>{inr(total)}</dd>
              </div>
            </dl>

            <button type="submit" className="editorial-cta editorial-cta--primary store-checkout-submit">
              {liveCheckout ? 'Place order' : 'Complete preview'} <i data-lucide={liveCheckout ? 'lock' : 'check-circle'} aria-hidden="true" />
            </button>
            <p className="store-checkout-assurance">
              <i data-lucide={liveCheckout ? 'shield-check' : 'info'} aria-hidden="true" />
              {liveCheckout
                ? 'Delivery, warranty and final availability confirmed before handover'
                : 'Preview only · no reservation, payment or order submission'}
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

function CheckoutSection({ number, title, children }) {
  const id = `checkout-section-${number}`;
  return (
    <section className="store-checkout-section" aria-labelledby={id}>
      <header className="store-checkout-section__heading">
        <span>{number}</span>
        <h2 id={id}>{title}</h2>
      </header>
      <div className="store-checkout-section__body">{children}</div>
    </section>
  );
}

function CheckoutField({ label, className = '', ...inputProps }) {
  const id = `checkout-${inputProps.name}`;
  return (
    <label className={`store-checkout-field ${className}`.trim()} htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...inputProps} />
    </label>
  );
}

function OrderSummaryRow({ label, value, accent = false }) {
  return (
    <div className={accent ? 'is-accent' : undefined}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default Checkout;
