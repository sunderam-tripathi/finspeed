/* eslint-disable @next/next/no-img-element -- Theme-specific responsive product srcsets are resolved by the storefront media catalogue. */
import React from 'react';
import { QuantityStepper } from '../../ui/index.js';
import {
  cartLines,
  resolveProductImage,
} from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function cartLinePreview(configuration, theme, productId) {
  const preview = configuration?.preview;
  const configured = preview?.[theme] || preview?.light || preview?.dark || preview;
  if (configured?.src) return configured;
  return resolveProductImage(productId, { theme, role: 'search', width: 480 });
}

function CartDrawer({ open, items, onClose, onQty, onRemove, onProduct, onCheckout, theme = 'light' }) {
  const lines = cartLines(items);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const drawerRef = React.useRef(null);
  const previousFocusRef = React.useRef(null);
  const [announcement, setAnnouncement] = React.useState('');

  useLucideIcons([open, count]);

  React.useEffect(() => {
    if (!open || !drawerRef.current) return undefined;
    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const appRoot = drawerRef.current.closest('.store-app');
    const backgroundRegions = appRoot
      ? [...appRoot.querySelectorAll('.editorial-header, .store-main, .store-newsletter-section, .store-footer')]
      : [];
    const backgroundState = backgroundRegions.map((element) => ({
      element,
      hadInert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden'),
    }));
    backgroundRegions.forEach((element) => {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    });

    window.requestAnimationFrame(() => drawerRef.current?.querySelector('button')?.focus());

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.disabled && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      backgroundState.forEach(({ element, hadInert, ariaHidden }) => {
        if (!hadInert) element.removeAttribute('inert');
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current instanceof HTMLElement) previousFocusRef.current.focus();
    };
  }, [open, onClose]);

  function updateQuantity(lineId, productName, quantity) {
    onQty?.(lineId, quantity);
    setAnnouncement(`${productName} quantity changed to ${quantity}.`);
  }

  function removeLine(lineId, productName) {
    onRemove?.(lineId);
    setAnnouncement(`${productName} removed from the preview cart.`);
  }

  return (
    <>
      <div className={`store-cart-backdrop${open ? ' is-open' : ''}`} aria-hidden="true" onClick={onClose} />
      <aside
        ref={drawerRef}
        className={`store-cart-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-cart-title"
        aria-hidden={!open}
        inert={!open}
      >
        <p className="commerce-live-region" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
        <header className="store-cart-header">
          <div>
            <p className="editorial-kicker">Your selection</p>
            <h2 id="store-cart-title">Cart <span>({count})</span></h2>
          </div>
          <button type="button" className="store-cart-close" aria-label="Close cart" onClick={onClose}>
            <i data-lucide="x" aria-hidden="true" />
          </button>
        </header>

        <div className="store-cart-body">
          {lines.length === 0 && (
            <div className="store-cart-empty" role="status">
              <span aria-hidden="true"><i data-lucide="shopping-cart" /></span>
              <h3>Nothing selected yet</h3>
              <p>Choose from the range or build one around your ride.</p>
            </div>
          )}

          {lines.map(({ lineId, product, quantity, unitPrice, configuration }, index) => {
            const preview = cartLinePreview(configuration, theme, product.id);
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
              <article className="store-cart-item" key={lineId}>
                <span className="store-cart-item__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <button type="button" className="store-cart-item-image" aria-label={`View ${product.name}`} onClick={() => onProduct(product.id)}>
                  <img
                    src={preview.src}
                    srcSet={preview.srcSet}
                    sizes={preview.sizes || '116px'}
                    style={preview.style}
                    data-product-scale={preview.registration?.scale}
                    data-product-baseline={preview.registration?.baseline}
                    alt=""
                  />
                </button>
                <div className="store-cart-item__content">
                  <div className="store-cart-item__heading">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{configuredSummary}</p>
                    </div>
                    <button type="button" className="store-cart-remove" onClick={() => removeLine(lineId, product.name)} aria-label={`Remove ${product.name} from cart`}>
                      <i data-lucide="trash-2" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="store-cart-item-controls">
                    <QuantityStepper
                      className="store-cart-quantity"
                      value={quantity}
                      min={1}
                      max={5}
                      label={product.name}
                      onChange={(value) => updateQuantity(lineId, product.name, value)}
                      style={{ borderRadius: 0, background: 'transparent', borderColor: 'var(--editorial-line)' }}
                    />
                    <strong>₹{(unitPrice * quantity).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {lines.length > 0 && (
          <footer className="store-cart-footer">
            <div className="store-cart-subtotal">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>
            <p>Indicative subtotal. Tax, delivery and final availability are confirmed by Finspeed.</p>
            <p className="store-cart-preview-note">Preview only — checkout will not reserve a bicycle or collect payment.</p>
            <button type="button" className="editorial-cta editorial-cta--primary store-cart-checkout" onClick={onCheckout}>
              Preview checkout <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
            <div className="store-cart-assurance">
              <span><i data-lucide="truck" aria-hidden="true" /> Confirm delivery</span>
              <span><i data-lucide="shield-check" aria-hidden="true" /> Ask for warranty terms</span>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
