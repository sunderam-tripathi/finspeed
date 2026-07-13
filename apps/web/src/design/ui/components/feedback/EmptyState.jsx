import React from 'react';

/**
 * Finspeed EmptyState — centered icon + title + message + optional action.
 * For empty carts, no search results, empty order history, etc.
 */
export function EmptyState({
  icon,
  title,
  message,
  action,
  compact = false,
  style = {},
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: compact ? 'var(--space-6) var(--space-5)' : 'var(--space-9) var(--space-5)',
      ...style,
    }}>
      {icon && (
        <div style={{
          width: compact ? 52 : 64, height: compact ? 52 : 64, marginBottom: 'var(--space-4)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-sunken)', color: 'var(--text-muted)',
          border: 'var(--border-width) solid var(--border-subtle)',
        }}>{icon}</div>
      )}
      {title && (
        <h3 style={{
          font: 'var(--fw-bold) ' + (compact ? 'var(--fs-lg)' : 'var(--fs-2xl)') + '/1.1 var(--font-display)',
          color: 'var(--text-strong)', letterSpacing: '-0.01em', margin: '0 0 var(--space-2)',
        }}>{title}</h3>
      )}
      {message && (
        <p style={{
          font: 'var(--fw-regular) var(--fs-sm)/1.55 var(--font-body)',
          color: 'var(--text-muted)', margin: 0, maxWidth: 340,
        }}>{message}</p>
      )}
      {action && <div style={{ marginTop: 'var(--space-5)' }}>{action}</div>}
    </div>
  );
}
