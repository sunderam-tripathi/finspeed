// Material 3 Design Tokens
export const tokens = {
  // Elevation levels
  elevation: {
    0: 'none',
    1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
  },
  
  // Animation timings
  motion: {
    short1: '100ms',
    short2: '200ms',
    short3: '250ms',
    medium1: '300ms',
    medium2: '400ms',
    long1: '500ms',
    long2: '700ms',
  },
  
  // Shape
  shape: {
    corner: {
      none: '0',
      extraSmall: '4px',
      small: '8px',
      medium: '12px',
      large: '16px',
      extraLarge: '28px',
      full: '9999px',
    },
  },
  
  // State layers
  state: {
    hover: 0.08,
    focus: 0.12,
    press: 0.12,
    drag: 0.16,
  },
} as const;

export type ThemeTokens = typeof tokens;
