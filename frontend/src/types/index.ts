// Button component types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

// Badge component types
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

// Card component types
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// Input component types
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Theme types
export type ThemeMode = 'light' | 'dark'

export interface ThemeState {
  mode: ThemeMode
  seed: string
}

export interface ThemeContextType extends ThemeState {
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  setSeed: (seed: string) => void
}
