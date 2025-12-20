/* eslint-disable react-refresh/only-export-components -- Standard shadcn/ui pattern exports component variants alongside components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium uppercase tracking-wider ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-target",
  {
    variants: {
      variant: {
        default: "bg-brand-gold text-brand-espresso hover:bg-brand-gold/90 shadow-soft hover:shadow-soft-hover",
        cta: "bg-brand-gold text-brand-espresso hover:bg-brand-gold/90 shadow-soft hover:shadow-soft-hover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-brand-border-ivory bg-brand-ivory text-brand-espresso hover:bg-brand-muted-ivory hover:border-brand-rose/40",
        "outline-dark": "border border-brand-border-maroon bg-transparent text-brand-on-maroon hover:bg-brand-maroon/20",
        secondary: "bg-brand-muted-rose text-brand-espresso hover:bg-brand-muted-rose/80",
        ghost: "hover:bg-brand-muted-ivory hover:text-brand-espresso",
        link: "text-brand-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-7 py-3.5",
        sm: "h-11 px-5 py-3",
        lg: "h-14 px-10 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
