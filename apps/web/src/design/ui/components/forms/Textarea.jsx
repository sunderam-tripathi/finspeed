import React from 'react';

/**
 * Finspeed Textarea — multiline field matching Input styling.
 */
export function Textarea({
  label,
  hint,
  error,
  rows = 4,
  id,
  style = {},
  ...rest
}) {
  const taId = id || (label ? 'ta-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label && (
        <label htmlFor={taId} style={{
          font: 'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)',
          color: 'var(--text-strong)',
          letterSpacing: 'var(--tracking-wide)',
        }}>{label}</label>
      )}
      <textarea
        id={taId}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px 14px',
          font: 'var(--fw-regular) var(--fs-sm)/1.5 var(--font-body)',
          color: 'var(--text-strong)',
          background: 'var(--surface-card)',
          border: 'var(--border-width) solid ' + (error ? 'var(--danger)' : 'var(--border-strong)'),
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          resize: 'vertical',
          minHeight: 88,
          transition: 'var(--transition-base)',
        }}
        onFocus={(e) => { if (!error) { e.currentTarget.style.borderColor = 'var(--focus-ring)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--cyan-100)'; } }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
        {...rest}
      />
      {(error || hint) && (
        <span style={{ font: 'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-body)', color: error ? 'var(--danger)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
