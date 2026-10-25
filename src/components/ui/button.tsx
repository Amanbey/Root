import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white border border-emerald-400/40 hover:bg-emerald-500 hover:border-emerald-300 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.45)] hover:ring-1 hover:ring-emerald-400/50 shadow-md shadow-emerald-950/50",
        outline:
          "border border-slate-700/80 bg-slate-900/60 text-slate-200 hover:bg-slate-800/90 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] hover:ring-1 hover:ring-emerald-400/40 aria-expanded:bg-muted aria-expanded:text-foreground dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-900/80 dark:hover:border-emerald-400/80",
        secondary:
          "bg-secondary text-secondary-foreground border border-slate-700/60 hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] hover:border-teal-400/80 hover:shadow-[0_0_18px_-3px_rgba(20,184,166,0.35)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "border border-transparent hover:border-emerald-500/40 hover:bg-slate-800/60 hover:text-emerald-300 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-red-950/40 text-red-200 border border-red-500/40 hover:bg-red-900/60 hover:text-white hover:border-red-400 hover:shadow-[0_0_20px_-3px_rgba(239,68,68,0.4)] focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-emerald-400 underline-offset-4 hover:underline hover:text-emerald-300 hover:translate-y-0 hover:shadow-none",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
