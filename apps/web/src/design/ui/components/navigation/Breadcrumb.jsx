import React from 'react';

/**
 * Finspeed Breadcrumb — compact wayfinding trail.
 * Mono uppercase, wide-tracked; cyan hover on links; current item is ink.
 */
export function Breadcrumb({
  items = [],
  separator = 'slash',   // 'slash' | 'chevron'
  style = {},
  ...rest
}) {
  const Sep = () => (
    separator === 'chevron'
      ? <i data-lucide="chevron-right" style={{ width: 13, height: 13, color: 'var(--text-faint)', flex: 'none' }}></i>
      : <span aria-hidden="true" style={{ color: 'var(--border-strong)', flex: 'none' }}>/</span>
  );

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        font: 'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
        ...style,
      }}
      {...rest}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const interactive = !last && (item.href || item.onClick);
        return (
          <React.Fragment key={i}>
            {interactive ? (
              <a
                href={item.href || '#'}
                onClick={(e) => { if (item.onClick) { e.preventDefault(); item.onClick(e); } }}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color var(--dur-fast) var(--ease-out)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-ink)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >{item.label}</a>
            ) : (
              <span aria-current={last ? 'page' : undefined} style={{ color: last ? 'var(--text-strong)' : 'var(--text-muted)' }}>{item.label}</span>
            )}
            {!last && <Sep />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
