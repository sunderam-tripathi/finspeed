import React from 'react';

/**
 * Finspeed Tag — a filter / category chip. Selectable.
 */
export function Tag({ children, selected = false, onClick, style = {}, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height: 34,
        padding: '0 16px',
        font: 'var(--fw-medium) var(--fs-sm)/1 var(--font-body)',
        color: selected ? 'var(--on-brand)' : 'var(--text-body)',
        background: selected ? 'var(--brand)' : 'transparent',
        border: 'var(--border-width) solid ' + (selected ? 'var(--brand)' : 'var(--border-strong)'),
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        transition: 'var(--transition-base)',
        ...style,
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--ink-900)'; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
