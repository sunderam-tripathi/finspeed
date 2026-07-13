import React from 'react';

/**
 * Finspeed Input — text field with optional label, leading icon, and error.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft = null,
  id,
  style = {},
  ...rest
}) {
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          font: 'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)',
          color: 'var(--text-strong)',
          letterSpacing: 'var(--tracking-wide)',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {iconLeft && (
          <span style={{ position: 'absolute', left: 14, display: 'inline-flex', color: 'var(--text-faint)' }}>{iconLeft}</span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            height: 46,
            padding: iconLeft ? '0 14px 0 42px' : '0 14px',
            font: 'var(--fw-regular) var(--fs-sm)/1 var(--font-body)',
            color: 'var(--text-strong)',
            background: 'var(--surface-card)',
            border: 'var(--border-width) solid ' + (error ? 'var(--danger)' : 'var(--border-strong)'),
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            transition: 'var(--transition-base)',
          }}
          onFocus={(e) => { if (!error) { e.currentTarget.style.borderColor = 'var(--focus-ring)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--cyan-100)'; } }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
          {...rest}
        />
      </div>
      {(error || hint) && (
        <span style={{ font: 'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-body)', color: error ? 'var(--danger)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
