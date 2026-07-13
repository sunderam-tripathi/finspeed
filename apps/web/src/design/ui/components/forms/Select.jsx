import React from 'react';

/**
 * Finspeed Select — native-styled dropdown with label.
 */
export function Select({ label, options = [], value, onChange, id, style = {}, ...rest }) {
  const selId = id || (label ? 'sel-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label && (
        <label htmlFor={selId} style={{
          font: 'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)',
          color: 'var(--text-strong)',
          letterSpacing: 'var(--tracking-wide)',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selId}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            height: 46,
            padding: '0 40px 0 14px',
            font: 'var(--fw-medium) var(--fs-sm)/1 var(--font-body)',
            color: 'var(--text-strong)',
            background: 'var(--surface-card)',
            border: 'var(--border-width) solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            transition: 'var(--transition-base)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--focus-ring)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--cyan-100)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
          {...rest}
        >
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
        <span style={{ position: 'absolute', right: 14, pointerEvents: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>▾</span>
      </div>
    </div>
  );
}
