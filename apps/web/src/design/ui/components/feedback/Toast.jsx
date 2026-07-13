import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/**
 * Finspeed Toast — transient confirmation/feedback notice.
 * Ink surface, electric-cyan accent icon. Rises and fades (no bounce).
 * Presentational: the host controls mount/visibility via `open`.
 */
export function Toast({
  children,
  message,
  tone = 'default',
  icon = null,
  open = true,
  onClose = null,
  style = {},
  ...rest
}) {
  const accents = {
    default: 'var(--cyan-electric)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    info: 'var(--cyan-electric)',
  };
  const accent = accents[tone] || accents.default;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '12px 14px 12px 18px',
        background: 'var(--ink-900)',
        color: 'var(--white)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--ink-700)',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span style={{ display: 'inline-flex', color: accent, flex: 'none' }}>{icon}</span>
      )}
      <span style={{ font: 'var(--fw-medium) var(--fs-sm)/1.3 var(--font-body)', whiteSpace: 'nowrap' }}>
        {message || children}
      </span>
      {onClose && (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Dismiss"
          onClick={onClose}
          icon={<i data-lucide="x" style={{ width: 16, height: 16 }}></i>}
          style={{ color: 'var(--text-faint)', width: 30, height: 30, marginLeft: 'var(--space-1)' }}
        />
      )}
    </div>
  );
}
