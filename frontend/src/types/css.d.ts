// Type definitions for CSS modules
import 'tailwindcss/tailwind.css'

declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

// Add type declarations for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

// Add type declarations for Tailwind CSS
declare module 'tailwindcss/tailwind.css' {
  const content: never
  export default content
}

// Add type declarations for @apply directive
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
  const apply: (className: string) => string
  export { apply }
}

// Add type declarations for @tailwind directive
declare module 'tailwindcss/tailwind.css' {
  const tailwind: {
    base: string
    components: string
    utilities: string
  }
  export default tailwind
}

// Add type declarations for @layer directive
declare global {
  namespace JSX {
    interface IntrinsicElements {
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement> & {
        jsx?: boolean
        global?: boolean
      }
    }
  }
}
