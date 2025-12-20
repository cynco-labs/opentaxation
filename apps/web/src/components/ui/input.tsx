import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 sm:h-11 w-full rounded-full border border-brand-border-ivory bg-brand-muted-ivory px-5 py-3 text-base sm:text-sm text-brand-espresso ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-espresso/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose focus-visible:ring-offset-2 focus-visible:shadow-soft disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
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
