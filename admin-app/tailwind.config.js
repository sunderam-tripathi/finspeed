/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map Material You tokens to Tailwind color names used in the codebase
        primary: {
          DEFAULT: 'var(--md-sys-color-primary)',
          50: 'var(--md-sys-color-primary)',
          100: 'var(--md-sys-color-primary)',
          200: 'var(--md-sys-color-primary)',
          300: 'var(--md-sys-color-primary)',
          400: 'var(--md-sys-color-primary)',
          500: 'var(--md-sys-color-primary)',
          600: 'var(--md-sys-color-primary)',
          700: 'var(--md-sys-color-primary)',
          800: 'var(--md-sys-color-primary)',
          900: 'var(--md-sys-color-primary)'
        },
        secondary: {
          DEFAULT: 'var(--md-sys-color-secondary)',
          600: 'var(--md-sys-color-secondary)',
          700: 'var(--md-sys-color-secondary)'
        },
        surface: {
          DEFAULT: 'var(--md-sys-color-surface)',
          container: 'var(--md-sys-color-surface-container)'
        },
        outline: {
          DEFAULT: 'var(--md-sys-color-outline)',
          variant: 'var(--md-sys-color-outline-variant)'
        }
      },
      borderColor: {
        DEFAULT: 'var(--md-sys-color-outline-variant)'
      }
    },
  },
  plugins: [],
}
