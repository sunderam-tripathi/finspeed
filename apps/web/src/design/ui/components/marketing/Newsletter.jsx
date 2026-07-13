import React from 'react';
import { Button } from '../core/Button.jsx';

/**
 * Finspeed Newsletter — email-capture band ("Join the Network" energy).
 * Eyebrow + cyan accent rule + display headline + inline email field.
 * `tone="dark"` flips it onto the performance ink surface where cyan glows.
 */
export function Newsletter({
  eyebrow = 'Join the network',
  title = 'Ride beyond boundaries',
  description = null,
  placeholder = 'you@email.com',
  cta = 'Subscribe',
  onSubmit = null,
  align = 'left',          // 'left' | 'center'
  tone = 'light',          // 'light' | 'dark'
  style = {},
  ...rest
}) {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  const dark = tone === 'dark';

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    if (onSubmit) onSubmit(email);
    setDone(true);
  };

  const centered = align === 'center';

  return (
    <section
      className={dark ? 'fin-dark' : undefined}
      style={{
        background: dark ? 'var(--ink-900)' : 'var(--surface-sunken)',
        color: 'var(--text-body)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-7) var(--space-7)',
        ...style,
      }}
      {...rest}
    >
      <div style={{
        maxWidth: 560,
        margin: centered ? '0 auto' : 0,
        textAlign: centered ? 'center' : 'left',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        alignItems: centered ? 'center' : 'flex-start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: centered ? 'center' : 'flex-start' }}>
          <span style={{ font: 'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--brand-ink)' }}>{eyebrow}</span>
          <span aria-hidden="true" style={{ width: 56, height: 3, background: 'var(--brand)', display: 'block' }}></span>
          <h2 style={{ font: 'var(--fw-bold) var(--fs-3xl)/1.05 var(--font-display)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
          {description && (
            <p style={{ font: 'var(--text-body-md)', color: 'var(--text-muted)', margin: 0, maxWidth: 460 }}>{description}</p>
          )}
        </div>

        {done ? (
          <p role="status" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', font: 'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color: 'var(--brand-ink)', margin: 0 }}>
            <i data-lucide="check-circle" style={{ width: 18, height: 18 }}></i>
            You're on the list — welcome aboard.
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', gap: 'var(--space-3)', width: '100%', maxWidth: 460, flexWrap: 'wrap' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-label="Email address"
              style={{
                flex: '1 1 200px',
                height: 46,
                padding: '0 16px',
                font: 'var(--fw-regular) var(--fs-sm)/1 var(--font-body)',
                color: 'var(--text-strong)',
                background: 'var(--surface-card)',
                border: 'var(--border-width) solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                transition: 'var(--transition-base)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--focus-ring)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--cyan-100)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <Button type="submit" variant="primary">{cta}</Button>
          </form>
        )}
      </div>
    </section>
  );
}
