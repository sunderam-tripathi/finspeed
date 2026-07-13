import React from 'react';

/**
 * Finspeed Radio + RadioGroup.
 * Single circular radio, or a RadioGroup driven by an `options` array.
 */
export function Radio({
  label,
  hint,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const [focused, setFocused] = React.useState(false);
  const on = isControlled ? checked : internal;
  const rId = id || (value ? 'rb-' + String(value).replace(/\s+/g, '-').toLowerCase() : undefined);
  const handle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return (
    <label htmlFor={rId} style={{
      display: 'inline-flex', alignItems: 'flex-start', gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <input
        id={rId} type="radio" name={name} value={value} checked={on} onChange={handle} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0 }}
        {...rest}
      />
      <span aria-hidden="true" style={{
        flex: 'none', width: 20, height: 20, marginTop: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface-card)',
        border: 'var(--border-width-bold) solid ' + (on ? 'var(--brand)' : 'var(--border-strong)'),
        borderRadius: 'var(--radius-pill)',
        boxShadow: focused ? '0 0 0 3px var(--cyan-100)' : 'none',
        transition: 'var(--transition-base)',
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: 'var(--radius-pill)',
          background: 'var(--brand)', transform: on ? 'scale(1)' : 'scale(0)',
          transition: 'var(--transition-base)',
        }} />
      </span>
      {(label || hint) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && <span style={{ font: 'var(--fw-medium) var(--fs-sm)/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{label}</span>}
          {hint && <span style={{ font: 'var(--fw-regular) var(--fs-2xs)/1.35 var(--font-body)', color: 'var(--text-muted)' }}>{hint}</span>}
        </span>
      )}
    </label>
  );
}

/**
 * RadioGroup — manages selection across an `options` array.
 * options: string[] | { value, label, hint? }[]
 */
export function RadioGroup({ name, value, defaultValue, onChange, options = [], style = {} }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = isControlled ? value : internal;
  const reactId = React.useId();
  const groupName = name || reactId;
  const handle = (val) => {
    if (!isControlled) setInternal(val);
    onChange && onChange(val);
  };
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      {options.map((o) => {
        const val = typeof o === 'string' ? o : o.value;
        const lab = typeof o === 'string' ? o : o.label;
        const hint = typeof o === 'string' ? undefined : o.hint;
        return (
          <Radio key={val} name={groupName} value={val} label={lab} hint={hint}
            checked={selected === val} onChange={() => handle(val)} />
        );
      })}
    </div>
  );
}
