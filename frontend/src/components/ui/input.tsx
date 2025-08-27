import * as React from "react"
import { cn } from "@/lib/utils"

type InputVariant = "default" | "error" | "success"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          {
            "focus:ring-2 focus:ring-primary/20 focus:border-primary":
              variant === "default",
            "border-destructive focus:ring-destructive/20 focus:border-destructive":
              variant === "error",
            "border-success focus:ring-success/20 focus:border-success":
              variant === "success",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
