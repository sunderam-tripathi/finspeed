import React from 'react';

/**
 * Finspeed Pagination — numbered page control with prev/next.
 * Square hardware-feel cells; active page is a cyan fill; ellipsis collapses runs.
 */
export function Pagination({
  page = 1,
  pageCount = 1,
  onChange = null,
  siblingCount = 1,
  style = {},
  ...rest
}) {
  if (pageCount <= 1) return null;

  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const pages = (() => {
    const total = siblingCount * 2 + 5; // first, last, current, 2 ellipses
    if (pageCount <= total) return range(1, pageCount);
    const left = Math.max(page - siblingCount, 1);
    const right = Math.min(page + siblingCount, pageCount);
    const showLeftDots = left > 2;
    const showRightDots = right < pageCount - 1;
    if (!showLeftDots && showRightDots) return [...range(1, siblingCount * 2 + 3), 'r', pageCount];
    if (showLeftDots && !showRightDots) return [1, 'l', ...range(pageCount - (siblingCount * 2 + 2), pageCount)];
    return [1, 'l', ...range(left, right), 'r', pageCount];
  })();

  const go = (p) => { if (p >= 1 && p <= pageCount && p !== page && onChange) onChange(p); };

  const cell = (active) => ({
    minWidth: 40,
    height: 40,
    padding: '0 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: active ? 'var(--brand)' : 'transparent',
    color: active ? 'var(--on-brand)' : 'var(--text-strong)',
    border: 'var(--border-width) solid ' + (active ? 'var(--brand)' : 'var(--border-strong)'),
    borderRadius: 'var(--radius-sm)',
    font: 'var(--fw-semibold) var(--fs-sm)/1 var(--font-mono)',
    cursor: active ? 'default' : 'pointer',
    transition: 'var(--transition-base)',
  });

  const arrow = (disabled) => ({
    width: 40, height: 40,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
    color: disabled ? 'var(--text-faint)' : 'var(--text-strong)',
    border: 'var(--border-width) solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'var(--transition-base)',
  });

  const hoverIn = (e) => { if (e.currentTarget.dataset.active !== '1' && !e.currentTarget.disabled) { e.currentTarget.style.background = 'var(--surface-sunken)'; e.currentTarget.style.borderColor = 'var(--border-ink)'; } };
  const hoverOut = (e, active) => { if (active) return; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-strong)'; };

  return (
    <nav
      aria-label="Pagination"
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', ...style }}
      {...rest}
    >
      <button type="button" aria-label="Previous page" disabled={page <= 1} style={arrow(page <= 1)}
        onClick={() => go(page - 1)} onMouseEnter={hoverIn} onMouseLeave={(e) => hoverOut(e, false)}>
        <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
      </button>

      {pages.map((p, i) =>
        p === 'l' || p === 'r' ? (
          <span key={p + i} style={{ minWidth: 28, textAlign: 'center', color: 'var(--text-faint)', font: 'var(--fw-semibold) var(--fs-sm)/1 var(--font-mono)' }}>…</span>
        ) : (
          <button key={p} type="button" aria-label={'Page ' + p} aria-current={p === page ? 'page' : undefined}
            data-active={p === page ? '1' : '0'} style={cell(p === page)} onClick={() => go(p)}
            onMouseEnter={hoverIn} onMouseLeave={(e) => hoverOut(e, p === page)}>
            {p}
          </button>
        )
      )}

      <button type="button" aria-label="Next page" disabled={page >= pageCount} style={arrow(page >= pageCount)}
        onClick={() => go(page + 1)} onMouseEnter={hoverIn} onMouseLeave={(e) => hoverOut(e, false)}>
        <i data-lucide="chevron-right" style={{ width: 18, height: 18 }}></i>
      </button>
    </nav>
  );
}
