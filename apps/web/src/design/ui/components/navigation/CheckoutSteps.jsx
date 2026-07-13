import React from 'react';

/**
 * Finspeed CheckoutSteps — numbered horizontal progress for multi-step flows.
 * steps: string[] | { label, sub? }[]
 * current: zero-based index of the active step.
 */
export function CheckoutSteps({ steps = [], current = 0, style = {} }) {
  const norm = steps.map((s) => (typeof s === 'string' ? { label: s } : s));
  return (
    <ol style={{
      display: 'flex', alignItems: 'flex-start', listStyle: 'none', margin: 0, padding: 0,
      ...style,
    }}>
      {norm.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === norm.length - 1;
        const ring = done || active ? 'var(--brand)' : 'var(--border-strong)';
        return (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: last ? '0 0 auto' : '1 1 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 'none' }}>
              <span aria-current={active ? 'step' : undefined} style={{
                width: 32, height: 32, borderRadius: 'var(--radius-pill)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                font: 'var(--fw-bold) var(--fs-xs)/1 var(--font-mono)',
                background: done ? 'var(--brand)' : active ? 'var(--surface-card)' : 'var(--surface-card)',
                color: done ? 'var(--on-brand)' : active ? 'var(--brand-ink)' : 'var(--text-faint)',
                border: 'var(--border-width-bold) solid ' + ring,
                transition: 'var(--transition-base)',
              }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : i + 1}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 120, textAlign: 'center' }}>
                <span style={{
                  font: (active ? 'var(--fw-semibold)' : 'var(--fw-medium)') + ' var(--fs-2xs)/1.2 var(--font-mono)',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  color: active ? 'var(--text-strong)' : done ? 'var(--text-body)' : 'var(--text-faint)',
                }}>{s.label}</span>
                {s.sub && <span style={{ font: 'var(--fw-regular) var(--fs-3xs)/1.2 var(--font-body)', color: 'var(--text-muted)' }}>{s.sub}</span>}
              </span>
            </div>
            {!last && (
              <span style={{
                flex: '1 1 0', height: 'var(--border-width-bold)', marginTop: 15,
                background: done ? 'var(--brand)' : 'var(--border-subtle)',
                transition: 'var(--transition-base)',
              }} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
