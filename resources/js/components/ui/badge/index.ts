import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { borderColorClass, mutedBodyTextClass } from "@/components/classNames"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white [a&]:hover:bg-indigo-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 [a&]:hover:bg-slate-200 dark:[a&]:hover:bg-slate-700",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-500 dark:bg-red-600/80",
        outline: `${borderColorClass} ${mutedBodyTextClass} [a&]:hover:bg-slate-100 dark:[a&]:hover:bg-slate-800`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
export type Variant = NonNullable<BadgeVariants['variant']>
