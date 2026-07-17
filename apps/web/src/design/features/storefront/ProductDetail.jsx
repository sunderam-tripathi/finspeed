/* eslint-disable @next/next/no-img-element -- native responsive sources preserve the governed product masters */
import React from 'react';
import { Breadcrumb, QuantityStepper } from '../../ui/index.js';
import { productImage, productImageSrcSet, products } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

const categoryLabels = {
  mountain: 'Mountain',
  city: 'City',
  hybrid: 'Hybrid',
};

const supportEmail = 'support@finspeed.online';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPrice(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function ProductDetail({ id, onAdd, onNav, onProduct, onBuyNow, notifyEndpoint }) {
  const product = products.find((item) => item.id === id) || products[0];
  const [quantity, setQuantity] = React.useState(1);
  const [notifyEmail, setNotifyEmail] = React.useState('');
  const [notifyStatus, setNotifyStatus] = React.useState('idle');
  const [notifyFeedback, setNotifyFeedback] = React.useState('');
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const category = categoryLabels[product.tag] || product.tag;
  const related = products.filter((item) => item.tag === product.tag && item.id !== product.id).slice(0, 3);
  const endpoint = notifyEndpoint
    || process.env.NEXT_PUBLIC_PRODUCT_NOTIFY_ENDPOINT
    || process.env.NEXT_PUBLIC_SUPPORT_FORM_ENDPOINT
    || '';
  const validNotifyEmail = emailPattern.test(notifyEmail.trim());
  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(`Finspeed availability · ${product.name}`)}&body=${encodeURIComponent(`Please let me know when the ${product.name} (${product.id}) is available.\n\nContact email: ${notifyEmail.trim()}`)}`;
  const specification = [
    ['Series', product.series],
    ['Category', category],
    ['Wheel size', product.wheels],
    ['Drivetrain', product.speed],
    ['Braking system', product.brakes],
  ];

  useLucideIcons([product.id, soldOut, notifyStatus]);

  function buyNow() {
    if (onBuyNow) {
      onBuyNow(product.id, quantity);
      return;
    }
    onAdd?.(product.id, quantity);
    onNav?.('checkout');
  }

  function openMailFallback(event) {
    if (!validNotifyEmail) {
      event.preventDefault();
      setNotifyStatus('error');
      setNotifyFeedback('Enter a valid email address before preparing the request.');
      return;
    }
    setNotifyStatus('fallback');
    setNotifyFeedback('Your email app is opening. Send the prepared message to complete the request.');
  }

  async function submitNotification(event) {
    event.preventDefault();
    if (!validNotifyEmail) {
      setNotifyStatus('error');
      setNotifyFeedback('Enter a valid email address so we can send an availability update.');
      return;
    }

    if (!endpoint) {
      window.location.href = mailto;
      setNotifyStatus('fallback');
      setNotifyFeedback('Your email app is opening. Send the prepared message to complete the request.');
      return;
    }

    setNotifyStatus('submitting');
    setNotifyFeedback('');
    try {
      const payload = new FormData();
      payload.append('email', notifyEmail.trim());
      payload.append('productId', product.id);
      payload.append('productName', product.name);
      payload.append('source', 'product-detail-availability');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload,
      });
      if (!response.ok) throw new Error('The availability request could not be sent.');
      setNotifyStatus('success');
      setNotifyFeedback(`Request received. We will contact ${notifyEmail.trim()} when availability changes.`);
      setNotifyEmail('');
    } catch (error) {
      setNotifyStatus('error');
      setNotifyFeedback(error instanceof Error ? error.message : 'The availability request could not be sent.');
    }
  }

  return (
    <article className="product-editorial-page">
      <div className="product-editorial-breadcrumb">
        <Breadcrumb
          items={[
            { label: 'Home', onClick: () => onNav('home') },
            { label: 'The bikes', onClick: () => onNav('shop') },
            { label: product.name },
          ]}
        />
      </div>

      <section className="product-editorial-hero store-product-layout" aria-labelledby="product-title">
        <div className="product-editorial-stage store-product-gallery">
          <div className="product-editorial-stage__topline">
            <span>{product.series}</span>
            {product.badge ? <span className="product-editorial-badge">{product.badge}</span> : null}
          </div>
          <div className="product-editorial-stage__image">
            <img
              src={productImage(product.id, 1600)}
              srcSet={productImageSrcSet(product.id)}
              sizes="(max-width: 900px) 100vw, 60vw"
              alt={`Finspeed ${product.name} bicycle in side profile`}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <dl className="product-editorial-stage__specs" aria-label={`${product.name} key specifications`}>
            <div><dt>Wheels</dt><dd>{product.wheels}</dd></div>
            <div><dt>Drive</dt><dd>{product.speed}</dd></div>
            <div><dt>Brakes</dt><dd>{product.brakes}</dd></div>
            <div><dt>Category</dt><dd>{category}</dd></div>
          </dl>
        </div>

        <div className="product-editorial-info store-product-info">
          <p className="editorial-kicker">{product.series}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-editorial-subtitle">{product.sub}</p>
          <p className="product-editorial-rating" aria-label={`${product.rating} out of 5 from ${product.reviews} rider reviews`}>
            <strong>{product.rating.toFixed(1)}</strong> / 5 <span>·</span> {product.reviews} rider reviews
          </p>

          <div className="product-editorial-price">
            <strong>{formatPrice(product.price)}</strong>
            {product.mrp ? <span>List {formatPrice(product.mrp)}</span> : null}
          </div>
          <p className="product-editorial-description">{product.desc}</p>

          <button type="button" className="product-editorial-fit-link editorial-text-link" onClick={() => onNav('stores')}>
            <i data-lucide="ruler" aria-hidden="true" /> Confirm your fit with a dealer
            <i data-lucide="arrow-right" aria-hidden="true" />
          </button>

          <div className="product-editorial-purchase">
            {soldOut ? (
              <AvailabilityForm
                product={product}
                email={notifyEmail}
                setEmail={setNotifyEmail}
                endpoint={endpoint}
                validEmail={validNotifyEmail}
                mailto={mailto}
                status={notifyStatus}
                feedback={notifyFeedback}
                onSubmit={submitNotification}
                onMailFallback={openMailFallback}
              />
            ) : (
              <>
                <p className={`product-editorial-stock${lowStock ? ' is-low' : ''}`}>
                  <span aria-hidden="true" />
                  {lowStock ? `Only ${product.stock} remaining` : 'Available to order'}
                </p>
                <div className="product-editorial-actions store-product-actions">
                  <div className="product-editorial-quantity">
                    <span>Quantity</span>
                    <QuantityStepper
                      value={quantity}
                      min={1}
                      max={Math.min(5, product.stock || 5)}
                      onChange={setQuantity}
                    />
                  </div>
                  <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onAdd(product.id, quantity)}>
                    Add to cart <i data-lucide="shopping-cart" aria-hidden="true" />
                  </button>
                  <button type="button" className="editorial-cta product-editorial-buy" onClick={buyNow}>
                    Buy now <i data-lucide="arrow-right" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="product-editorial-specification" aria-labelledby="product-specification-title">
        <div className="product-editorial-specification__intro">
          <p className="editorial-kicker">The essentials</p>
          <h2 id="product-specification-title">The specification,<br />without the noise.</h2>
          <p>{product.desc}</p>
        </div>
        <dl className="product-editorial-specification__table">
          {specification.map(([term, detail], index) => (
            <div key={term}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length ? (
        <section className="product-editorial-related" aria-labelledby="related-products-title">
          <div className="product-editorial-related__heading">
            <div>
              <p className="editorial-kicker">Continue exploring</p>
              <h2 id="related-products-title">More from {category.toLowerCase()}.</h2>
            </div>
            <button type="button" className="editorial-text-link" onClick={() => onNav('shop', product.tag)}>
              View the range <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          </div>
          <div className="product-editorial-related__grid">
            {related.map((item, index) => (
              <RelatedProduct key={item.id} product={item} sequence={index + 1} onProduct={onProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function AvailabilityForm({ product, email, setEmail, endpoint, validEmail, mailto, status, feedback, onSubmit, onMailFallback }) {
  const submitting = status === 'submitting';
  return (
    <form className="product-notify" onSubmit={onSubmit} noValidate>
      <div className="product-notify__heading">
        <span className="product-notify__status" aria-hidden="true" />
        <div>
          <strong>Currently unavailable</strong>
          <p>Request an update for the {product.name}.</p>
        </div>
      </div>
      <label htmlFor={`notify-${product.id}`}>Email address</label>
      <div className="product-notify__field">
        <input
          id={`notify-${product.id}`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          required
          aria-describedby={`notify-note-${product.id}`}
        />
        {endpoint ? (
          <button type="submit" className="editorial-cta editorial-cta--primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Notify me'} <i data-lucide="bell" aria-hidden="true" />
          </button>
        ) : (
          <a
            className={`editorial-cta editorial-cta--primary${validEmail ? '' : ' is-disabled'}`}
            href={validEmail ? mailto : undefined}
            aria-disabled={!validEmail}
            onClick={onMailFallback}
          >
            Notify me <i data-lucide="mail" aria-hidden="true" />
          </a>
        )}
      </div>
      <p id={`notify-note-${product.id}`} className="product-notify__note">
        {endpoint
          ? 'Your address is used only for this availability update.'
          : `This opens a prepared message to ${supportEmail}. No request is sent until you send that email.`}
      </p>
      {feedback ? (
        <p className={`product-notify__feedback is-${status}`} role={status === 'error' ? 'alert' : 'status'}>
          {feedback}
          {status === 'error' && endpoint ? <a href={mailto}>Email the request instead</a> : null}
        </p>
      ) : null}
    </form>
  );
}

function RelatedProduct({ product, sequence, onProduct }) {
  return (
    <button
      type="button"
      className="product-editorial-related__item"
      onClick={() => onProduct(product.id)}
      aria-label={`View ${product.name}, ${formatPrice(product.price)}`}
    >
      <span className="product-editorial-related__sequence" aria-hidden="true">{String(sequence).padStart(2, '0')}</span>
      <span className="product-editorial-related__image">
        <img
          src={productImage(product.id, 960)}
          srcSet={productImageSrcSet(product.id)}
          sizes="(max-width: 700px) 82vw, 31vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="product-editorial-related__copy">
        <small>{product.series}</small>
        <strong>{product.name}</strong>
        <span>{formatPrice(product.price)} <i data-lucide="arrow-right" aria-hidden="true" /></span>
      </span>
    </button>
  );
}

export default ProductDetail;
