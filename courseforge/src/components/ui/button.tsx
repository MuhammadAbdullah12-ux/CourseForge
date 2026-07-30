import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-100 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white shadow-md hover:-translate-y-0.5 hover:shadow-slate-900/50",
        destructive:
          "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20",
        outline:
          "border border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:text-slate-950 hover:border-emerald-300 hover:font-bold hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25",
        secondary:
          "bg-slate-800/80 text-slate-200 border border-slate-700/60 hover:bg-slate-700/80 hover:text-white hover:border-slate-600 hover:-translate-y-0.5",
        ghost: "text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400",
        link: "text-emerald-400 underline-offset-4 hover:underline hover:text-emerald-300",
        brand:
          "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-extrabold hover:from-emerald-400 hover:to-teal-300 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  ? React.ButtonHTMLAttributes<HTMLButtonElement>
  : React.ButtonHTMLAttributes<HTMLButtonElement> &
      VariantProps<typeof buttonVariants> & {
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
