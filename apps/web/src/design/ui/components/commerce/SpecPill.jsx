import React from 'react';

/**
 * Finspeed SpecPill — small icon + label chip describing a product spec.
 * Pass an icon node (e.g. a Lucide <i>), or omit for label-only.
 */
export function SpecPill({ icon = null, children, style = {}, ...rest }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '7px 12px',
        background: 'var(--surface-sunken)',
        border: 'var(--border-width) solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        font: 'var(--fw-medium) var(--fs-xs)/1 var(--font-body)',
        color: 'var(--text-body)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex', color: 'var(--brand-strong)' }}>{icon}</span>}
      {children}
    </span>
  );
}
