import React from 'react';

/**
 * Finspeed Logo lockup — emblem mark + FINSPEED wordmark.
 * `tone` switches between dark-on-light and light-on-dark.
 * Pass `markSrc`/`markSrcLight` to point at the asset location for your page.
 */
export function Logo({
  tone = 'dark',
  showWordmark = true,
  size = 36,
  markSrc = 'assets/logos/finspeed-mark.png',
  markSrcLight = 'assets/logos/finspeed-mark-light.png',
  style = {},
  ...rest
}) {
  const light = tone === 'light';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', ...style }} {...rest}>
      <img
        src={light ? markSrcLight : markSrc}
        alt="Finspeed"
        style={{ height: size, width: size, objectFit: 'contain', display: 'block' }}
      />
      {showWordmark && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-bold)',
          fontSize: size * 0.62,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: light ? 'var(--white)' : 'var(--ink-900)',
          lineHeight: 1,
        }}>
          Finspeed
        </span>
      )}
    </span>
  );
}
