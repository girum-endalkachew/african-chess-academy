import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#EEF3FA] text-[#368AE4]",
        blue: "bg-[#368AE4] text-white",
        navy: "bg-[#0B1528] text-white",
        outline: "border border-white/70 bg-white/40 text-[#64748B] backdrop-blur",
        success: "bg-emerald-50 text-emerald-600",
        warning: "bg-amber-50 text-amber-600",
        danger: "bg-red-50 text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
