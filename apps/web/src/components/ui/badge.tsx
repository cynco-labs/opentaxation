/* eslint-disable react-refresh/only-export-components -- Standard shadcn/ui pattern exports component variants alongside components */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-brand-rose focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-muted-rose text-brand-espresso hover:bg-brand-muted-rose/80",
        secondary:
          "border-transparent bg-brand-muted-ivory text-brand-espresso hover:bg-brand-muted-ivory/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border-brand-border-ivory text-brand-espresso bg-transparent",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

