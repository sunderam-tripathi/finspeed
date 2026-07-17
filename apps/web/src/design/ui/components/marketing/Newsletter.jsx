import React from 'react';
import { Button } from '../core/Button.jsx';
import {
  NEWSLETTER_CONTACT_EMAIL,
  buildNewsletterMailto,
  deliverNewsletterSubscription,
} from '../../../lib/newsletter-actions.mjs';

const ENV_NEWSLETTER_ENDPOINT = typeof process !== 'undefined'
  ? process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''
  : '';

/**
 * Finspeed newsletter band. A configured endpoint (or supplied onSubmit)
 * receives the address; without one, the component exposes an honest mailto
 * action instead of pretending that an address was stored.
 */
export function Newsletter({
  eyebrow = 'Join the network',
  title = 'Ride beyond boundaries',
  description = null,
  placeholder = 'you@email.com',
  cta = 'Subscribe',
  onSubmit = null,
  endpoint = ENV_NEWSLETTER_ENDPOINT,
  fallbackEmail = NEWSLETTER_CONTACT_EMAIL,
  align = 'left',
  tone = 'light',
  className = '',
  style = {},
  ...rest
}) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const inputId = React.useId();
  const feedbackId = `${inputId}-feedback`;
  const dark = tone === 'dark';
  const centered = align === 'center';
  const canSubmitDirectly = Boolean(onSubmit || endpoint?.trim());
  const fallbackHref = buildNewsletterMailto(fallbackEmail);
  const sectionClassName = [
    'store-newsletter',
    dark ? 'fin-dark store-newsletter--dark' : 'fin-light store-newsletter--light',
    centered ? 'store-newsletter--centered' : '',
    className,
  ].filter(Boolean).join(' ');

  async function submit(event) {
    event.preventDefault();
    setStatus('submitting');

    try {
      await deliverNewsletterSubscription({ email, endpoint: endpoint?.trim(), onSubmit });
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={sectionClassName} style={style} {...rest}>
      <div className="store-newsletter__inner">
        <div className="store-newsletter__copy">
          <p className="store-newsletter__eyebrow">{eyebrow}</p>
          <span className="store-newsletter__rule" aria-hidden="true" />
          <h2>{title}</h2>
          {description && <p className="store-newsletter__description">{description}</p>}
        </div>

        <div className="store-newsletter__interaction" aria-live="polite">
          {!canSubmitDirectly ? (
            <div className="store-newsletter__fallback">
              <p>Email Finspeed to request ride updates. Nothing is submitted from this page.</p>
              <a className="store-newsletter__mail-action" href={fallbackHref}>
                <span>Request updates by email</span>
                <i data-lucide="mail" aria-hidden="true" />
              </a>
            </div>
          ) : status === 'success' ? (
            <div className="store-newsletter__feedback store-newsletter__feedback--success" role="status">
              <i data-lucide="check-circle" aria-hidden="true" />
              <div>
                <strong>Your subscription was confirmed.</strong>
                <span>Look out for the next Finspeed release.</span>
              </div>
              <button type="button" onClick={() => setStatus('idle')}>Use another email</button>
            </div>
          ) : (
            <form className="store-newsletter__form" onSubmit={submit} aria-busy={status === 'submitting'}>
              <label htmlFor={inputId}>Email address</label>
              <div className="store-newsletter__form-row">
                <input
                  id={inputId}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={placeholder}
                  aria-describedby={status === 'error' ? feedbackId : undefined}
                />
                <Button
                  className="store-newsletter__submit"
                  type="submit"
                  variant="primary"
                  bevel
                  disabled={status === 'submitting'}
                  iconRight={<i data-lucide="arrow-right" aria-hidden="true" />}
                >
                  {status === 'submitting' ? 'Subscribing...' : cta}
                </Button>
              </div>
              <p className="store-newsletter__privacy">Product updates only. Unsubscribe at any time.</p>
              {status === 'error' && (
                <p id={feedbackId} className="store-newsletter__error" role="alert">
                  We could not confirm your subscription.{' '}
                  <a href={fallbackHref}>Request updates by email instead.</a>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
