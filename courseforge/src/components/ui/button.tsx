import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-slate-800/90 text-slate-100 border border-slate-700/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-400 hover:text-slate-950 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/25 font-bold transition-all duration-200",
        outline:
          "border border-slate-700/80 bg-slate-900/80 text-slate-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-400 hover:text-slate-950 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/25 font-bold transition-all duration-200",
        secondary:
          "bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/50 hover:shadow-md hover:shadow-emerald-500/10",
        ghost:
          "text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30 border border-transparent",
        destructive:
          "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:shadow-lg hover:shadow-red-500/20",
        link: "text-emerald-400 underline-offset-4 hover:underline hover:scale-105",
        brand:
          "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.04] active:scale-95 transition-all duration-200",
      },
      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-12 gap-2.5 px-6 text-base rounded-xl",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
